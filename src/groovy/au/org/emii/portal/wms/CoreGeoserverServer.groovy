package au.org.emii.portal.wms

import au.org.emii.portal.proxying.ExternalRequest
import groovy.json.JsonSlurper

import java.util.concurrent.ConcurrentHashMap

class CoreGeoserverServer extends WmsServer {

    private static def linkedWfsFeatureTypeMap = new ConcurrentHashMap()

    def groovyPageRenderer
    def baseFilterUrl
    def knownServers

    CoreGeoserverServer(groovyPageRenderer, baseFilterUrl, knownServers) {
        this.groovyPageRenderer = groovyPageRenderer
        this.baseFilterUrl = baseFilterUrl
        this.knownServers = knownServers
    }

    def getStyles(server, layer) {
        return []
    }

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

    def getFilters(server, layer) {
        if (this.baseFilterUrl && this.knownServers.find { it.uri == server}.filterDir) {
            return getFiltersFromFileUrl(server, layer)
        } else {
            return getFiltersViaDescribeFeatureType(server, layer)
        }
    }

    def getFiltersViaDescribeFeatureType(server, layer) {
        def filters = []

        def layerInfo = getLayerInfo(server, layer)

        if (layerInfo.owsType == "WCS") {

            filters.push(
                [
                    label           : 'Bounding Box',
                    type            : 'geometrypropertytype',
                    name            : 'position',
                    visualised      : false
                ]
            )
        }
        else {

            try {

                def xml = new XmlSlurper().parseText(_describeFeatureType(server, layer))

                def attributes = xml.'**'.findAll { node ->
                    node.name() == 'element' && node.@name != _removePrefix(layer)
                }

                boolean hasTemporalRange = false

                attributes.each { attribute ->
                    def propertyName = attribute.@name.text()
                    def propertyType = attribute.@type.text()

                    if (['time_coverage_start', 'time_coverage_end'].contains(propertyName)) {
                        // handle IMOS convention of mapping temporal range to single 'TIME'
                        // property on WFS featureType
                        if (!hasTemporalRange) {
                            filters.push(
                                [
                                    label     : 'Time',
                                    type      : 'datetime',
                                    name      : 'TIME',
                                    visualised: true,
                                    wmsStartDateName: 'time_coverage_start',
                                    wmsEndDateName: 'time_coverage_end'
                                ]
                            )
                            hasTemporalRange = true
                        }
                    } else {
                        filters.push(
                            [
                                label     : _toLabel(propertyName),
                                type      : _toFilterType(propertyType),
                                name      : propertyName,
                                visualised: true
                            ]
                        )
                    }
                }
            } catch (e) {
                log.error "Unable to parse filters for server '${server}', layer '${layer}'", e
            }
        }
        return filters
    }

    def getFiltersFromFileUrl(server, layer) {
        def filters = []

        try {
            def xml = new XmlSlurper().parseText(_getFiltersXml(server, layer))

            xml.filter.each { filter ->

                filters.push([
                    label: filter.label.text(),
                    type: filter.type.text(),
                    name: filter.name.text(),
                    visualised: Boolean.valueOf(filter.visualised.text()),
                    wmsStartDateName: filter.wmsStartDateName.text(),
                    wmsEndDateName: filter.wmsEndDateName.text()
                ])
            }
        }
        catch (e) {
            log.error "Unable to parse filters for server '${server}', layer '${layer}'", e
        }

        return filters
    }

    def _getFiltersXml(server, layer) {
        _loadUrl(_getFiltersUrl(server, layer))
    }

    static def _loadUrl(address) {
        def outputStream = new ByteArrayOutputStream()
        def request = new ExternalRequest(outputStream, address.toURL())

        request.executeRequest()
        return outputStream.toString("utf-8")
    }

    String _getFiltersUrl(server, layer) {
        String filterDir = this.knownServers.find { it.uri == server}.filterDir
        String fixedLayerName = layer.replace(':','/');
        return  this.baseFilterUrl + '/' + filterDir + '/' +  fixedLayerName + '.xml'
    }

    def getFilterValues(server, layer, filter) {
        def values = []

        try {
            def json = new JsonSlurper().parseText(_getPagedUniqueValues(server, layer, filter))

            values = json.values
        } catch (e) {
            log.error "Unable to parse filters values for server '${server}', layer '${layer}', filter '${filter}'", e
        }

        return values
    }

    def _describeFeatureType(server, layer) {
        def layerInfo = getLayerInfo(server, layer)
        def requestUrl = layerInfo.wfsUrl + "request=DescribeFeatureType&service=WFS&version=1.0.0&typeName=${layerInfo.typeName}"
        def outputStream = new ByteArrayOutputStream()
        def request = new ExternalRequest(outputStream, requestUrl.toURL())

        request.executeRequest()
        return outputStream.toString("utf-8")
    }

    def _getPagedUniqueValues(server, layer, filter) {
        def layerInfo = getLayerInfo(server, layer)
        def params = [typeName: layerInfo.typeName, propertyName: filter]
        def body = groovyPageRenderer.render(template: '/filters/pagedUniqueRequest.xml', model: params)
        log.debug("Request body:\n\n${body}")

        def connection = layerInfo.wfsUrl.toURL().openConnection()

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

    String _describeLayer(server, layer) {
        def requestUrl = server + "?request=DescribeLayer&service=WMS&version=1.1.1&layers=${layer}"
        def outputStream = new ByteArrayOutputStream()
        def request = new ExternalRequest(outputStream, requestUrl.toURL())

        request.executeRequest()

        return outputStream.toString("utf-8")
    }

    def _toFilterType(value) {
        _removePrefix(value.toLowerCase())
    }

    def _removePrefix(value) {
        value - ~/^.*:/
    }

    def _toLabel(attributeName) {
        attributeName.replaceAll('_', ' ')
    }

}
