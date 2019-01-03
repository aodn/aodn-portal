package au.org.emii.portal.wms

import au.org.emii.portal.SilentStacktraceException
import au.org.emii.portal.proxying.ExternalRequest

class CoreGeoserverServer extends WmsServer {

    private def filterValuesService

    CoreGeoserverServer(filterValuesService) {
        this.filterValuesService = filterValuesService
    }

    def getStyles(server, layer) {
        return []
    }

    def getFilters(server, layer) {
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
                    }
                    else {
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
            }
            catch (e) {
                throw new SilentStacktraceException("Unable to parse filters for server '${server}', layer '${layer}'", false)
            }
        }

        return filters
    }

    def getFilterValues(Object server, Object layer, Object filter) {
        return filterValuesService.getFilterValues(layer, filter)
    }

    def _describeFeatureType(server, layer) {
        def layerInfo = getLayerInfo(server, layer)
        def requestUrl = layerInfo.wfsUrl + "request=DescribeFeatureType&service=WFS&version=1.0.0&typeName=${layerInfo.typeName}"
        def outputStream = new ByteArrayOutputStream()
        def request = new ExternalRequest(outputStream, requestUrl.toURL())

        request.executeRequest()
        return outputStream.toString("utf-8")
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
        attributeName.replaceAll('_', ' ').toLowerCase()
    }

}
