package au.org.emii.portal

class SplashController {
	
	def cfgInstanceName = grailsApplication.config.instanceName.toLowerCase()

    // the home page center content
    def index = {
        render(view: "${cfgInstanceName}Index")
    }
    
    // links
	def links = {
		render(view: "${cfgInstanceName}Links")
	}
     
	// facebook twitter etc
	def community = {
		render(view: "${cfgInstanceName}Community") 
	}
}
