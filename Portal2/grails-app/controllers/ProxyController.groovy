
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
                 def conn = thetext.openConnection()
                 def type = conn.contentType
                 def incomingFormat
                 def incomingEncoding = "UTF-8"
                def typeSplit = type.split(';')

                if(type != null)
                {
                    incomingFormat = typeSplit[0]
                 
                    if(typeSplit.length == 2)
                        incomingEncoding = typeSplit[1].split('=')[1]
                }
                 
                 println("type:" + typeSplit[0])
                 log.info("Proxy: The url to be requested " + thetext)
                 if (params.format == "xml") {
                     format = "text/xml"
                 }
                 else {
                     format = "text/html"
                 }
                 println(format + '   -----    '+thetext)
                render(text: thetext.text ,contentType:incomingFormat,encoding:incomingEncoding)
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
