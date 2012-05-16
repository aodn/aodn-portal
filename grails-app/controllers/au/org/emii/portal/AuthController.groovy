package au.org.emii.portal

import org.apache.shiro.SecurityUtils
import org.openid4java.consumer.ConsumerManager
import org.openid4java.discovery.DiscoveryInformation
import org.openid4java.message.ParameterList
import org.openid4java.message.ax.*

class AuthController {

    static def consumerManager = new ConsumerManager()

    def index = {

        forward action: "login"
    }

    def register = {
		_authenticateWithOpenId(true)
    }

    def login = {
		_authenticateWithOpenId(false)
    }

    def verifyResponse = {

        // Todo - DN: How to redirect them back to where they were before they clicked 'login' (or 'register', 'logout', etc.)?

        // extract the parameters from the authentication response
        // (which comes in as a HTTP request from the OpenID provider)

        log.debug "request.parameterMap: ${ request.parameterMap }"

        def openidResp = new ParameterList( request.parameterMap )

        // retrieve the previously stored discovery information
        def discovered = session.getAttribute( "discovered" )

        // extract the receiving URL from the HTTP request
        def portalUrl = grailsApplication.config.grails.serverURL
        def receivingURL = portalUrl + ( request.forwardURI - request.contextPath )
        def queryString = request.queryString

        if ( queryString ) {

            receivingURL += "?${ request.queryString }"
        }

        log.debug "receivingURL: $receivingURL"

        // verify the response
        def verification = consumerManager.verify( receivingURL as String,
                                                   openidResp,
                                                   discovered as DiscoveryInformation )

        // examine the verification result and extract the verified identifier
        def verified = verification.getVerifiedId()

        if ( verified ) { // success, use the verified identifier to identify the user

            def userInstance = User.findByOpenIdUrl( verified.identifier )

            if ( !userInstance ) {

                userInstance = new User( openIdUrl: verified.identifier )
                // Todo - DN: Add UserRole 'SelfRegisteredUser'
            }

            // Get values from attribute exchange
            def authResponse = verification.authResponse

            log.debug "authResponse: ${ authResponse }"

            if ( authResponse.hasExtension( AxMessage.OPENID_NS_AX ) )
            {
                // Validate response
                authResponse.validate()

                def ext = authResponse.getExtension( AxMessage.OPENID_NS_AX )

                if ( ext instanceof FetchResponse ) {

                    log.debug "Setting attributes from '$ext'"

                    userInstance.fullName = ext.getAttributeValueByTypeUri( "http://schema.openid.net/namePerson" ) ?: "--None returned form OpenID provider--"
                    userInstance.emailAddress = ext.getAttributeValueByTypeUri( "http://schema.openid.net/contact/email" ) ?: "--None returned form OpenID provider--"
                }
                else {
                    
                    log.warn "Unknown response type from OpenID (ie. not a FetchResponse). ext: '$ext' (${ ext?.class?.name })"
                }
            }
            else {
                
                log.warn "Response doesn't have extension AxMessage.OPENID_NS_AX. Unable to set/update User fields."
            }

            // Save updated User
            userInstance.save flush: true, failOnError: true
            
            // Log the User in
            def authToken = new OpenIdAuthenticationToken( userInstance.id, userInstance.openIdUrl ) // Todo - DN: Remember me option
            SecurityUtils.subject.login authToken
        }
        else { // OpenID authentication failed

            log.info "OpenID authentication failed. verification.statusMsg: ${ verification.statusMsg }; params: $params"

            flash.message = ( params["openid.mode"] == "cancel" ) ? "Log in cancelled." : "Could not log in (${ verification.statusMsg })"
        }

        redirect controller: "home"
    }

    def updateAccount = {

        forward action: "login"
    }

    def logOut = {

        // Log the user out of the application.
        SecurityUtils.subject?.logout()

		redirect(url: "${grailsApplication.config.openIdProvider.url}/logout")
    }

    def unauthorized = {

        redirect controller: "home"
    }
	
	def _authenticateWithOpenId(register) {
		def openIdProviderUrl = grailsApplication.config.openIdProvider.url
		def portalUrl = grailsApplication.config.grails.serverURL

		log.debug "openIdProviderUrl: ${ openIdProviderUrl }"
		log.debug "portalUrl: ${ portalUrl }"

		// Perform discovery on our OpenID provider
		def discoveries = consumerManager.discover( openIdProviderUrl ) // User-supplied String

		// Attempt to associate with the OpenID provider
		// and retrieve one service endpoint for authentication
		def discovered = consumerManager.associate( discoveries )

		// Store the discovery information in the user's session for later use
		// leave out for stateless operation / if there is no session
		session.setAttribute "discovered", discovered

		log.debug "discovered: ${ discovered }"

		// Retrieve accounts details w/ attribute exchange (http://code.google.com/p/openid4java/wiki/AttributeExchangeHowTo)
		def fetch = FetchRequest.createFetchRequest()
		fetch.addAttribute "email", "http://schema.openid.net/contact/email", true /* required */
		fetch.addAttribute "fullname", "http://schema.openid.net/namePerson", true /* required */

		log.debug "portalUrl 1: ${ portalUrl }"
		log.debug "portalUrl 2: ${ portalUrl as String }" // Todo - DN: Why does this sometimes have an empty map appended?
		
		// obtain a AuthRequest message to be sent to the OpenID provider
		def returnUrl = "${portalUrl}/auth/verifyResponse"
		def authReq = consumerManager.authenticate( discovered, returnUrl )
		authReq.addExtension fetch
		
		def url = authReq.getDestinationUrl( true )
		if (register) {
			url += "&r=true"
		}

		redirect url: url
	}
}