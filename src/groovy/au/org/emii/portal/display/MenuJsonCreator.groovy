package au.org.emii.portal.display

import grails.converters.JSON;

class MenuJsonCreator {

	def menuToJson(menu) {
		def displayMenu = new au.org.emii.portal.display.Menu(menu)
		return JSON.use('deep') {
			displayMenu as JSON
		}.toString()
	}
}
