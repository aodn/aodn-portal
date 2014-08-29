package au.org.emii.portal

class LandingController {

    def oceanCurrentService
    def portalInstance
    def portalBranding

    def index = {

        render(
            view: portalInstance.name() + "index",
            model:[
                oceanCurrent: oceanCurrentService.getRandomDetails(),
                cfg: Config.activeInstance(),
                jsVerNum: grailsApplication.metadata.'app.version',
                portalBranding: portalBranding
            ]
        )
    }
}
