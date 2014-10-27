/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal.wms

import grails.converters.JSON

class NcwmsServer extends WmsServer {
    def getStyles(server, layer) {
        def json = JSON.parse(getUrlContent(getMetadataUrl(server, layer)))

        def styles = []

        if (json && json.supportedStyles && json.palettes) {
            styles = [
                styles: json.supportedStyles,
                palettes: json.palettes
            ]
        }

        return styles
    }

    def getFilters(server, layer) {
        def json = JSON.parse(getUrlContent(getMetadataUrl(server, layer)))

        def filters = [
            [
                label: "Time",
                type: "TimeSeries",
                name: "timesteps",
                possibleValues: parseDatesWithData(json.datesWithData)
            ]
        ]

        return filters
    }

    def getFilterValues(server, layer, filter) {
    }

    private parseDatesWithData(datesWithData) {
        def datesWithDataFormatted = []
        datesWithData.each() { year, months ->
            months.each() { month, days ->
                days.each() { day ->
                    // Month is zero based, so lets handle this
                    def formattedDate = String.format("%02d-%02d-%02dT00:00:00Z", year.toInteger(), month.toInteger() + 1, day.toInteger())
                    datesWithDataFormatted.push(formattedDate)
                };
            };
        };
        return datesWithDataFormatted
    }

    private String getUrlContent(url) {
        return new URL(url).text
    }

    private String getMetadataUrl(server, layer) {
        return String.format('%1$s?layerName=%2$s&REQUEST=GetMetadata&item=layerDetails', server, layer)
    }
}
