package au.org.emii.portal

import grails.test.ControllerUnitTestCase
import grails.test.mixin.TestFor

@TestFor(DownloadAuthController)
class DownloadAuthControllerTests {
    def downloadAuthService

    void setUp() {
        DownloadAuthService.metaClass.resetChallenge = {}
        downloadAuthService = new DownloadAuthService()
        downloadAuthService.metaClass.needsChallenge = { ipAddress -> return true }
        downloadAuthService.metaClass.getEvictionPeriodMilliseconds = { return 60 * 10 * 1000 } // 10 minutes, as default

        controller.downloadAuthService = downloadAuthService
    }

    void tearDown() {
    }

    void testRenderChallengeViewIfUserNotAuthenticated() {
        controller.index()
        def response = controller.response.contentAsString

        assertEquals "/downloadAuth/challenge", view.toString()
    }

    void testRenderEmptyHtmlIfUserAuthenticated() {
        downloadAuthService.metaClass.needsChallenge = { ipAddress, session -> return false }

        controller.index()
        def response = controller.response.contentAsString

        assertEquals "", response
    }

    void testChallengeCaptchaReset() {
        boolean resetCalled = false

        downloadAuthService.metaClass.resetChallenge = {
            session ->

            resetCalled = true
        }

        controller.index()

        assertTrue resetCalled
    }
}
