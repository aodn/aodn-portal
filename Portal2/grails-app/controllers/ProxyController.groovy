class ProxyController {

    def REMOVE_THIS_TO_ENABLE_HOST_LIST_FILTERING = true
    
    def index = {

        if ( params.url ) {

            //exclude use to certain hosts
            def hostList = ['geoserver.emii.org.au','geoserverdev.emii.org.au'] // get values from server config
            
            // Get the doamin name from the target uri
            def targetUrl = params.url.toURL()
           
            if ( REMOVE_THIS_TO_ENABLE_HOST_LIST_FILTERING || hostList.contains( targetUrl.getHost() ) ) {

                def conn = targetUrl.openConnection()
                
                def format = params.format == "xml" ? "text/xml" \
                                                    : "text/html"
                
                log.debug "TargetUrl: $targetUrl (expected type: $format)"
              
                try {

                    render( text: targetUrl.text, contentType: format, encoding: "UTF-8" )
                }
                catch (Exception e) {
                    
                    log.debug "Exception occurred: $e"
                    render text: "An error occurred making request to $targetUrl", status: 500
                }
           }
           else {
               log.error "Proxy: The url ${params.url} was not allowed"
               render text: "Host '${targetUrl.getHost()}' not allowed", contentType: "text/html", encoding: "UTF-8"
           }
        }
        else {
             render( text: "No URL supplied", contentType: "text/html", encoding: "UTF-8" )
        }
    }
}