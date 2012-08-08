package au.org.emii.portal

class CheckLayerAvailabilityService {

    static transactional = true

    def serviceMethod() {

    }
	
	// use supplied serverUri from layer as it may vary from getCap's server
	def isLayerAlive(layerId,serverUri,isNcwms) {
		
		def valid = true // start with the gates open
		def layerDetails = getLayerDetails(layerId)
		if (layerDetails) {
			
			def featInfURL = _constructFeatureInfoRequest(serverUri, layerDetails.layer,isNcwms).toURL()	
			try {
				def res = featInfURL.openConnection() 
				if (res) {
					def contentType = res.getContentType().split(';')[0]						
					if (!(contentType  == "text/html"  || contentType  == "text/plain")) {	

						def text = featInfURL.text
						print featInfURL
						// its xml, test for exception messages, or sillyness
						valid = (text.find('<WMT_MS_Capabilities')) ? false : valid
						valid = (text.find('<ServiceExceptionReport')) ? false : valid	
						
						// allow possible data changes						
						valid = (text.find('InvalidRangeException')) ? true : valid	

					}
				}					
			}
			catch (MalformedURLException e) {
				// could this be an unusual WMS server
				valid = false
			}	
			
		}
		else {
			// we dont have this layer in the database ???
			// shouldnt really get here often
			valid = false
		}
						
		return valid
	}
	
	def getLayerDetails(layerId) {
		def layerInstance = Layer.get( layerId as int )
		
		if (layerInstance) {
			def serverInstance = Server.get(layerInstance.server.id)
			if ( serverInstance ) {
				return [layer: layerInstance, server: serverInstance]
			}
		}        
	}
	

	def String _constructFeatureInfoRequest(serverUri, layer,isNcwms) {
		// Construct the getFeatureInfo request. 
		// are returned at location 0,0.
		String getFeatureInfoUrlString
		def infoFormat = "text/html";
		
		if (serverUri.contains("?")) {
			getFeatureInfoUrlString = serverUri + '&'
		} else {
			getFeatureInfoUrlString = serverUri + '?'
		}
		
		// dont care here about animated layers, they are assumed alive	
    	if (isNcwms == "true") {
			infoFormat = "text/xml";
		}
		getFeatureInfoUrlString += 'VERSION=1.1.1&REQUEST=GetFeatureInfo&LAYERS=' + URLEncoder.encode(layer.name)
		getFeatureInfoUrlString += '&STYLES=' //+ URLEncoder.encode(layer.styles)
		getFeatureInfoUrlString += '&SRS=' + URLEncoder.encode(layer.projection)
		getFeatureInfoUrlString += '&CRS=' + URLEncoder.encode(layer.projection)
		getFeatureInfoUrlString += '&BBOX=' + URLEncoder.encode(layer.bboxMinX +',' + layer.bboxMinY + ',' + layer.bboxMaxX + ',' + layer.bboxMaxY)
		getFeatureInfoUrlString += '&QUERY_LAYERS=' +  URLEncoder.encode(layer.name)		
		getFeatureInfoUrlString += '&INFO_FORMAT=' + URLEncoder.encode(infoFormat)			 
	    getFeatureInfoUrlString += '&X=0&Y=0&I=0&J=0&WIDTH=1&HEIGHT=1&FEATURE_COUNT=1'
		return getFeatureInfoUrlString
	}

}
