package au.org.emii.portal

class DownloadAuthController {

    def downloadAuthService
    def simpleCaptchaService

    def index = {
        resetCaptcha(session)
        if (downloadAuthService.needsChallenge(request.getRemoteAddr(), session)) {
            render(view: "challenge")
        }
        else {
            render ""
        }
    }

    def resetCaptcha(session) {
        session[simpleCaptchaService.CAPTCHA_IMAGE_ATTR] = null;
    }

}
