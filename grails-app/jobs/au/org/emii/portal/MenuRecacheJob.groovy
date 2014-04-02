
/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import static au.org.emii.portal.DateTimeUtils.*

class MenuRecacheJob {

    def timeout = 30 * MINUTES

    def execute() {

        log.debug "MenuRecacheJob.execute()"

        Config.recacheDefaultMenu()
    }
}
