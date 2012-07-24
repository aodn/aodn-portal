package au.org.emii.portal

import org.codehaus.groovy.grails.web.mapping.UrlMapping;
import org.cyberneko.html.parsers.SAXParser
import org.apache.shiro.SecurityUtils


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
	def mailService

	def execute(context) {

		// Get user details so the report can be emailed


		if (!context.mergedJobDataMap.get('serverId')) {
			return
		}

		def userEmailAddress = context.mergedJobDataMap.get('userEmail')

		file.append "Broken links report for server with id = ${context.mergedJobDataMap.get('serverId')}${ln}"
		file.append "For ${userEmailAddress}${ln}"

		def foundServer = Server.get(context.mergedJobDataMap.get('serverId'))

		if (!foundServer.type.contains("WMS")) {
			return
		}

		file.append "uri = ${foundServer.uri} type = ${foundServer.type}${ln}"
		_getCapabilities(foundServer.uri)

		sendReportByEmail(userEmailAddress, file)
	}





	def _getCapabilities(url) {
		//Request getCapabilities for the server and extract the layers
		def getCapabilitiesUrl
		if (url.contains("?namespace")) {
			getCapabilitiesUrl = url + '&version=1.1.1&request=getcapabilities'
		} else {
			getCapabilitiesUrl = url + '?version=1.1.1&request=getcapabilities'
		}
		file.append "Request : ${getCapabilitiesUrl}${ln}"
		def xml
		try {
			xml = getCapabilitiesUrl.toURL().text
		} catch (IOException e) {
			file.append "Could not connect to server. Report cannot be generated.${ln}"
			return
		}


		def xmlParser = new XmlParser()
		xmlParser.setFeature("http://apache.org/xml/features/nonvalidating/load-external-dtd", false)
		def capabilitiesNode = xmlParser.parseText(xml)

		file.append "Number of layers discovered: ${capabilitiesNode.Capability.Layer.Layer.size()}${ln}"
		def capabilityNodeList = capabilitiesNode.getByName('Capability')
		def layerNodeList = capabilityNodeList.getAt('Layer')

		// Check each layer [TODO: need to make this recursive and check for queryable="1"]
		if (layerNodeList.size() > 0) {
			layerNodeList.first().children().each {
				if (it.name() == 'Layer') {
					def getFeatureInfoUrlString = _constructFeatureInfoRequest(url, it)
					file.append "${ln}${ln}=================== Layer : ${it.Name.text()} ===================${ln}"
					_extractLinks(getFeatureInfoUrlString)

					// In case there are nested layers					
					def nestedNodeList = it.getAt('Layer')
					file.append "${ln}${ln}Number of nested layers : ${nestedNodeList.size()}${ln}"
					if (nestedNodeList.size() > 0) {
						nestedNodeList.each {
							if (it.name() == 'Layer') {
								getFeatureInfoUrlString = _constructFeatureInfoRequest(url, it)
								file.append "${ln}${ln}========= Nested Layer : ${it.Name.text()} ========= ${ln}"
								_extractLinks(getFeatureInfoUrlString)
							}
						}
					}
				}
			}
		}

		file.append "${ln}=================== Totals ==================="
		file.append "${ln}Total links checked: ${totalLinkCount}.  Total broken links ${brokenLinkCount}${ln}${ln}Response codes:${ln}"

		summaryMap.each { file.append "${it}${ln}" }
	}

	def _extractLinks(getFeatureInfoUrlString) {
		//Extract all the links and check them
		Set urlSet = new HashSet()
		def saxParser = new org.cyberneko.html.parsers.SAXParser()
		saxParser.setFeature('http://xml.org/sax/features/namespaces', false)
		def page
		try {
			def xmlParser = new XmlParser(saxParser)
			page = xmlParser.parse(getFeatureInfoUrlString)
		} catch (IOException e) {
			file.append "Error: IO Exception for layer${ln}"
			return
		}
		def data = page.depthFirst().A.'@href'.grep{ it != null }
		data.each {
			if (!urlSet.contains(it) && !_blackListed(it)) {   //check each link unless already checked
				urlSet.add(it)
				totalLinkCount++
				String result = _getUrlResponse(it)
				int count = (summaryMap[result] ?: 0) + 1
				summaryMap[result] = count
			}
		}
	}

	// Ignore these links
	def _blackListed(link) {
		if (link.toLowerCase().contains("mailto:")) {
			return true
		}
		
		if (link.equals("#")) {
			return true
		}
		
		if (link.contains("http://geoserver.emii.org.au/argo/Argo_trajectory_")) {
			return true
		}
		
		return false
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
			file.append urlString + " : URL is malformed${ln}"
			return "MalformedURLException"
		} catch (IOException e) {
		//	file.append urlString + " : Could not Connect${ln}"
			return "IOException"
		} catch (Exception exc) {
			file.append urlString + " : " + exc.message + "${ln}"
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
		String getFeatureInfoUrlString
		if (url.contains("?namespace")) {
			getFeatureInfoUrlString = url + '&version=1.1.1&request=getfeatureinfo&layers=' + layerNode.Name.text()
		} else {
			getFeatureInfoUrlString = url + '?version=1.1.1&request=getfeatureinfo&layers=' + layerNode.Name.text()
		}
		getFeatureInfoUrlString += '&styles=' + layerNode.Style.Name.text()
		getFeatureInfoUrlString += '&SRS=' + layerNode.SRS.text()
		getFeatureInfoUrlString += '&bbox=' + layerNode.BoundingBox.'@minx'.text()
		getFeatureInfoUrlString += ',' + layerNode.BoundingBox.'@miny'.text()
		getFeatureInfoUrlString += ',' + layerNode.BoundingBox.'@maxx'.text()
		getFeatureInfoUrlString += ',' + layerNode.BoundingBox.'@maxy'.text()
		getFeatureInfoUrlString += '&query_layers=' +  layerNode.Name.text()
		getFeatureInfoUrlString += '&x=0&y=0&width=1&height=1&info_format=text/html&feature_count=' + FEATURE_COUNT
	}


	// Email notifications
	def sendReportByEmail(userEmailAddress, file) {

		mailService.sendMail   {
			multipart true
			to userEmailAddress
			subject "Broken Links Report"
			body 'Broken Links Report atatched'
			attachBytes file.toString(),'text/xml', file.readBytes()
		}
	}

}
