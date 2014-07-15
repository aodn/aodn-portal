package au.org.emii.portal

class DownloadAuthController {

    def downloadAuthService

    def index = {
        if (downloadAuthService.needsChallenge(request.getRemoteAddr(), session)) {
            render(view: "challenge")
        }
        else {
            render ""
        }
    }

}
