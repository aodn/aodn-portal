import au.org.emii.portal.config.JsonMarshallingRegistrar
import au.org.emii.portal.display.MenuJsonCache
import au.org.emii.portal.display.MenuJsonCreator

class BootStrap {

    def init = { servletContext ->
		
		JsonMarshallingRegistrar.registerJsonMarshallers()
		
		def configInstance = au.org.emii.portal.Config.activeInstance()
		if (configInstance) {
			def defaultMenu = configInstance.defaultMenu?.toDisplayableMenu()
			def jsonCreator = new MenuJsonCreator()
			MenuJsonCache.instance().add(defaultMenu, jsonCreator.menuToJson(defaultMenu))
		}
    }
	
    def destroy = {
    }
}
