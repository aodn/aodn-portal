
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import org.apache.shiro.SecurityUtils
import org.openid4java.consumer.ConsumerManager
import org.openid4java.discovery.DiscoveryInformation
import org.openid4java.message.ParameterList
import org.openid4java.message.ax.AxMessage
import org.openid4java.message.ax.FetchRequest
import org.openid4java.message.ax.FetchResponse

class AuthController {

    static def consumerManager = new ConsumerManager()


    def index = {

        forward action: "login"
    }

    def register = {

		_authenticateWithOpenId(params, true)
    }

    def login = {

        _authenticateWithOpenId(params, false)
    }

    def verifyResponse = {

        // Todo - DN: How to redirect them back to where they were before they clicked 'login' (or 'register', 'logout', etc.)?

        // extract the parameters from the authentication response
        // (which comes in as a HTTP request from the OpenID provider)

        log.debug "request.parameterMap: ${request.parameterMap}"

        def openidResp = new ParameterList(request.parameterMap)

        // retrieve the previously stored discovery information
        def discovered = session.getAttribute("discovered")

        // extract the receiving URL from the HTTP request
        def receivingURL = grailsApplication.config.grails.serverURL + ( request.forwardURI - request.contextPath )

        if (request.queryString) {

            receivingURL += "?${request.queryString}"
        }

        log.debug "receivingURL: $receivingURL"

        // verify the response
        def verification = consumerManager.verify(receivingURL as String,
                                                  openidResp,
                                                  discovered as DiscoveryInformation)

        // examine the verification result and extract the verified identifier
        def verified = verification.getVerifiedId()

        if (verified) { // success, use the verified identifier to identify the user

            def userInstance = _createUserFromOpenIdUrl(verified.identifier)

            _loadAttributesFromResponse(verification, userInstance)

            // always required since attributes may change
            userInstance.save flush: true, failOnError: true

            _logUserIn(userInstance)
        }
        else { // OpenID authentication failed

            log.info "OpenID authentication failed. verification.statusMsg: ${verification.statusMsg}; params: $params"

            flash.openIdMessage = (params["openid.mode"] == "cancel" ) ? "Log in cancelled." : "Could not log in (${verification.statusMsg})"
        }
        redirect controller: "home"
    }

    def logOut = {

        // get openId provider
        String openIdProvider = session["currentOpenIdProvider"]

        // lookup the OpenId provider in our Config
        def configuredOpenIdProvider = grailsApplication.config.openId.providers.find { it.providerHref == openIdProvider }

        // Sometimes not available if custom selected provider
        if(configuredOpenIdProvider && configuredOpenIdProvider.supportsProviderLogout) {

            // If we support logout protocol...
            log.info "Logout protocol supported - using custom logout for $openIdProvider"

            redirect(url: "${openIdProvider}/logout")
        }

        // Log the user out of the application.
        SecurityUtils.subject?.logout()
    }

    def unauthorized = {

        redirect controller: "home"
    }

    def _logUserIn(userInstance)  {

        def authToken = new OpenIdAuthenticationToken(userInstance.id, userInstance.openIdUrl) // Todo - DN: Remember me option

        SecurityUtils.subject.login authToken
    }

    def _createUserFromOpenIdUrl(userOpenIdUrl) {

        def userInstance = User.findByOpenIdUrl(userOpenIdUrl)

        if (!userInstance) {

            // userInstance = new User( openIdUrl: verified.identifier )
            userInstance = new User(openIdUrl: userOpenIdUrl)

            // If there are no users to date make the first user an admin
            if (User.count() < 1) {
                userInstance.addToRoles UserRole.findByName(UserRole.ADMINISTRATOR)
            }
            else {
                userInstance.addToRoles UserRole.findByName(UserRole.SELFREGISTERED)
            }
        }
        userInstance
    }

    def _loadAttributesFromResponse(verification, user) {

        // Get values from attribute exchange
        def authResponse = verification.authResponse

        log.debug "authResponse: ${ authResponse }"

        if (authResponse.hasExtension(AxMessage.OPENID_NS_AX))
        {
            // Validate response
            authResponse.validate()

            def ext = authResponse.getExtension(AxMessage.OPENID_NS_AX)

            if (ext instanceof FetchResponse) {

                log.debug "Setting attributes from '$ext'"

                _loadAttributeValues(ext, user)
            }
            else {

                log.warn "Unknown response type from OpenID (ie. not a FetchResponse). ext: '$ext' (${ ext?.class?.name })"
            }
        }
        else {

            log.warn "Response doesn't have extension AxMessage.OPENID_NS_AX. Unable to set/update User fields."
        }
    }

    def _setRequestAttributes(fetch) {

        _setOpenIDSchemaRequestAttributes(fetch)
        _setAxSchemaRequestAttributesOpen(fetch)
    }

    def _loadAttributeValues(ext, userInstance) {

        _loadOpenIDSchemaAttributeValues(ext, userInstance)
        _loadAxSchemaAttributeValues(ext, userInstance)

        if( !userInstance.fullName)  {

            userInstance.fullName = "Unk."
        }
        if( !userInstance.emailAddress) {

            userInstance.emailAddress = "Unk."
        }
    }

    def _setOpenIDSchemaRequestAttributes(fetch) {

        // eMII
        fetch.addAttribute "ext0", "http://schema.openid.net/contact/email", true // required
        fetch.addAttribute "ext1", "http://schema.openid.net/namePerson", true // required
    }

    def _setAxSchemaRequestAttributesOpen(fetch) {
        // Google OpenID and probably others require extracting username as separate fields
        // see https://developers.google.com/accounts/docs/OpenID#Parameters
        fetch.addAttribute "firstname", "http://axschema.org/namePerson/first", true
        fetch.addAttribute "lastname", "http://axschema.org/namePerson/last", true

        // Yahoo responds to these fields but doesn't respect the request keys...
        fetch.addAttribute "a", 'http://axschema.org/contact/email' , true             // email
        fetch.addAttribute "b", 'http://axschema.org/namePerson/friendly' , true      // nickname
        fetch.addAttribute "c", 'http://axschema.org/namePerson' , true               // fullname
    }

    def _loadOpenIDSchemaAttributeValues(ext, userInstance) {

        // ext1 is the hardwired key for username.
        if(ext.getAttributeValue('ext1'))
        {
            // devid.emii
            userInstance.fullName =  ext.getAttributeValue('ext1')
        }
        // Extract email
        if(ext.getAttributeValue('ext0'))
        {
            userInstance.emailAddress = ext.getAttributeValue('ext0')
        }
    }

    def _loadAxSchemaAttributeValues(ext, userInstance) {

        // depending on how the OpenID provider responded, try to extract the username and email

        if(ext.getAttributeValue("firstname") && ext.getAttributeValue("lastname"))
        {
            // Google
            userInstance.fullName = ext.getAttributeValue("firstname") + ' ' + ext.getAttributeValue("lastname")
        }
        else if(ext.getAttributeValue("nickname"))
        {
            // Yahoo
            userInstance.fullName = ext.getAttributeValue("nickname")
        }

        if(ext.getAttributeValue('email'))
        {
            userInstance.emailAddress = ext.getAttributeValue('email')
        }
    }

	def _authenticateWithOpenId(params, register) {

        def openIdProviderUrl = params.openIdProvider

        // record openId provider so that we can handle graceful logout later
        session["currentOpenIdProvider"] = openIdProviderUrl


        def portalUrl = grailsApplication.config.grails.serverURL

        try {
		    // Perform discovery on our OpenID provider
		    def discoveries = consumerManager.discover(openIdProviderUrl) // User-supplied String

            // Attempt to associate with the OpenID provider
            // and retrieve one service endpoint for authentication
            def discovered = consumerManager.associate(discoveries)

            // Store the discovery information in the user's session for later use
            // leave out for stateless operation / if there is no session
            session.setAttribute "discovered", discovered

            // Retrieve accounts details w/ attribute exchange (http://code.google.com/p/openid4java/wiki/AttributeExchangeHowTo)
            def fetch = FetchRequest.createFetchRequest()

            // set the attribute keys we are interested in
            _setRequestAttributes(fetch)

            // obtain a AuthRequest message to be sent to the OpenID provider
            def returnUrl = "${portalUrl}/auth/verifyResponse"
            def authReq = consumerManager.authenticate(discovered, returnUrl)

            authReq.addExtension fetch

            def url = authReq.getDestinationUrl(true)
            if (register) {
                url += "&r=true"
            }

            redirect url: url
       }
       catch(e)
        {
            // common scenario is if the user supplied an invalid url
            flash.openIdMessage = "OpenId authentication failed for url: $openIdProviderUrl"

            redirect controller: "home"
        }
	}

    def beforeInterceptor = {

        request.exceptionHandler = { ex ->
            flash.message = "There was a problem with authentication."
            redirect controller: "home"
        }
    }
}
