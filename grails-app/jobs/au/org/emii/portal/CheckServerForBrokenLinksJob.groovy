package au.org.emii.portal

import org.codehaus.groovy.grails.web.mapping.UrlMapping;
import org.cyberneko.html.parsers.SAXParser

class CheckServerForBrokenLinksJob {
	// Perform getFeatureInfo for each layer at the server, scan for hyperlinks and check each one.
	// Only supports WMS 1.1.1 thus far.
	
	def totalLinkCount = 0
	def brokenLinkCount = 0
	def ln = System.getProperty('line.separator')
	File file = new File("Broken Links Report ${new Date()}.txt")
	static CONNECT_TIMEOUT = 5000
	static READ_TIMEOUT = 5000
	static FEATURE_COUNT = 10000
	static MINIMUM_RESPONSE_CODE = 399
	def summaryMap = new HashMap()

	def execute(context) {
	
		if (!context.mergedJobDataMap.get('serverId')) {
			return
		}

		file.append "Broken links report for server with id = ${context.mergedJobDataMap.get('serverId')}${ln}"

		def foundServer = Server.get(context.mergedJobDataMap.get('serverId'))

		if (!foundServer.type.contains("WMS")) {
			return
		}

		file.append "uri = ${foundServer.uri} type = ${foundServer.type}${ln}"
		_getCapabilities(foundServer.uri)
	}

	def _getCapabilities(url) {
		//Request getCapabilities for the server and extract the layers
		def getCapabilitiesUrl = url + '?version=1.1.1&request=getcapabilities'
		def xml
		try {
			xml = getCapabilitiesUrl.toURL().text
		} catch (IOException e) {
			file.append "Could not connect to server. Report cannot be generated.${ln}"
			return
		}
		
		file.append "Request : ${getCapabilitiesUrl}${ln}"
		def capabilitiesNode = new XmlParser().parseText(xml)
		file.append "Number of layers discovered: ${capabilitiesNode.Capability.Layer.Layer.size()}${ln}"
		def capabilityNodeList = capabilitiesNode.getByName('Capability')
		def layerNodeList = capabilityNodeList.getAt('Layer')

		if (layerNodeList.size() > 0) {
			layerNodeList.first().children().each {
				if (it.name() == 'Layer') {
					def getFeatureInfoUrlString = _constructFeatureInfoRequest(url, it)
					file.append "${ln}${ln}=================== Layer : ${it.Name.text()} ===================${ln}"
					_extractLinks(getFeatureInfoUrlString)
				}
			}
		}
  
		file.append "${ln}=================== Totals ==================="
		file.append "${ln}Total links checked: ${totalLinkCount}.  Total broken links ${brokenLinkCount}${ln}${ln}Response codes:${ln}"
		
		summaryMap.each {
			file.append "${it}${ln}"
		}
	}  

	def _extractLinks(getFeatureInfoUrlString) {
		//Extract all the links and check them
		Set urlSet = new HashSet()
		def parser = new org.cyberneko.html.parsers.SAXParser()
		parser.setFeature('http://xml.org/sax/features/namespaces', false)
		def page
		try {
			page = new XmlParser(parser).parse(getFeatureInfoUrlString)
		} catch (IOException e) {
			file.append "Error: IO Exception for layer"
			return
		}
		def data = page.depthFirst().A.'@href'.grep{ it != null }
		data.each {
			if (!urlSet.contains(it) && !it.toLowerCase().contains("mailto:") && !it.equals("#")) {   //check each link unless already checked
				urlSet.add(it)
				totalLinkCount++
				String result = _getUrlResponse(it)
				int count = (summaryMap[result] ?: 0) + 1
				summaryMap[result] = count
			} 
		}
	}      

   
	def _getUrlResponse(urlString) {
		// Attempt connection to URL and verify
		HttpURLConnection urlConnection = null
		try {
			URL url = new URL(urlString)
			urlConnection = (HttpURLConnection) url.openConnection()
			urlConnection.connectTimeout = CONNECT_TIMEOUT  /* timeout after 5s if can't connect */
			urlConnection.readTimeout = READ_TIMEOUT /* timeout after 5s if the page is too slow */
			urlConnection.setInstanceFollowRedirects(false)
			urlConnection.connect()
			String result = "${urlConnection?.responseCode}"
			if (urlConnection.responseCode > MINIMUM_RESPONSE_CODE) {
				brokenLinkCount++
				file.append "${urlString} : ${urlConnection?.responseCode} : ${urlConnection?.responseMessage}${ln}"
			}
			return result
		} catch (MalformedURLException e) {
			file.append urlString + " : URL is malformed"
			return "MalformedURLException"
		} catch (IOException e) {
			file.append urlString + " : Could not Connect"
			return "IOException"
		} catch (Exception exc) {
			file.append urlString + " : " + exc.message
			return "Exception"
		} finally {
			if (urlConnection != null) {
				urlConnection.disconnect();
			}
		}
	}


	def String _constructFeatureInfoRequest(url, layerNode) {
		// Construct the getFeatureInfo request.  Set the map to 1x1 pixles so that all features for the layer
		// are returned at location 0,0.
		String getFeatureInfoUrlString = url + '?version=1.1.1&request=getfeatureinfo&layers=' + layerNode.Name.text()
		getFeatureInfoUrlString += '&styles=' + layerNode.Style.Name.text()
		getFeatureInfoUrlString += '&SRS=' + layerNode.SRS.text()
		getFeatureInfoUrlString += '&bbox=' + layerNode.BoundingBox.'@minx'.text()
		getFeatureInfoUrlString += ',' + layerNode.BoundingBox.'@miny'.text()
		getFeatureInfoUrlString += ',' + layerNode.BoundingBox.'@maxx'.text()
		getFeatureInfoUrlString += ',' + layerNode.BoundingBox.'@maxy'.text()
		getFeatureInfoUrlString += '&query_layers=' +  layerNode.Name.text()
		getFeatureInfoUrlString += '&x=0&y=0&width=1&height=1&info_format=text/html&feature_count=' + FEATURE_COUNT
	}


}
