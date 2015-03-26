package au.org.emii.portal

class LandingController {

    def oceanCurrentService
    def portalBranding

    def index = {

        if (portalBranding.landingPage) {
            redirect(url: portalBranding.landingPage)
        }
        else {
            render(
                view: "index",
                model:[
                    oceanCurrent: oceanCurrentService.getRandomDetails(),
                    resourceVersionNumber: grailsApplication.metadata.'app.version',
                    portalBranding: portalBranding
                ]
            )
        }
    }
}
