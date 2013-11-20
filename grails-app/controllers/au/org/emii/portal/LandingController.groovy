package au.org.emii.portal

import grails.util.Environment

class LandingController {


    def index = {

        if ( Environment.current == Environment.PRODUCTION ) {
            [ configInstance: Config.activeInstance() ]
        }
        else {
            redirect(controller: "home")
        }

    }
}
