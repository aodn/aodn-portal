/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import static au.org.emii.portal.UrlUtils.urlWithQueryString

class CheckLayerAvailabilityService {

    static transactional = true

    def isLayerAlive(params) {

        def layer = Layer.get(params.id)

        if (layer) {

            def getMapURL = _constructGetMapRequest(layer, params).toURL()
            def valid = _checkConnection(getMapURL, _testGetMap)

            //failed getmap test, now try getFeatureInfo
            if (valid) {
                if (!layer.available) {
                    layer.available = true
                    layer.save()
                }
                return true
            }
            else {

                layer.available = false
                layer.save()

                //test for get feature info
                def featInfURL = _constructFeatureInfoRequest(layer, params).toURL()
                def result = _checkConnection(featInfURL, _testGetFeatureInfo)

                if (!result) {
                    notifyOwner(layer, "GetMap and GetFeature")
                }
                else {
                    notifyOwner(layer, "GetMap")
                }
            }
        }

        return false
    }

    def _testGetFeatureInfo = {

        conn ->

            if (conn.contentType != null) {
                def contentType = conn.contentType.split(';')[0]
                return (_isValidFromResponse(conn.URL.text) && _checkFeatureInfoResponse(contentType))
            }
            return false
    }

    def _testGetMap = { conn ->
        if (conn.contentType != null) {
            def contentType = conn.contentType.split(';')[0]

            if (_checkGetMapResponse(contentType)) {
                log.debug("GetMap check successful")
                return true
            }
        }

        log.debug("GetMap check unsuccessful")
        return false
    }


    def _checkConnection(url, test) {
        try {
            def conn = url.openConnection()
            _addAuthentication(conn, url)
            def result = test.call(conn)
            return result
        }
        catch (e) {
            //does this catch connection errors/etc??
            // could this be an unusual WMS server
            e.printStackTrace()
            return false
        }
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

    def _checkFeatureInfoResponse(contentType) {
        return contentType == "text/xml"
    }

    def _checkGetMapResponse(contentType) {
        return !(contentType == "application/vnd.ogc.se_xml")
    }

    def _isValidFromResponse(String responseText) {

        def valid = true

        // its xml, test for exception messages, or sillyness
        valid = (responseText == "") ? false : valid
        valid = (responseText.find('<WMT_MS_Capabilities')) ? false : valid
        valid = (responseText.find('<ServiceExceptionReport')) ? false : valid

        // allow possible data changes
        valid = (responseText.find('InvalidRangeException')) ? true : valid

        return valid
    }

    String _constructFeatureInfoRequest(layer, params) {

        // Construct the getFeatureInfo request.
        // are returned at location 0,0.

        def queryStringArgs = [
            'VERSION': '1.1.1',
            'REQUEST': 'GetFeatureInfo',
            'LAYERS': layer.name,
            'STYLES': '',
            'SRS': layer.projection,
            'CRS': layer.projection,
            'BBOX': bboxFromLayer(layer),
            'QUERY_LAYERS': layer.name,
            'X': '0',
            'Y': '0',
            'I': '0',
            'J': '0',
            'WIDTH': '1',
            'HEIGHT': '1',
            'FEATURE_COUNT': '1'
        ]

        // Include INFO_FORMAT if we have a value for it
        if (params.format)
            queryStringArgs.INFO_FORMAT = params.format

        return urlWithQueryString(layer.server.uri, queryStringArgs)
    }

    String _constructGetMapRequest(layer, params) {

        // Construct the getMap request

        def queryStringArgs = [
            'VERSION': '1.1.1',
            'REQUEST': 'GetMap',
            'LAYERS': layer.name,
            'STYLES': '',
            'SRS': layer.projection,
            'CRS': layer.projection,
            'BBOX': bboxFromLayer(layer),
            'FORMAT': layer.server.imageFormat,
            'EXCEPTIONS': 'application/vnd.ogc.se_xml',
            'width': '50',
            'height': '50'
        ]

        return urlWithQueryString(layer.server.uri, queryStringArgs)
    }

    def bboxFromLayer(layer) {

        //if there's only one feature, the min and max values
        //will be the same and geoserver will throw an exception
        //so change minvalues if same as max values.

        def minX = distinctMinimum(layer.bboxMinX, layer.bboxMaxX)
        def minY = distinctMinimum(layer.bboxMinY, layer.bboxMaxY)

        return "$minX,$minY,${layer.bboxMaxX},${layer.bboxMaxY}"
    }

    def distinctMinimum(min, max) {

        min = min.toDouble()

        return (min == max) ? min - 1 : min
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
