/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal.wms

import au.org.emii.portal.proxying.ExternalRequest

class GeoserverServer extends WmsServer {
    def dynamicFilters

    GeoserverServer(dynamicFilters) {
        this.dynamicFilters = dynamicFilters
    }

    def getStyles(server, layer) {
        def styles = []
        return styles
    }

    def getFilters(server, layer) {
        def filters = []

        try {
            def xml = new XmlSlurper().parseText(_getFiltersXml(server, layer))

            xml.filter.each { filter ->
                def filterName = filter.name.text()
                def filterType = filter.type.text()

                filters.push(
                    [
                        label: filter.label.text(),
                        type: filterType,
                        name: filterName,
                        visualised: Boolean.valueOf(filter.visualised.text())
                    ]
                )
            }
        }
        catch (e) {
            log.error "Unable to parse filters for server '${server}', layer '${layer}': '${e}'"
        }
        return filters
    }

    def _getFiltersXml(server, layer) {
        if (dynamicFilters) {
            return _getFiltersXmlFromGeoserver(server, layer)
        }
        else {
            return _getFiltersXmlFromFile(server, layer)
        }
    }

    def _getFiltersXmlFromFile(server, layer) {
        def workspaceName = getLayerWorkspace(layer)
        def layerName = getLayerName(layer)
        def inputFile = new File("filters/${workspaceName}/${layerName}/filters.xml")
        return inputFile.text
    }

    def _getFiltersXmlFromGeoserver(server, layer) {
        def filtersUrl = getFiltersUrl(server, layer)
        def outputStream = new ByteArrayOutputStream();
        def request = new ExternalRequest(outputStream, filtersUrl.toURL())

        request.executeRequest()
        return outputStream.toString("utf-8")
    }

    def getFilterValues(server, layer, filter) {
        def values = []

        try {
            def xml = new XmlSlurper().parseText(_getFilterValuesXml(server, layer, filter))

            if (xml.value.size() > 0) {
                values = xml.value.collect() { it -> it.text() }
            }
        }
        catch (e) {
            log.error "Unable to parse filters values for server '${server}', layer '${layer}', filter '${filter}': '${e}'"
        }

        return values
    }

    def _getFilterValuesXml(server, layer, filter) {
        if (dynamicFilters) {
            return _getFilterValuesXmlFromGeoserver(server, layer, filter)
        }
        else {
            return _getFilterValuesXmlFromFile(server, layer, filter)
        }
    }

    def _getFilterValuesXmlFromFile(server, layer, filter) {
        def workspaceName = getLayerWorkspace(layer)
        def layerName = getLayerName(layer)
        def inputFile = new File("filters/${workspaceName}/${layerName}/${filter}.xml")
        return inputFile.text
    }

    def _getFilterValuesXmlFromGeoserver(server, layer, filter) {
        def filtersUrl = getFilterValuesUrl(server, layer, filter)
        def outputStream = new ByteArrayOutputStream();
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

    static String getOwsEndpoint(server) {
        // Strip the '/wms' suffix and add '/ows' instead, s.t.:
        // https://geoserver/wms -> https://geoserver/ows
        def elements = server.split('/')
        return elements[0..elements.size()-2].join('/') + "/ows"
    }

    static String _getFiltersUrlBase(server, layer, request, extraOpts) {
        def serverOwsEndpoint = getOwsEndpoint(server)
        def workspaceName = getLayerWorkspace(layer)
        def layerName = getLayerName(layer)

        def final service = "layerFilters"
        def final version = "1.0.0"

        return serverOwsEndpoint + "?request=${request}&service=${service}&version=${version}&workspace=${workspaceName}&layer=${layerName}${extraOpts}"
    }

    static String getFiltersUrl(server, layer) {
        return _getFiltersUrlBase(server, layer, "enabledFilters", "")
    }

    static String getFilterValuesUrl(server, layer, filter) {
        return _getFiltersUrlBase(server, layer, "uniqueValues", "&propertyName=${filter}")
    }

    static Boolean _filterHasValues(filterType) {
        return filterType != "BoundingBox"
    }
}
