package au.org.emii.portal.wms

import au.org.emii.portal.proxying.ExternalRequest
import java.util.concurrent.ConcurrentHashMap

class GeoserverUtils {

    private static def linkedWfsFeatureTypeMap = new ConcurrentHashMap()

    def _describeFeatureType(server, layer) {
        def (wfsServer, typeName) = _lookupWfs(server, layer)
        def requestUrl = wfsServer + "request=DescribeFeatureType&service=WFS&version=1.0.0&typeName=${typeName}"
        def outputStream = new ByteArrayOutputStream()
        def request = new ExternalRequest(outputStream, requestUrl.toURL())

        request.executeRequest()
        return outputStream.toString("utf-8")
    }

    def _getPagedUniqueValues(server, layer, filter, renderer) {
        def (wfsServer, typeName) = _lookupWfs(server, layer)
        def params = [typeName: typeName, propertyName: filter]
        def body = renderer.render(template: '/filters/pagedUniqueRequest.xml', model: params)
        log.debug("Request body:\n\n${body}")

        def connection = wfsServer.toURL().openConnection()

        connection.with {
            doOutput = true
            requestMethod = 'POST'
            setRequestProperty("Content-Type", "application/xml; charset=utf-8")
            outputStream.withWriter { writer ->
                writer << body
            }
            content.text
        }
    }

    def _lookupWfs(server, layer) {
        def wmsLayer = [server, layer]

        if (linkedWfsFeatureTypeMap.containsKey(wmsLayer)) {
            return linkedWfsFeatureTypeMap.get(wmsLayer)
        }

        String response = _describeLayer(server, layer)

        def parser = new XmlSlurper()
        parser.setFeature("http://apache.org/xml/features/disallow-doctype-decl", false)
        parser.setFeature("http://apache.org/xml/features/nonvalidating/load-external-dtd", false);
        def xml = parser.parseText(response)

        def wfsFeatureType = [xml.LayerDescription.@wfs.text(), xml.LayerDescription.Query.@typeName.text()]

        linkedWfsFeatureTypeMap.put(wmsLayer, wfsFeatureType)

        return wfsFeatureType
    }

    def _describeLayer(server, layer) {
        def requestUrl = server + "?request=DescribeLayer&service=WMS&version=1.1.1&layers=${layer}"
        def outputStream = new ByteArrayOutputStream()
        def request = new ExternalRequest(outputStream, requestUrl.toURL())

        request.executeRequest()

        return outputStream.toString("utf-8")
    }
}
