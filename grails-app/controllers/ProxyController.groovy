
class ProxyController {

    def DEBUG = true;

    def index = {

        if (params.url) {
        
           //exclude use to certain hosts
           def hostList = ['geoserver.emii.org.au','geoserverdev.emii.org.au']
           def format

           // get the doamin name from the supplied uri
           def hostName =  params.url.toURL().getHost()

            if (DEBUG || hostList.contains(hostName)) {

                def thetext = params.url.toURL()
                def connection = thetext.openConnection()
                def typeFull = connection.contentType.split(';');
                def mime = typeFull[0]
                def encoding = typeFull[1]

                log.info("Proxy: The url to be requested " + thetext)
                 if (params.format == "xml") {
                     format = "text/xml"
                 }
                 else {
                     format = "text/html"
                 }
                 render(text: thetext.text ,contentType:typeFull[0],encoding:typeFull[1])

           }
           else {
               log.error("Proxy: The url " + hostName + "was not allowed")
               render(text: "Host not allowed",contentType:typeFull[0],encoding:typeFull[1])
           }
            
        }
        else {
             render(text: "No URL supplied",contentType:typeFull[0],encoding:typeFull[1])
        }

    }
    
}
