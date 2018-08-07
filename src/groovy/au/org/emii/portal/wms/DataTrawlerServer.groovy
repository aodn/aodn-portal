package au.org.emii.portal.wms

class DataTrawlerServer extends CoreGeoserverServer {

    def groovyPageRenderer
    protected def utils = new GeoserverUtils()

    DataTrawlerServer(groovyPageRenderer) {
        super(groovyPageRenderer)
    }

    def getStyles(server, layer) {
        return []
    }

    def getFilters(server, layer) {
        def filters = []

        try {
            def xml = new XmlSlurper().parseText(utils._describeFeatureType(server, layer))

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
            log.error "Unable to parse filters for server '${server}', layer '${layer}'", e
        }

        return filters
    }

    def _toLabel(attributeName) {
        attributeName.replaceAll('_', ' ').toLowerCase().capitalize()
    }
}
