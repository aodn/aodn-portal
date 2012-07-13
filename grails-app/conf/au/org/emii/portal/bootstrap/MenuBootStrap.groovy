package au.org.emii.portal.bootstrap

import au.org.emii.portal.display.MenuJsonCache
import au.org.emii.portal.display.MenuJsonCreator

class MenuBootStrap {

	def init = { servletContext ->
		
		def configInstance = au.org.emii.portal.Config.activeInstance()
		if (configInstance && configInstance.defaultMenu) {
			def defaultMenu = configInstance.defaultMenu.toDisplayableMenu()
			def jsonCreator = new MenuJsonCreator()
			MenuJsonCache.instance().add(defaultMenu, jsonCreator.menuToJson(defaultMenu))
		}
	}
}
