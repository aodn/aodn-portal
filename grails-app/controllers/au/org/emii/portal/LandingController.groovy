package au.org.emii.portal

class LandingController {

    def oceanCurrentService
    def portalInstance
    def portalBranding

    def index = {

        if (portalBranding.landingPage) {
            redirect(url: portalBranding.landingPage)
        }
        else {
            render(
                view: portalInstance.name() + "index",
                model:[
                    oceanCurrent: oceanCurrentService.getRandomDetails(),
                    resourceVersionNumber: grailsApplication.metadata.'app.version',
                    portalBranding: portalBranding
                ]
            )
        }
    }
}
