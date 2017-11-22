package au.org.emii.portal

import grails.test.*

import static au.org.emii.portal.HttpUtils.Status.*

class AsyncDownloadControllerTests extends ControllerUnitTestCase {

    def downloadAuthService
    def gogoduckService
    def wpsAwsService
    def wpsService

    protected void setUp() {
        super.setUp()

        downloadAuthService = mockFor(DownloadAuthService)
        downloadAuthService.demand.static.verifyChallengeResponse { params, ipAddress -> return true }
        downloadAuthService.demand.static.registerDownloadForAddress { ipAddress, comment -> return }

        controller.downloadAuthService = downloadAuthService.createMock()

        gogoduckService = mockFor(GogoduckService)
        gogoduckService.demand.registerJob { params -> return "gogoduck_rendered_text" }
        controller.gogoduckService = gogoduckService.createMock()

        wpsService = mockFor(WpsService)
        wpsService.demand.registerJob { params -> return "wps_rendered_text" }
        controller.wpsService = wpsService.createMock()

        wpsAwsService = mockFor(WpsAwsService)
        wpsAwsService.demand.registerJob { params -> return "wps_rendered_text" }
        controller.wpsAwsService = wpsAwsService.createMock()

        def verifier = new HostVerifier()
        verifier.metaClass.allowedHost {address -> address == 'allowed'}
        controller.hostVerifier = verifier

        controller.params.server = 'allowed'
    }

    void testRegisterJobBadChallengeResponse() {
        controller.downloadAuthService.metaClass.verifyChallengeResponse = {
            ipAddress, challengeResponse ->

            return false
        }

        controller.index()

        assertEquals HTTP_500_INTERNAL_SERVER_ERROR, controller.renderArgs.status
    }

    void testParametersPassedToAggregatorService() {
        def createJobCalledTimes = 0

        controller.params.aggregatorService ='gogoduck'
        controller.params.a = "b"
        controller.params.c = "d"

        // Note that the 'aggregatorService' will be stripped off
        def mockParams = [server: 'allowed', a: 'b', c: 'd']

        controller.gogoduckService.metaClass.registerJob {
            params ->

            createJobCalledTimes++
            assertEquals mockParams, params

            return "gogoduck_rendered_text"
        }

        controller.index()

        assertEquals 1, createJobCalledTimes
        assertEquals "gogoduck_rendered_text", mockResponse.contentAsString
    }

    void testGogoduckJobSuccess() {
        controller.params.aggregatorService ='gogoduck'

        controller.index()

        assertEquals "gogoduck_rendered_text", mockResponse.contentAsString
    }

    void testGogoduckJobFailure() {
        controller.params.aggregatorService ='gogoduck'
        controller.gogoduckService.metaClass.registerJob { params -> throw new Exception("should not be called") }

        controller.index()

        assertEquals HTTP_500_INTERNAL_SERVER_ERROR, controller.renderArgs.status
    }

    void testServerNotAllowed() {
        controller.params.server = 'not allowed'

        controller.index()

        assertEquals HTTP_403_FORBIDDEN, controller.renderArgs.status
    }

    void testNoSuchAggregator() {
        controller.params.aggregatorService ='noSuchAggregator'

        controller.index()

        assertEquals HTTP_500_INTERNAL_SERVER_ERROR, controller.renderArgs.status
    }

    void testGetAggregatorService() {

        // testing for Gogoduck aggregations from a Geoserver
        controller.params.jobType = 'GoGoDuck'
        controller.params.server = "http://containsthestring.geoserver.com"
        assertEquals controller.gogoduckService, controller.getAggregatorService('gogoduck', controller.params)
        assertEquals controller.wpsService, controller.getAggregatorService('wps', controller.params)

        // testing for Gogoduck aggregations not from Geoserver - hopefully AWS batch
        controller.params.jobType = 'GoGoDuck'
        controller.params.server = "http://awsurlhopefully.com"
        assertEquals controller.gogoduckService, controller.getAggregatorService('gogoduck', controller.params)
        assertEquals controller.wpsAwsService, controller.getAggregatorService('wps', controller.params)

        // test when were using Portal.cart.NetcdfSubsetServiceDownloadHandler
        controller.params.jobType = 'NetcdfOutput'
        controller.params.server = "http://containsthestring.geoserver.com"
        assertEquals controller.gogoduckService, controller.getAggregatorService('gogoduck', controller.params)
        assertEquals controller.wpsService, controller.getAggregatorService('wps', controller.params)



    }
}
