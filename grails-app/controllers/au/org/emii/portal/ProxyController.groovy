package au.org.emii.portal

class ProxyController {

    def grailsApplication
    
    // proxies HTML by default or XML and Images if specified
    def index = {
        if ( params.url ) {
            
            def targetUrl = params.url.toURL()  
            if (allowedHost(params.url)) {
                
                // handle binary images
                if (params.format?.startsWith("image")) {
                    def webImage = new ByteArrayOutputStream()
                    webImage << new URL(params.url).openStream()
                    
                    if (request.method == 'HEAD') { 
                        render text: "", contentType: params.format
                    }
                    else {
                        
                        response.contentLength = webImage.size()
                        response.contentType = params.format
                        response.outputStream << webImage.toByteArray()
                        response.outputStream.flush()
                    }                    
                }
                // else handle as HTML by default or XML if specified
                else {
                    def format = params.format == "text/xml" ? "text/xml" : "text/html"
                
                    //log.debug "TargetUrl: $targetUrl (expected type: $format)"
                    try {
                        render text: targetUrl.text, contentType: format, encoding: "UTF-8"
                    }
                    catch (Exception e) {                    
                        log.debug "Exception occurred: $e"
                        render text: "An error occurred making request to $targetUrl", status: 500
                    }
                }
            }
            else {
                log.error "Proxy: The url ${params.url} was not allowed"
                render text: "Host '${targetUrl.getHost()}' not allowed", contentType: "text/html", encoding: "UTF-8", status: 500
            }
        }
        else {
            render text: "No URL supplied", contentType: "text/html", encoding: "UTF-8", status: 500
        }
    }
    
    Boolean allowedHost (url) {
        
        def allowed = false
        def allowableServers = [grailsApplication.config.spatialsearch.url]
        def conf = Config.activeInstance()
            
        // Get the domain name from the target uri
        def targetUrl = url.toURL()
            
        // allow hosts we consider valid. from our list of wms servers first        
        Server.list().each {
            allowableServers.add(it.uri)                              
        }
            
        // add localhost
        allowableServers.add(request.getHeader("host"))
        // add the current mest url
        allowableServers.add(conf.catalogUrl)

            
        allowableServers.each { 
        
            if (it.contains( targetUrl.getHost() )) {                                        
                allowed = true
            }
        }
        return allowed
    }
    
    // this action is intended to always be cached by squid
    // expects Open layers requests
    def cache = {

        // ACCEPTS UPPER URL PARAM ONLY
        if ( allowedHost(params?.URL) ) {            
            
            def url =  params.URL.replaceAll(/\?$/, "")
            
            params.remove('URL')
            params.remove('action')
            params.remove('controller')            
            // ALL OTHER PARAMS ARE APPENDED AS PARAMS TO THE URL (and passed to the index action)            
            def p = params.collect { k,v -> "$k=$v" }.join('&')            
            if (p.size() > 0) {
                url += "?" + p
            }
            
            // assume that the request FORMAT (from openlayers) will be the return format
            redirect( action:'', params: [url: url, format: params.FORMAT ])
        }        
        else {
            render( text: "No valid allowable URL supplied", contentType: "text/html", encoding: "UTF-8", status: 500 )
        }
    }
}