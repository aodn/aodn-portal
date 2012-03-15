package au.org.emii.portal

class HomeController {

	def grailsApplication

    def index = { 
      // this is the main portal entry
      // get the only instance of the config
      [configInstance: Config.activeInstance()]
    }
	
	def config = {
		// This nearly works but there is some sort of IllegalAccessException
		// deep in the bowels of an area we don't care about, so until that is
		// somehow resolved we need to add options we want to use manually :(
		//render grailsApplication.config as JSON
		render(contentType:"text/json") {
			/*
			 * We're aiming for something like the following
			 * 
			 * { grailsConfig: [
			 *     {name: 'config.key.1', value:'setting.1'},
        	 *     {name: 'config.key.2', value:'setting.2'}
			 *   ]
			 * }
			 */
			
			grailsConfig = [
				[ name: 'spatialsearch.url', value: grailsApplication.config.spatialsearch.url ]
				// To add another config add a column after the entry above and follow the same map format
			]
		}
	}
}