package au.org.emii.portal

import grails.test.*
import org.codehaus.groovy.grails.plugins.testing.GrailsMockHttpSession

class DownloadAuthServiceTests extends GrailsUnitTestCase {

    DownloadAuthService service

    class StubForSimpleCaptchaService {
        boolean validateCaptcha(captchaResponse) {
            return "correct" == captchaResponse
        }
    }

    protected void setUp() {
        super.setUp()

        mockLogging DownloadAuthService

        service = new DownloadAuthService()
        service.grailsApplication = [config: [downloadAuth: [trustedClients: [], maxAggregatedDownloadsInPeriod: 2, maxAggregatedDownloadsPeriodMinutes: 10]]]

        service.simpleCaptchaService = new StubForSimpleCaptchaService()
    }

    protected void tearDown() {
        super.tearDown()
    }

    void testVerifyCorrectCaptchaAndNeedChallenge() {
        service.metaClass.needsChallenge = { ipAddress -> return true }
        def challengeVerification = service.verifyChallengeResponse("12.12.12.12", "correct")

        assertTrue challengeVerification
    }

    void testVerifyWrongCaptchaAndNeedChallenge() {
        service.metaClass.needsChallenge = { ipAddress -> return true }
        def challengeVerification = service.verifyChallengeResponse("12.12.12.12", "wrong")

        assertFalse challengeVerification
    }

    void testVerifyAnyCaptchaWhenDoesntNeedChallenge() {
        service.metaClass.needsChallenge = { ipAddress -> return false }
        def challengeVerification = service.verifyChallengeResponse("12.12.12.12", "wrong")

        assertTrue challengeVerification
    }

    void testDoesNotChallengeIfTrusted() {
        service.grailsApplication.config.downloadAuth.trustedClients = [ "4.3.2.1" ]
        boolean needsChallenge = service.needsChallenge("4.3.2.1")

        assertFalse needsChallenge
    }

    void testDoesNotChallengeNewClientsWhoDidntAbuse() {
        boolean needsChallenge = service.needsChallenge("4.3.2.1")

        assertFalse needsChallenge
    }

    void testFirstDownload() {
        service.grailsApplication.config.downloadAuth.maxAggregatedDownloadsInPeriod = 1
        boolean needsChallenge = service.needsChallenge("1.1.1.1")

        assertFalse needsChallenge
    }

    void testBeingAbusedFromTrustedClient() {
        service.grailsApplication.config.downloadAuth.maxAggregatedDownloadsInPeriod = 1
        service.grailsApplication.config.downloadAuth.trustedClients = [ "4.3.2.1" ]

        service.registerDownloadForAddress("4.3.2.1", "test1")
        service.registerDownloadForAddress("4.3.2.1", "test2")

        boolean needsChallenge = service.needsChallenge("4.3.2.1")

        assertFalse needsChallenge
    }

    void testNotBeingAbusedButThenBeingAbused() {
        // First attempt - no need for challenge
        boolean needsChallenge = service.needsChallenge("1.1.1.1")
        assertFalse needsChallenge

        // Register 2 downloads
        service.registerDownloadForAddress("1.1.1.1", "test1")
        service.registerDownloadForAddress("1.1.1.1", "test2")

        // On the 3rd, we expect to display a challenge
        needsChallenge = service.needsChallenge("1.1.1.1")

        // Has accounting for IP in the map
        assertEquals 1, service.ipAddressAccountingMap.size()

        // Forces a Challenge
        assertTrue needsChallenge
    }

    void testClearIpAccountingMap() {
        service.ipAddressAccountingMap["1.1.1.1"] = new TimedEvictingQueue<String>()
        service.ipAddressAccountingMap["1.1.1.2"] = new TimedEvictingQueue<String>()
        service.ipAddressAccountingMap["1.1.1.3"] = new TimedEvictingQueue<String>()
        service.ipAddressAccountingMap["1.1.1.4"] = new TimedEvictingQueue<String>()
        service.ipAddressAccountingMap["1.1.1.5"] = new TimedEvictingQueue<String>()

        assertEquals 5, service.ipAddressAccountingMap.size()

        // This should trigger the IP accounting map cleanup, indirectly we test
        // that registerDownloadForAddress calld cleanIpAddressAccountingMap
        service.registerDownloadForAddress("1.1.1.2", "test2")
        service.registerDownloadForAddress("1.1.1.4", "test4")
        service.registerDownloadForAddress("1.1.1.5", "test5")

        assertEquals 3, service.ipAddressAccountingMap.size()
    }
}
