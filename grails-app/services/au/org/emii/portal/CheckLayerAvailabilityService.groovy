
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

class CheckLayerAvailabilityService {

    static transactional = true

	// use supplied serverUri from layer as it may vary from getCap's server
	def isLayerAlive(params) {

		def valid = true // start with the gates open
		def layer = Layer.get(params.layerId)
		println params.layerId

		if (layer) {

			def featInfURL = _constructFeatureInfoRequest(layer,params).toURL()

			try {

				def conn = featInfURL.openConnection()
				_addAuthentication(conn, featInfURL)

				def contentType = conn.getContentType().split(';')[0]

				if (!(contentType  == "text/html"  || contentType  == "text/plain")) {

					def text = featInfURL.text

					// its xml, test for exception messages, or sillyness
					valid = (text.find('<WMT_MS_Capabilities')) ? false : valid // Todo - DN: Check this too
					valid = (text.find('<ServiceExceptionReport')) ? false : valid
					valid = (text == "") ? false : valid

					// allow possible data changes
					valid = (text.find('InvalidRangeException')) ? true : valid
				}

                // Todo - DN: Check this. It means that if the response is text/html or text/plain then valid is TRUE. Is this correct?
				}
			catch (e) {

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
	def _addAuthentication(connection, url) {
		def server = _getServer(url)
		if (server) {
			server.addAuthentication(connection)
		}
	}

	def _getServer(url) {
		return Server.findByUriLike("%${url.getHost()}%")
	}

	String _buildUrl(layer,params,featureInfoParams) {

		// use the uri stored in the database not munted in JS
		def storedServerUri = layer.server.uri


		if (storedServerUri.contains("?")) {
			storedServerUri += '&'
		}
		else {
			storedServerUri += '?'
		}

		return storedServerUri + featureInfoParams
	}

	String _constructFeatureInfoRequest(layer,params) {
		// Construct the getFeatureInfo request.
		// are returned at location 0,0.

		//if there's only one feature, the min and max values
		//will be the same and geoserver will throw an exception
		//so change minvalues if same as max values.

		def minX= layer.bboxMinX.toDouble()
		if(layer.bboxMinX == layer.bboxMaxX)
			minX -= 1;

		def minY = layer.bboxMinY.toDouble()
		if(layer.bboxMinY == layer.bboxMaxY)
			minY -= 1;

		def infoFormat = params.format

		def getFeatureInfoUrlString = 'VERSION=1.1.1&REQUEST=GetFeatureInfo&LAYERS=' + URLEncoder.encode(layer.name)
		getFeatureInfoUrlString += '&STYLES=' //+ URLEncoder.encode(layer.styles)
		getFeatureInfoUrlString += '&SRS=' + URLEncoder.encode(layer.projection)
		getFeatureInfoUrlString += '&CRS=' + URLEncoder.encode(layer.projection)
		getFeatureInfoUrlString += '&BBOX=' + URLEncoder.encode(minX +',' + minY+ ',' + layer.bboxMaxX + ',' + layer.bboxMaxY)
		getFeatureInfoUrlString += '&QUERY_LAYERS=' +  URLEncoder.encode(layer.name)
		getFeatureInfoUrlString += '&INFO_FORMAT=' + URLEncoder.encode(infoFormat)
	    getFeatureInfoUrlString += '&X=0&Y=0&I=0&J=0&WIDTH=1&HEIGHT=1&FEATURE_COUNT=1'

		return _buildUrl(layer,params,getFeatureInfoUrlString)

	}

}
