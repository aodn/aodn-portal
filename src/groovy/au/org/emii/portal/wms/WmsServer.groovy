package au.org.emii.portal.wms

import au.org.emii.portal.proxying.ExternalRequest
import grails.converters.JSON
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.util.concurrent.ConcurrentHashMap

abstract class WmsServer {
    static final Logger log = LoggerFactory.getLogger(this)
    private static def linkedWfsFeatureTypeMap = new ConcurrentHashMap()

    abstract getStyles(server, layer)

    abstract getFilters(server, layer)

    def getFeatureCount(params) {
        def layerInfo = getLayerInfo(params.server, params.layer)
        try {
            def cql = URLEncoder.encode(params.filter,"UTF-8")
            def url = "${layerInfo.wfsUrl}SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&typeName=${params.layer}&outputFormat=json&CQL_FILTER=${cql}&count=1";
            def json = JSON.parse(url.toURL().text)
            return json.totalFeatures
        }
        catch (e) {
            log.error "Unable to parse feature count for server '${layerInfo.wfsUrl}', layer '${params.layer}', filter '${params.filter}' - ${url}", e
        }
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
                owsURL: xml.LayerDescription.@owsURL.text(),
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
