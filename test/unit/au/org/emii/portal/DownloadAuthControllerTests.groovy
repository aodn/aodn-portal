package au.org.emii.portal

import grails.test.*

class DownloadAuthControllerTests extends ControllerUnitTestCase {
    def downloadAuthService

    protected void setUp() {
        super.setUp()

        DownloadAuthService.metaClass.resetChallenge = {}
        downloadAuthService = new DownloadAuthService()
        downloadAuthService.metaClass.needsChallenge = { ipAddress -> return true }
        downloadAuthService.metaClass.getEvictionPeriodMilliseconds = { return 60 * 10 * 1000 } // 10 minutes, as default

        controller.downloadAuthService = downloadAuthService
    }

    protected void tearDown() {
        super.tearDown()
    }

    void testRenderChallengeViewIfUserNotAuthenticated() {
        controller.index()
        def response = controller.response.contentAsString

        assertEquals "challenge", controller.renderArgs.view
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
