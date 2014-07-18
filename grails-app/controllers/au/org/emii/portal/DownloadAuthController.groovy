package au.org.emii.portal

class DownloadAuthController {

    def downloadAuthService

    def index = {
        downloadAuthService.resetChallenge(session)

        if (downloadAuthService.needsChallenge(request.getRemoteAddr(), session)) {
            render(view: "challenge")
        }
        else {
            render ""
        }
    }

}
