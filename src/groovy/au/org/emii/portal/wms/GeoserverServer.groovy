/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal.wms

import au.org.emii.portal.proxying.ExternalRequest

class GeoserverServer extends WmsServer {
    def getStyles(server, layer) {
        def styles = []
        return styles
    }

    def getFilters(server, layer) {
        def filters = []

        try {
            def xml = new XmlSlurper().parseText(_getFiltersXml(server, layer))

            xml.filter.each { filter ->
                def values = []
                if (filter.values.size() > 0 && filter.values.value.size() > 0) {
                    values = filter.values.value.collect() { it -> it.text() }
                }

                filters.push(
                    [
                        label: filter.label.text(),
                        type: filter.type.text(),
                        name: filter.name.text(),
                        visualised: Boolean.valueOf(filter.visualised.text()),
                        values: values
                    ]
                )
            }
        }
        catch (e) {
            log.error "Unable to parse filters for server '${server}', layer '${layer}': '${e}'"
        }
        return filters
    }

    def getFilterValues(server, layer, filter) {
        return []
    }

    // TODO remove this function
    def _getFiltersXml(server, layer) {
        def workspaceName = getLayerWorkspace(layer)
        def layerName = getLayerName(layer)
        def inputFile = new File("filters/${workspaceName}/${layerName}/filters.xml")
        return inputFile.text
    }

    // TODO rename this function to _getFiltersXml
    def _getFiltersXmlFromGeoserver(server, layer) {
        def filtersUrl = getFiltersUrl(server, layer)
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

    static String getFiltersUrl(server, layer) {
        def serverOwsEndpoint = getOwsEndpoint(server)
        def workspaceName = getLayerWorkspace(layer)
        def layerName = getLayerName(layer)

        def final request = "enabledFilters"
        def final service = "layerFilters"
        def final version = "1.0.0"

        return serverOwsEndpoint + "?request=${request}&service=${service}&version=${version}&workspace=${workspaceName}&layer=${layerName}"
    }
}
