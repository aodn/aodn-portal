package au.org.emii.portal.wms

import au.org.emii.portal.proxying.ExternalRequest
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.util.concurrent.ConcurrentHashMap

abstract class WmsServer {
    static final Logger log = LoggerFactory.getLogger(this)
    private static def linkedWfsFeatureTypeMap = new ConcurrentHashMap()

    abstract getStyles(server, layer)

    abstract getFilters(server, layer)

    def getFeatureCount(server, layer, filter) {
        def layerInfo = getLayerInfo(server, layer)
        return new FeatureCountService().getWfsFeatureCount(layerInfo.wfsUrl, layer, filter)
    }

    abstract getFilterValues(server, layer, filter)

    def getLayerInfo(server, layer) {

        def wmsLayer = [server, layer]

        if (linkedWfsFeatureTypeMap.containsKey(wmsLayer)) {
            return linkedWfsFeatureTypeMap.get(wmsLayer)
        }

        String response = _describeLayer(server, layer)

        def parser = new XmlSlurper()
        parser.setFeature("http://apache.org/xml/features/disallow-doctype-decl", false)
        parser.setFeature("http://apache.org/xml/features/nonvalidating/load-external-dtd", false);
        def xml = parser.parseText(response)

        def wfsFeatureType = [
                owsType: xml.LayerDescription.@owsType.text(),
                wfsUrl: xml.LayerDescription.@wfs.text(),
                typeName: xml.LayerDescription.Query.@typeName.text()
        ]

        linkedWfsFeatureTypeMap.put(wmsLayer, wfsFeatureType)

        return wfsFeatureType
    }

    String _describeLayer(server, layer) {

        def requestUrl = server + "?request=DescribeLayer&service=WMS&version=1.1.1&layers=${layer}"
        def outputStream = new ByteArrayOutputStream()
        try {
            def request = new ExternalRequest(outputStream, requestUrl.toURL())
            request.executeRequest()
        }
        catch(e) {
            log.error(e)
        }

        return outputStream.toString("utf-8")
    }
}
