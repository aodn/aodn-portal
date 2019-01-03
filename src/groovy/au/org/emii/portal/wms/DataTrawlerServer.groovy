package au.org.emii.portal.wms

import au.org.emii.portal.SilentStacktraceException

class DataTrawlerServer extends CoreGeoserverServer {

    DataTrawlerServer(filterValuesService) {
        super(filterValuesService)
    }

    def getFilters(server, layer) {
        def filters = []

        try {
            def xml = new XmlSlurper().parseText(_describeFeatureType(server, layer))

            def attributes = xml.'**'.findAll { node ->
                node.name() == 'element' && node.@name != _removePrefix(layer)
            }

            boolean hasTemporalRange = false

            attributes.each { attribute ->
                def propertyName = attribute.@name.text()
                def propertyType = attribute.@type.text()

                if (['TIME_COVERAGE_START', 'TIME_COVERAGE_END'].contains(propertyName)) {
                    // HACK: handle CSIRO layers with capitalised property names
                    if (!hasTemporalRange) {
                        filters.push(
                            [
                                label     : 'Time',
                                type      : 'datetime',
                                name      : 'TIME',
                                visualised: true,
                                wmsStartDateName: 'TIME_COVERAGE_START',
                                wmsEndDateName: 'TIME_COVERAGE_END'
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
            throw new SilentStacktraceException("Unable to parse filters for server '${server}', layer '${layer}'", false)
        }

        return filters
    }

    def _toLabel(attributeName) {
        attributeName.replaceAll('_', ' ').toLowerCase().capitalize()
    }
}
