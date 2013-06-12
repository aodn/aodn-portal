
/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import groovy.time.TimeCategory

class MenuRecacheJob {

	def timeout = 10 * 60 * 1000 // milliseconds

	def execute() {

		def startTime = new Date()

		Config.recacheDefaultMenu()

		use(TimeCategory) {

			log.debug "Menu recache took ${new Date() - startTime}"
		}
	}
}