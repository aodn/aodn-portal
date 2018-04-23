package au.org.emii.portal.wms

import au.org.emii.portal.proxying.ExternalRequest

class DataTrawlerServer extends WmsServer {
    def groovyPageRenderer

    DataTrawlerServer(groovyPageRenderer) {
        this.groovyPageRenderer = groovyPageRenderer
    }

    def getStyles(server, layer) {
        return []
    }

    def getFilters(server, datatype) {
        def filters = []

        try {
            log.info(_getFiltersXml(server, datatype))
            def xml = new XmlSlurper().parseText(_getFiltersXml(server, datatype))

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

        } catch (e) {
            log.error "Unable to parse filters for server '${server}', datatype '${datatype}'", e
        }
    }

    def getFilterValues(server, datatype, filterName) {
        def filterValues = []

        try {
            def xml = new XmlSlurper().parseText(_getFiltersXml(server, datatype))

            xml.filter.each { filter ->
                if (filterName == filter.name) {
                    filter.values.each { filterValue ->
                        filterValues.push(filterValue)
                    }
                }
            }
        }
        catch (e) {
            log.error "Unable to parse filters values for server '${server}', layer '${datatype}', filter '${filterName}'", e
        }

        return filterValues
    }

    def _getFiltersXml(server, datatype) {
        def requestUrl = server + "?datatype=${datatype}&xmlFilter=true"
        log.info(requestUrl.toString())
        def outputStream = new ByteArrayOutputStream()
        def request = new ExternalRequest(outputStream, requestUrl.toURL())

        request.executeRequest()
        return outputStream.toString("utf-8")
    }
}
