package au.org.emii.portal.bootstrap

import au.org.emii.portal.display.MenuJsonCache

class MenuBootStrap {

	def init = { servletContext ->
		
		def configInstance = au.org.emii.portal.Config.activeInstance()
		if (configInstance && configInstance.defaultMenu) {
			def defaultMenu = configInstance.defaultMenu.cache(MenuJsonCache.instance())
		}
	}
}
