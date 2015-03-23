/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal.wms

import au.org.emii.portal.proxying.ExternalRequest

class GeoserverServer extends WmsServer {
    def filePath

    GeoserverServer(filePath) {
        this.filePath = filePath
    }

    def getStyles(server, layer) {

        return []
    }

    def getFilters(server, layer) {
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

        if (filePath) {
            return _getFiltersXmlFromFile(layer)
        }
        else {
            return _getFiltersXmlFromGeoserver(server, layer)
        }
    }

    def _getFiltersXmlFromFile(layer) {
        def workspaceName = getLayerWorkspace(layer)
        def layerName = getLayerName(layer)
        def inputFile = new File("$filePath/${workspaceName}/${layerName}/filters.xml")
        return inputFile.text
    }

    def _getFiltersXmlFromGeoserver(server, layer) {
        def filtersUrl = getFiltersUrl(server, layer)
        def outputStream = new ByteArrayOutputStream()
        def request = new ExternalRequest(outputStream, filtersUrl.toURL())

        request.executeRequest()
        return outputStream.toString("utf-8")
    }

    def getFilterValues(server, layer, filter) {
        def values = []

        try {
            def xml = new XmlSlurper().parseText(_getFilterValuesXml(server, layer, filter))

            values = xml.value.collect { it.text() }
        }
        catch (e) {
            log.error "Unable to parse filters values for server '${server}', layer '${layer}', filter '${filter}'", e
        }

        return values
    }

    def _getFilterValuesXml(server, layer, filter) {

        if (filePath) {
            return _getFilterValuesXmlFromFile(layer, filter)
        }
        else {
            return _getFilterValuesXmlFromGeoserver(server, layer, filter)
        }
    }

    def _getFilterValuesXmlFromFile(layer, filter) {
        def workspaceName = getLayerWorkspace(layer)
        def layerName = getLayerName(layer)
        def inputFile = new File("$filePath/${workspaceName}/${layerName}/${filter}.xml")
        return inputFile.text
    }

    def _getFilterValuesXmlFromGeoserver(server, layer, filter) {
        def filtersUrl = getFilterValuesUrl(server, layer, filter)
        def outputStream = new ByteArrayOutputStream()
        def request = new ExternalRequest(outputStream, filtersUrl.toURL())

        request.executeRequest()
        return outputStream.toString("utf-8")
    }

    static String getLayerWorkspace(fullLayerName) {
        if (fullLayerName.contains(":")) {
            return fullLayerName.split(":")[0]
        }
        else {
            return ""
        }
    }

    static String getLayerName(fullLayerName) {
        if (fullLayerName.contains(":")) {
            return fullLayerName.split(":")[1]
        }
        else {
            return fullLayerName
        }
    }

    static String _getFiltersUrlBase(server, layer, request, extraOpts) {
        def workspaceName = getLayerWorkspace(layer)
        def layerName = getLayerName(layer)

        def final service = "layerFilters"
        def final version = "1.0.0"

        return server + "?request=${request}&service=${service}&version=${version}&workspace=${workspaceName}&layer=${layerName}${extraOpts}"
    }

    static String getFiltersUrl(server, layer) {
        return _getFiltersUrlBase(server, layer, "enabledFilters", "")
    }

    static String getFilterValuesUrl(server, layer, filter) {
        return _getFiltersUrlBase(server, layer, "uniqueValues", "&propertyName=${filter}")
    }
}
