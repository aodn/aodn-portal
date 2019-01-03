package au.org.emii.portal.wms

import au.org.emii.portal.SilentStacktraceException
import au.org.emii.portal.UrlUtils

class FilterConfigGeoserverServer extends WmsServer {

    private def filterValuesService
    private def filtersUrl

    FilterConfigGeoserverServer(filtersUrl, filterValuesService) {
        this.filtersUrl = filtersUrl
        this.filterValuesService = filterValuesService
    }

    def getStyles(server, layer) {
        return []
    }

    def getFilters(server, layer) {
        def filters = []

        try {
            def url = _buildFilterConfigUrl(layer)
            def xml = UrlUtils.load(url)
            filters = _parseFilterConfigXml(xml)
        } catch (e) {
            throw new SilentStacktraceException("Unable to parse filters for server '${server}', layer '${layer}'", false)
        }

        return filters
    }

    def getFilterValues(server, layer, filter) {
        return filterValuesService.getFilterValues(layer, filter)
    }

    def _buildFilterConfigUrl(layer) {
        String fixedLayerName = layer.replace(':','/');
        return filtersUrl +  "/" + fixedLayerName + '.xml'
    }

    def _parseFilterConfigXml(filterConfig) {
        def filters = []

        def xml = new XmlSlurper().parseText(filterConfig)

        xml.filter.each { filter ->

            def filterValue = [
                label: filter.label.text(),
                type: filter.type.text(),
                name: filter.name.text(),
                visualised: Boolean.valueOf(filter.visualised.text())
            ]

            if (!filter.wmsStartDateName.isEmpty() && !filter.wmsEndDateName.isEmpty()) {
                filterValue.put('wmsStartDateName', filter.wmsStartDateName.text())
                filterValue.put('wmsEndDateName', filter.wmsEndDateName.text())
            }

            filters.push(filterValue)
        }

        return filters
    }

}
