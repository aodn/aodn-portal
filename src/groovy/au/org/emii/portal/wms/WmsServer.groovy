/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal.wms

abstract class WmsServer {
    abstract getStyles(server, layer)

    abstract getFilters(server, layer)

    abstract getFilterValues(server, layer, filter)
}
