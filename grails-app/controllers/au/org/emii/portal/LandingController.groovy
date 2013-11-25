package au.org.emii.portal

import grails.util.Environment

class LandingController {

    def oceanCurrentService
    def portalInstance

    def index = {

        if (Environment.current == Environment.PRODUCTION || params.devEnvironment) {
            [
                oceanCurrent: oceanCurrentService.getRandomDetails(),
                cfg: Config.activeInstance(),
                portalBuildInfo: _portalBuildInfo()
            ]
        }
        else {
            redirect(controller: "home")
        }
    }

    def dev = {
        redirect (action: 'index', params: [devEnvironment: true])
    }

    def _portalBuildInfo() {

        def md = grailsApplication.metadata
        return "${ portalInstance.name() } Portal v${ md.'app.version' }, build date: ${md.'app.build.date' ?: '<i>not recorded</i>'}"
    }
}
