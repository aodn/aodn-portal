package au.org.emii.portal

class DownloadAuthService {

    static transactional = true

    def grailsApplication
    def simpleCaptchaService

    def verifyChallengeResponse(ipAddress, session, response) {

        if (needsChallenge(ipAddress, session)) {
            if (simpleCaptchaService.validateCaptcha(response)) {
                // Tag this session as one which doesn't need authentication anymore
                session.downloadAuth = true
                return true
            }
            else {
                return false
            }
        }
        else {
            return true
        }
    }

    def needsChallenge(ipAddress, session) {

        if (session.downloadAuth) {
            log.info "$ipAddress already proved to be human"
            return false
        }

        def needsChallenge = true

        grailsApplication.config.trustedClients.each {
            if (ipAddress.matches(it)) {
                needsChallenge = false
                log.info "Allowing $ipAddress to download without challenge"
            }
        }

        return needsChallenge
    }

}
