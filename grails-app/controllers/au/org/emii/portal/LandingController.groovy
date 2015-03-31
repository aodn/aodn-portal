package au.org.emii.portal

class LandingController {

    def portalBranding

    def index = {

        if (portalBranding.landingPage) {
            redirect(url: portalBranding.landingPage)
        }
        else {
            render(
                view: "index",
                model:[
                    resourceVersionNumber: grailsApplication.metadata.'app.version',
                    portalBranding: portalBranding
                ]
            )
        }
    }
}
