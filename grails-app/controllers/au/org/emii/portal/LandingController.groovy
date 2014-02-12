package au.org.emii.portal

class LandingController {

    def oceanCurrentService
    def portalInstance

    def index = {

        def config = Config.activeInstance()

        render(
            view: portalInstance.name() + "index",
            model:[
                oceanCurrent: oceanCurrentService.getRandomDetails(),
                cfg: config,
                motd: _motd(config),
                portalBuildInfo: _portalBuildInfo()
            ]
        )
    }

    def _motd(config) {

        if (config.showMotd()) {

            def motd = config.motd
            return [
                title: motd.motdTitle,
                motd: motd.motd.encodeAsJavaScript()
            ]
        }

        return null
    }

    def _portalBuildInfo() {

        def md = grailsApplication.metadata
        return "${ portalInstance.name() } Portal v${ md.'app.version' }, build date: ${md.'app.build.date' ?: '<i>not recorded</i>'}"
    }
}
