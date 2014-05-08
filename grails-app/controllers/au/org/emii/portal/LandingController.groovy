package au.org.emii.portal

class LandingController {

    def oceanCurrentService
    def portalInstance

    def index = {

        render(
            view: portalInstance.name() + "index",
            model: [
                oceanCurrent   : oceanCurrentService.getRandomDetails(),
                cfg            : Config.activeInstance(),
                portalBuildInfo: _portalBuildInfo(),
                jsVerNum       : grailsApplication.metadata.'app.version'
            ]
        )
    }

    def _portalBuildInfo() {

        def md = grailsApplication.metadata
        return "${portalInstance.name()} Portal v${md.'app.version'}, build date: ${md.'app.build.date' ?: '<i>not recorded</i>'}"
    }
}
