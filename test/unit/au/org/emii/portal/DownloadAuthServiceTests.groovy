package au.org.emii.portal

import grails.test.*
import org.codehaus.groovy.grails.plugins.testing.GrailsMockHttpSession

class DownloadAuthServiceTests extends GrailsUnitTestCase {

    DownloadAuthService service
    GrailsMockHttpSession session

    class StubForSimpleCaptchaService {
        boolean validateCaptcha(captchaResponse) {
            return "correct" == captchaResponse
        }
    }

    protected void setUp() {
        super.setUp()

        mockLogging DownloadAuthService

        service = new DownloadAuthService()
        service.grailsApplication = [config: [trustClients: []]]

        service.simpleCaptchaService = new StubForSimpleCaptchaService()

        session = new GrailsMockHttpSession()
    }

    protected void tearDown() {
        super.tearDown()
    }

    void testVerifyCorrectCaptchaAndSetSessionAuthTag() {
        def challengeVerification = service.verifyChallengeResponse("12.12.12.12", session, "correct")

        assertTrue challengeVerification
        assertTrue session[DownloadAuthService.DOWNLOAD_AUTH_TAG]
    }

    void testVerifyWrongCaptchaAndSetSessionAuthTag() {
        def challengeVerification = service.verifyChallengeResponse("12.12.12.12", session, "wrong")

        assertFalse challengeVerification
    }

    void testNeverVerifyAlwaysAllowForAllowedUsers() {
        session[DownloadAuthService.DOWNLOAD_AUTH_TAG] = true

        def challengeVerification = service.verifyChallengeResponse("12.12.12.12", session, "captcha response")

        assertTrue challengeVerification
    }

    void testDoesNotChallengeIfTrusted() {
        service.grailsApplication = [config: [trustedClients: [ "4.3.2.1" ]]]
        boolean needsChallenge = service.needsChallenge("4.3.2.1", session)

        assertFalse needsChallenge
    }

    void testChallengeUserIfNotChallenged() {
        boolean needsChallenge = service.needsChallenge("4.3.2.1", session)

        assertTrue needsChallenge
    }

    void testDoesNotChallengeAlreadyChallengedClients() {
        session[DownloadAuthService.DOWNLOAD_AUTH_TAG] = true
        boolean needsChallenge = service.needsChallenge("4.3.2.1", session)

        assertFalse needsChallenge
    }

    void testBeingAbused() {
        service.grailsApplication = [config: [maxAggregatedDownloadsInTenMinutes: 1]]
        boolean needsChallenge = service.needsChallenge("1.1.1.1", session)

        assertTrue needsChallenge
    }

    void testBeingAbusedFromTrustedClient() {
        service.grailsApplication = [config: [trustedClients: [ "4.3.2.1" ], maxAggregatedDownloadsInTenMinutes: 1]]
        boolean needsChallenge = service.needsChallenge("4.3.2.1", session)

        assertFalse needsChallenge
    }

    void testBeingAbusedFromAlreadyChallengedClient() {
        session[DownloadAuthService.DOWNLOAD_AUTH_TAG] = true
        service.grailsApplication = [config: [maxAggregatedDownloadsInTenMinutes: 2]]

        // Register 2 downloads
        service.registerDownloadForAddress("1.1.1.1", "test1")
        service.registerDownloadForAddress("1.1.1.1", "test2")

        // On the 3rd, we expect to display a challenge
        boolean needsChallenge = service.needsChallenge("1.1.1.1", session)

        // Has accounting for IP in the map
        assertEquals 1, service.ipAddressAccountingMap.size()

        // Removes session tag
        assertFalse session[DownloadAuthService.DOWNLOAD_AUTH_TAG]

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
