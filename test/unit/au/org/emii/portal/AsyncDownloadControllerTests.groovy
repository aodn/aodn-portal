package au.org.emii.portal

import static au.org.emii.portal.HttpUtils.Status.*
import grails.test.mixin.TestFor

@TestFor(AsyncDownloadController)
class AsyncDownloadControllerTests {

    def downloadAuthService
    def gogoduckService
    def wpsAwsService
    def wpsService

    void setUp() {
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

        assertEquals HTTP_500_INTERNAL_SERVER_ERROR, response.status
    }

    void testParametersPassedToAggregatorService() {
        def createJobCalledTimes = 0

        controller.params.aggregatorService ='gogoduck'
        controller.params.a = "b"
        controller.params.c = "d"
        controller.params.put("X-Forwarded-For", "127.0.0.1")

        // Note that the 'aggregatorService' will be stripped off
        def mockParams = [server: 'allowed', a: 'b', c: 'd', "X-Forwarded-For" : '127.0.0.1']

        controller.gogoduckService.metaClass.registerJob {
            params ->

            createJobCalledTimes++
            assertEquals mockParams, params

            return "gogoduck_rendered_text"
        }

        controller.index()

        assertEquals 1, createJobCalledTimes
        assertEquals "gogoduck_rendered_text", response.contentAsString
    }

    void testGogoduckJobSuccess() {
        controller.params.aggregatorService ='gogoduck'

        controller.index()

        assertEquals "gogoduck_rendered_text", response.contentAsString
    }

    void testGogoduckJobFailure() {
        controller.params.aggregatorService ='gogoduck'
        controller.gogoduckService.metaClass.registerJob { params -> throw new Exception("should not be called") }

        controller.index()

        assertEquals HTTP_500_INTERNAL_SERVER_ERROR, response.status
    }

    void testServerNotAllowed() {
        controller.params.server = 'not allowed'

        controller.index()

        assertEquals HTTP_403_FORBIDDEN, response.status
    }

    void testNoSuchAggregator() {
        controller.params.aggregatorService ='noSuchAggregator'

        controller.index()

        assertEquals HTTP_500_INTERNAL_SERVER_ERROR, response.status
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

    }
}
