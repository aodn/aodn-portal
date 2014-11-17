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

class NcwmsServer extends WmsServer {
    def getStyles(server, layer) {
        def json = JSON.parse(getUrlContent(getMetadataUrl(server, layer)))

        return [
            styles: json.supportedStyles,
            palettes: json.palettes,
            defaultPalette: json.defaultPalette
        ]
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
        // Assume for NcWMS only date can be the filter request
        def date = filter

        def urlFilterValues = String.format('%1$s?layerName=%2$s&REQUEST=GetMetadata&item=timesteps&day=%3$s', server, layer, date)
        def json = JSON.parse(getUrlContent(urlFilterValues))

        def filterValues = parseTimeSteps(date, json.timesteps)

        return filterValues.sort()
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
        return datesWithDataFormatted.sort()
    }

    private parseTimeSteps(date, timeSteps) {
        // Parse date and attach it to every timestep
        DateFormat format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
        Date day = format.parse(date)

        def timeStepsFormatted = []
        timeSteps.each() { timestep ->
            def formattedTimeStep = String.format('%sT%s', day.format("yyyy-MM-dd"), timestep)
            timeStepsFormatted.push(formattedTimeStep)
        }
        return timeStepsFormatted
    }

    private String getUrlContent(url) {
        return new URL(url).text
    }

    private String getMetadataUrl(server, layer) {
        return String.format('%1$s?layerName=%2$s&REQUEST=GetMetadata&item=layerDetails', server, layer)
    }
}
