/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import org.apache.commons.io.IOUtils

class CheckLayerAvailabilityService {
    static transactional = true

    def isLayerAlive(params) {

        def layer = Layer.get(params.id)

        if (layer) {

            def getMapURL = _constructGetMapRequest(layer, params).toURL()
            def valid = _checkConnection(getMapURL, params, layer, _testGetMap)

            if (valid) {
                if (!layer.available) {
                    layer.available = true
                    layer.save()
                }
                return true
            }
            //its a fail anyway but try the getFeatureInfo
            else {

                layer.available = false
                layer.save()

                //test for get feature info
                def featInfURL = _constructFeatureInfoRequest(layer, params).toURL()
                def result = _checkConnection(featInfURL, params, layer, _testGetFeatureInfo)

                if (!result) {
                    notifyOwner(layer, "GetMap and GetFeature")
                } else {
                    notifyOwner(layer, "GetMap")
                }
            }
        }

        return false
    }

    def _testGetFeatureInfo = { conn, layer, params ->

        def contentType = conn.getContentType()
        if (contentType) {

            def text
            try {
                text = IOUtils.toString(conn.inputStream, "UTF8")
            }
            finally {
                IOUtils.closeQuietly(conn.inputStream)
            }
            return (_isValidFromResponse(text) && (contentType.split(';')[0] == params.format))
        }
        return false
    }

    def _testGetMap = { conn, layer, params ->

        def contentType = conn.getContentType()
        if (contentType) {

            if (contentType.split(';')[0] == layer.server.imageFormat) {
                log.debug("GetMap check successful")
                return true
            }
        }
        log.debug("GetMap check unsuccessful")
        return false
    }


    def _checkConnection(url, params, layer, test) {

        try {
            def conn = url.openConnection()
            _addAuthentication(conn, url)
            return test.call(conn, layer, params)
        }
        catch (e) {
            //does this catch connection errors/etc??
            // could this be an unusual WMS server
            e.printStackTrace()
            return false
        }

        return false
    }

    def _addAuthentication(connection, url) {

        def server = _getServer(url)

        if (server) {
            server.addAuthentication(connection)
        }
    }

    def _getServer(url) {

        return Server.findByUriLike("%${url.host}%")
    }



    def _isValidFromResponse(String responseText) {

        def valid = true

        // errors will be xml, test for exception messages
        valid = (responseText == "") ? false : valid
        valid = (responseText.find('<WMT_MS_Capabilities')) ? false : valid
        valid = (responseText.find('<ServiceExceptionReport')) ? false : valid

        // allow possible data changes
        valid = (responseText.find('InvalidRangeException')) ? true : valid

        return valid
    }

    String _buildUrl(layer, featureInfoParams) {

        // use the uri stored in the database not munted in JS
        def storedServerUri = layer.server.uri

        if (storedServerUri.contains("?")) {
            storedServerUri += '&'
        } else {
            storedServerUri += '?'
        }

        return storedServerUri + featureInfoParams
    }

    String _constructFeatureInfoRequest(layer, params) {
        // Construct the getFeatureInfo request.
        // are returned at location 0,0.

        //if there's only one feature, the min and max values
        //will be the same and geoserver will throw an exception
        //so change minvalues if same as max values.

        def minX = layer.bboxMinX.toDouble()
        if (layer.bboxMinX == layer.bboxMaxX)
            minX -= 1;

        def minY = layer.bboxMinY.toDouble()
        if (layer.bboxMinY == layer.bboxMaxY)
            minY -= 1;


        def getFeatureInfoUrlString = 'VERSION=1.1.1&REQUEST=GetFeatureInfo&LAYERS=' + URLEncoder.encode(layer.namespace + ":" + layer.name)
        getFeatureInfoUrlString += '&STYLES=' //+ URLEncoder.encode(layer.styles)
        getFeatureInfoUrlString += '&SRS=' + URLEncoder.encode(layer.projection)
        getFeatureInfoUrlString += '&CRS=' + URLEncoder.encode(layer.projection)
        getFeatureInfoUrlString += '&BBOX=' + URLEncoder.encode(minX + ',' + minY + ',' + layer.bboxMaxX + ',' + layer.bboxMaxY)
        getFeatureInfoUrlString += '&QUERY_LAYERS=' + URLEncoder.encode(layer.namespace + ":" + layer.name)
        getFeatureInfoUrlString += '&X=0&Y=0&I=0&J=0&WIDTH=1&HEIGHT=1&FEATURE_COUNT=1'
        getFeatureInfoUrlString += '&INFO_FORMAT=' + params.format

        return _buildUrl(layer, getFeatureInfoUrlString)
    }

    String _constructGetMapRequest(layer, params) {
        // Construct the getMap request

        def minX = layer.bboxMinX.toDouble()
        if (layer.bboxMinX == layer.bboxMaxX)
            minX -= 1;

        def minY = layer.bboxMinY.toDouble()
        if (layer.bboxMinY == layer.bboxMaxY)
            minY -= 1;

        def getMapString = 'VERSION=1.1.1&REQUEST=GetMap&LAYERS=' + URLEncoder.encode(layer.namespace + ":" + layer.name)
        getMapString += '&STYLES=' //+ URLEncoder.encode(layer.styles)
        getMapString += '&SRS=' + URLEncoder.encode(layer.projection)
        getMapString += '&CRS=' + URLEncoder.encode(layer.projection)
        getMapString += '&BBOX=' + URLEncoder.encode(minX + ',' + minY + ',' + layer.bboxMaxX + ',' + layer.bboxMaxY)
        getMapString += '&FORMAT=' + URLEncoder.encode(layer.server.imageFormat)
        getMapString += '&EXCEPTIONS=application/vnd.ogc.se_xml'
        getMapString += '&width=50&height=50'
        return _buildUrl(layer, getMapString)
    }


    void notifyOwner(layer, failedOps) {
        def ownerList = layer.server.owners

        ownerList.each() { owner ->
            def messageBody = "The layer $layer.name on $layer.server.uri is currently having problems with $failedOps requests."

            if (layer.available) {
                sendMail {
                    to owner.emailAddress
                    subject "Layer failed to load"
                    body messageBody
                }
            }
        }
    }
}
