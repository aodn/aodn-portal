package au.org.emii.portal

class SplashController {
	
	def cfgInstanceName = grailsApplication.config.instanceName.toLowerCase()
    def oceanCurrentService

    // the home page center content
    def index = {
		
		def oceanCurrentObj = oceanCurrentService.getRandomDetails()
		
        render(view: "${cfgInstanceName}Index", model:[ oceanCurrent: oceanCurrentObj])
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
