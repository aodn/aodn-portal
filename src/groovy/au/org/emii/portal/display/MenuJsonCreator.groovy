package au.org.emii.portal.display

import grails.converters.JSON;

class MenuJsonCreator {

	def menuToJson(menu) {
		def displayMenu = new MenuPresenter(menu)
		return JSON.use('deep') {
			displayMenu as JSON
		}.toString()
	}
}
