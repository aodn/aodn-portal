package au.org.emii.portal

class SplashController {

    // the home page center content
    def index = {
        // switch here for alternate content? 
        render(view: "index")
    }
    
    // links
     def links = {
        if (grailsApplication.config.instanceName == 'IMOS') { 
            render(view: "IMOSLinks")
        }
        else {
            render('')
        }
     }
     
     // facebook twitter etc
     def community = {
        if (grailsApplication.config.instanceName == 'IMOS') {
            render('')
        }
        else {
           render(view: "community") 
        }
     }
}
