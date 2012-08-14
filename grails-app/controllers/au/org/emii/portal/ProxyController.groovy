package au.org.emii.portal

import org.apache.commons.io.IOUtils

class ProxyController {

    def grailsApplication
    
    // proxies HTML by default or XML and Images if specified
    def index = {		
		if ( params.url ) {
			_index(false)
		}
		else {
			render text: "No URL supplied", contentType: "text/html", encoding: "UTF-8", status: 500
		}
    }
	
	def _index(downloadGif) {

		def targetUrl = _getUrl(params)

        if (allowedHost(params.url)) {
			
			def conn = targetUrl.openConnection()

	        if (params.format) {
		        response.contentType = params.format
	        }
			def outputStream = response.outputStream
			
			_addAuthentication(conn, targetUrl)

			if (request.method == 'HEAD') {
				render(text: "", contentType: (params.format ?: params.FORMAT))
			}
			else {
                if(downloadGif){
                    def index = params.url.indexOf("LAYERS=")

                    if(index > -1){
                        def layers = params.url.substring(index + 7);
                        def timeStr = params.TIME.replaceAll("[-:]", "")
                        timeStr.replace("/", "_")
                        response.setHeader("Content-disposition", "attachment; filename=" +
                        layers + "_" + timeStr + ".gif");
                    }

                }
                try {
					outputStream << conn.inputStream
					outputStream.flush()
				}
				catch (Exception e) {

                    log.info "Unable to pass-through response from $targetUrl", e
				}
                finally {

                    IOUtils.closeQuietly( outputStream )
                }
			}
		}
		else {
			log.error "Proxy: The url ${params.url} was not allowed"
			render text: "Host '${targetUrl.getHost()}' not allowed", contentType: "text/html", encoding: "UTF-8", status: 500
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
	
	def wmsOnly = {

		if ( params.url ) {

			try {
				
				def resp = params.url.toURL()
				def xml = new XmlSlurper().parseText(resp.text)				
				// get all valid namespaces eg  xmlns:a="http://a.example.com" xmlns:b="http://b.example.com" 
				def namespaceList = xml.'**'.collect { it.namespaceURI() }.unique()					
				
				def isWMS = false
				def validNSpaceURL = ['http://www.opengis.net/wms','http://www.opengis.net/ogc']
				namespaceList.each {			
					if (validNSpaceURL.contains(it)) {
						isWMS = true
					}
				}
				
				// might be a WMT_MS_Capabilities doc
				if (!isWMS) {					
					// what else is better?
					if (xml.Service.Name.toString().length() > 0) {
						isWMS = true
					}
				}
				
				// exclude to all that dont have the namespace attribute for WMS
				if (isWMS) {						
					render text: resp.text, contentType: "text/xml", encoding: "UTF-8"
				}
				else {
					// We dont tell the user the problem or how we valiate a genuine WMS XML doc
					render text: params.url, status: 500
				}						

			}
			catch (Exception e) {                    
				log.debug "User added WMS Server error: $e"
				
				render text: params.url, status: 500
			}
			
		}
	}
	
	def _getUrl(params) {
		def targetUrl = params.url.toURL()

        def query = params.findAll({key, value -> key != "controller" && key != "url" && key != "format"})
        def queryStr = ""

        query.each { key, value ->
            queryStr += "&$key=$value"
        }
        targetUrl = (params.url + queryStr).toURL()

		return targetUrl
	}
	
	def _addAuthentication(connection, url) {
		def server = _getServer(url)
		if (server) {
			server.addAuthentication(connection)
		}
	}
	
	def _getServer(url) {
		return Server.findByUriLike("%${url.getHost()}%")
	}

    def downloadGif = {
        _index(true)
    }
}
