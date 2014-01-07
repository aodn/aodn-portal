package au.org.emii.portal

class LandingController {

    def oceanCurrentService
    def portalInstance

    def index = {

        println Config.activeInstance()

        [
            oceanCurrent: oceanCurrentService.getRandomDetails(),
            cfg: Config.activeInstance(),
            portalBuildInfo: _portalBuildInfo()
        ]
    }

    def _portalBuildInfo() {

        def md = grailsApplication.metadata
        return "${ portalInstance.name() } Portal v${ md.'app.version' }, build date: ${md.'app.build.date' ?: '<i>not recorded</i>'}"
    }
}
