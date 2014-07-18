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

}
