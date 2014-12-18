/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal.wms

import au.org.emii.portal.wms.filters.GeoServerFiltersRequest

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

    def _getFiltersXml(server, layer) {
        def geoServerFilterRequest = new GeoServerFiltersRequest(getGeoServerUrlPath(server), layer)

        // TODO fetch this from geoserver
        def inputFile = new File("filters/${layer}.xml")
        return inputFile.text
    }

    def getGeoServerUrlPath(server) {
        return server.substring(0, getServerUrlPathEnd(server))
    }

    def getServerUrlPathStart(serverUrlString) {
        return serverUrlString.indexOf(new URI(serverUrlString).getPath())
    }

    def getServerUrlPathEnd(serverUrlString) {
        // The + 1 ensures we get the slash,
        return getServerUrlPathStart(serverUrlString) + getFirstUrlPathSegment(serverUrlString).length() + 1
    }

    def getFirstUrlPathSegment(serverUrlString) {
        return new URI(serverUrlString).getPath().split('/')[1]
    }
}
