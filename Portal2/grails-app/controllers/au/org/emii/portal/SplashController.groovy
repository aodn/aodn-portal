package au.org.emii.portal

class SplashController {

    // the home page center content
    def index = {
        // switch here for alternate content? 
        render(view: "index")
    
    }
    
    // links
     def links = {
        // switch here for alternate content? 
        render(view: "IMOSLinks")
     }
     
     // facebook twitter etc
     def community = {
        // switch here for alternate content? 
        render(view: "community")
     }
    
    
}
