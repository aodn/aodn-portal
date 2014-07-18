package au.org.emii.portal

class DownloadAuthService {

    static transactional = true

    def grailsApplication
    def simpleCaptchaService

    def ipAddressAccountingMap = [:]

    def verifyChallengeResponse(ipAddress, session, response) {

        if (needsChallenge(ipAddress, session)) {
            if (simpleCaptchaService.validateCaptcha(response)) {
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

        def needsChallenge = false

        if (isAbusingUs(ipAddress)) {
            log.info "Seems like $ipAddress might be trying to abuse us..."
            needsChallenge = true
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
