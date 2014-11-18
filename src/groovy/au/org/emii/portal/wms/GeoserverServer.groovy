/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal.wms

import grails.converters.JSON
import java.text.DateFormat
import java.text.SimpleDateFormat

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
                def possibleValues = []
                if (filter.possibleValues.size() > 0 && filter.possibleValues.possibleValue.size() > 0) {
                  possibleValues = filter.possibleValues.possibleValue.collect() { it -> it.text() }
                }

                filters.push(
                    [
                        label: filter.label.text(),
                        type: filter.type.text(),
                        name: filter.name.text(),
                        downloadOnly: filter.downloadOnly.text.toBoolean(),
                        possibleValues: possibleValues
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
        // TODO fetch this from geoserver
        def inputFile = new File("filters/${layer}.xml")
        return inputFile.text
    }
}
