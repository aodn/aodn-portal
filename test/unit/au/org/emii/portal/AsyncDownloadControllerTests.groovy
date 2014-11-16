package au.org.emii.portal

import grails.test.*

class AsyncDownloadControllerTests extends ControllerUnitTestCase {

    def downloadAuthService
    def gogoduckService

    protected void setUp() {
        super.setUp()

        downloadAuthService = mockFor(DownloadAuthService)
        downloadAuthService.demand.static.verifyChallengeResponse { params, ipAddress -> return true }
        downloadAuthService.demand.static.registerDownloadForAddress { ipAddress, comment -> return }

        controller.downloadAuthService = downloadAuthService.createMock()

        gogoduckService = mockFor(GogoduckService)
        gogoduckService.demand.static.registerJob { params -> return "gogoduck_rendered_text" }
        controller.gogoduckService = gogoduckService.createMock()
    }

    protected void tearDown() {
        super.tearDown()
    }

    void testRegisterJobBadChallengeResponse() {

        def testParams = new Object()

        controller.downloadAuthService.metaClass.verifyChallengeResponse = {
            ipAddress, challengeResponse ->

            return false
        }

        controller.index()

        assertEquals 500, controller.renderArgs.status
    }

    void testParametersPassedToAggregatorService() {
        def createJobCalledTimes = 0

        controller.params.aggregatorService ='gogoduck'
        controller.params.a = "b"
        controller.params.c = "d"

        // Note that the 'aggregatorService' will be stripped off
        def mockParams = [a: 'b', c: 'd']

        controller.gogoduckService.metaClass.registerJob {
            params ->

            createJobCalledTimes++
            assertEquals mockParams, params

            return "gogoduck_rendered_text"
        }

        controller.index()

        assertEquals 1, createJobCalledTimes
        assertEquals "gogoduck: gogoduck_rendered_text", mockResponse.contentAsString
    }

    void testGogoduckJobSuccess() {
        controller.params.aggregatorService ='gogoduck'

        controller.index()

        assertEquals "gogoduck: gogoduck_rendered_text", mockResponse.contentAsString
    }

    void testGogoduckJobFailure() {
        controller.params.aggregatorService ='gogoduck'
        controller.gogoduckService.metaClass.registerJob { params -> throw new Exception("should not be called") }

        controller.index()

        assertEquals 500, controller.renderArgs.status
    }

    void testNoSuchAggregator() {
        controller.params.aggregatorService ='noSuchAggregator'

        controller.index()

        assertEquals 500, controller.renderArgs.status
    }

}
