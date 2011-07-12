
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
                 log.info("Proxy: The url to be requested " + thetext)
                 if (params.format == "xml") {
                     format = "text/xml"
                 }
                 else {
                     format = "text/html"
                 }
                 println(format + '   -----    '+thetext)
                render(text: thetext.text ,contentType:format,encoding:"UTF-8")
           }
           else {
               log.error("Proxy: The url " + hostName + "was not allowed")
               render(text: "Host not allowed",contentType:"text/html",encoding:"UTF-8")
           }

        }
        else {
             render(text: "No URL supplied",contentType:"text/html",encoding:"UTF-8")
        }

    }

}
