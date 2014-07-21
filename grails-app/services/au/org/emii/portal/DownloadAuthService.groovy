package au.org.emii.portal

class DownloadAuthService {

    static transactional = true

    def grailsApplication
    def simpleCaptchaService

    def ipAddressAccountingMap = [:]

    def getEvictionPeriodMilliseconds() {
        return grailsApplication.config.downloadAuth.maxAggregatedDownloadsPeriodMs
    }

    def verifyChallengeResponse(ipAddress, response) {

        if (needsChallenge(ipAddress)) {
            return simpleCaptchaService.validateCaptcha(response)
        }
        else {
            return true
        }
    }

    def needsChallenge(ipAddress) {

        def needsChallenge = false

        if (isAbusingUs(ipAddress)) {
            // downloadCount is the amount of already requested download + 1
            // which is the download the user has just requested
            def downloadCount         = downloadCountForIpAddress(ipAddress) + 1
            def downloadPeriodMinutes = getEvictionPeriodMilliseconds() / 1000 / 60
            log.info "Seems like $ipAddress might be trying to abuse us, '$downloadCount' downloads in '$downloadPeriodMinutes' minutes"
            needsChallenge = true
        }

        grailsApplication.config.downloadAuth.trustedClients.each {
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

    def downloadCountForIpAddress(ipAddress) {

        def downloadCount = 0

        if (ipAddressAccountingMap[ipAddress]) {
            downloadCount = ipAddressAccountingMap[ipAddress].size()
        }
    }

    def isAbusingUs(ipAddress) {
        return downloadCountForIpAddress(ipAddress) >= grailsApplication.config.downloadAuth.maxAggregatedDownloadsInPeriod
    }

    def registerDownloadForAddress(ipAddress, comment) {
        cleanIpAddressAccountingMap()

        if (!ipAddressAccountingMap[ipAddress]) {
            ipAddressAccountingMap[ipAddress] =
                new TimedEvictingQueue<String>(
                    [backlogIntervalMilli: getEvictionPeriodMilliseconds()]
                )
        }
        ipAddressAccountingMap[ipAddress].add(comment)
    }

    def cleanIpAddressAccountingMap() {
        // Must run this or otherwise ipAddressAccountingMap can become inifinitely big
        ipAddressAccountingMap.entrySet().removeAll { it -> 0 == it.value.size() }
    }

}
