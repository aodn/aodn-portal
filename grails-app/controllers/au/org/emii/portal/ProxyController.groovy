package au.org.emii.portal

class ProxyController {

	def grailsApplication
    
    def index = {

        if ( params.url ) {

            def validHost = false
            def allowableServers = [grailsApplication.config.spatialsearch.url]
            def conf = Config.list()
            
            // Get the domain name from the target uri
            def targetUrl = params.url.toURL()
            
            // allow hosts we consider valid. from our list of wms servers first        
            Server.list().each {
                allowableServers.add(it.uri)                              
            }
            // add the current mest url
            allowableServers.add(conf[0].catalogUrl)
            
            allowableServers.each {
                if (it.contains( targetUrl.getHost())) {
                    validHost = true 
                }                
            }
			validHost = true
            if (validHost) {

                def conn = targetUrl.openConnection()
                
                def format = params.format == "text/xml" ? "text/xml" \
                                                     : "text/html"
                
                //log.debug "TargetUrl: $targetUrl (expected type: $format)"
                try {
                    render( text: targetUrl.text, contentType: format, encoding: "UTF-8" )
                }
                catch (Exception e) {                    
                    log.debug "Exception occurred contacting $targetUrl", e
                    render text: "An error occurred making request to $targetUrl", status: 500
                }
            }
            else {
                log.error "Proxy: The url ${params.url} was not allowed"
                render text: "Host '${targetUrl.getHost()}' not allowed", contentType: "text/html", encoding: "UTF-8", status: 500
            }
        }
        else {
            render( text: "No URL supplied", contentType: "text/html", encoding: "UTF-8", status: 500 )
        }
    }
}