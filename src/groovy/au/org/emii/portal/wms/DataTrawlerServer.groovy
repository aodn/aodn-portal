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
            def xml = new XmlSlurper().parseText(_getFiltersXml(server, layer))

            xml.filter.each { filter ->
                def visualised = Boolean.valueOf(filter.visualised.text())
                if (visualised) {
                    def wmsStartDateName = filter.wmsStartDateName.text()
                    def wmsEndDateName = filter.wmsEndDateName.text()
                    if (wmsStartDateName != "" && wmsEndDateName != "") {
                        filters.push(
                            [
                                label           : filter.label.text(),
                                type            : filter.type.text(),
                                name            : filter.name.text(),
                                visualised      : visualised,
                                wmsStartDateName: wmsStartDateName.toUpperCase(),
                                wmsEndDateName  : wmsEndDateName.toUpperCase()
                            ]
                        )
                    } else {
                        filters.push(
                            [
                                label           : filter.label.text(),
                                type            : filter.type.text(),
                                name            : filter.name.text(),
                                visualised      : visualised
                            ]
                        )
                    }
                }
            }
        }
        catch (e) {
            log.error "Unable to parse filters for server '${server}', layer '${layer}'", e
        }

        return filters
    }

    def _getFiltersXml(server, layer) {
        utils._loadUrl(getFiltersUrl(server, layer))
    }

    static String getFiltersUrl(server, layer) {
        // Mock endpoint
        return server + layer
    }
}
