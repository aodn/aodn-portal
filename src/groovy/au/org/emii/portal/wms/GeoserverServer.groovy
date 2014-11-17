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
        return filters
    }

    def getFilterValues(server, layer, filter) {
        return []
    }
}
