
/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

class MenuRecacheJob {

    def timeout = 30 * 60 * 1000 // milliseconds

    def execute() {

        log.debug "MenuRecacheJob.execute()"

        Config.recacheDefaultMenu()
    }
}
