/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal.wms

import org.slf4j.Logger
import org.slf4j.LoggerFactory

abstract class WmsServer {
    static final Logger log = LoggerFactory.getLogger(this)

    abstract getStyles(server, layer)

    abstract getFilters(server, layer)

    abstract getFilterValues(server, layer, filter)
}
