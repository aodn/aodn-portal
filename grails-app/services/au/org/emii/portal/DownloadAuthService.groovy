package au.org.emii.portal

class DownloadAuthService {

    static transactional = true

    static final DOWNLOAD_AUTH_TAG = 'downloadAuth'

    def grailsApplication
    def simpleCaptchaService

    def ipAddressAccountingMap = [:]

    def verifyChallengeResponse(ipAddress, session, response) {

        if (needsChallenge(ipAddress, session)) {
            if (simpleCaptchaService.validateCaptcha(response)) {
                // Tag this session as one which doesn't need authentication anymore
                session[DOWNLOAD_AUTH_TAG] = true
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

        def needsChallenge = true

        if (isAbusingUs(ipAddress)) {
            log.info "Seems like $ipAddress might be trying to abuse us..."
            session[DOWNLOAD_AUTH_TAG] = false
        }

        if (session[DOWNLOAD_AUTH_TAG]) {
            log.info "$ipAddress already proved to be human"
            return false
        }

        grailsApplication.config.trustedClients.each {
            if (ipAddress.matches(it)) {
                needsChallenge = false
                log.info "Allowing $ipAddress to download without challenge"
            }
        }

        return needsChallenge
    }

    def resetChallenge(session) {
        session[simpleCaptchaService.CAPTCHA_IMAGE_ATTR] = null;
    }

    def isAbusingUs(ipAddress) {
        if (ipAddressAccountingMap[ipAddress]
            && ipAddressAccountingMap[ipAddress].size() >= grailsApplication.config.maxAggregatedDownloadsInTenMinutes) {
            return true
        }
        else {
            return false
        }
    }

    def registerDownloadForAddress(ipAddress, comment) {
        cleanIpAddressAccountingMap()

        if (!ipAddressAccountingMap[ipAddress]) {
            ipAddressAccountingMap[ipAddress] = new TimedEvictingQueue<String>()
        }
        ipAddressAccountingMap[ipAddress].add(comment)
    }

    def cleanIpAddressAccountingMap() {
        // Must run this or otherwise ipAddressAccountingMap can become inifinitely big
        ipAddressAccountingMap.entrySet().removeAll { it -> 0 == it.value.size() }
    }

}
