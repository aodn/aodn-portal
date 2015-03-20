package au.org.emii.portal

import grails.test.*

class GogoduckServiceTests extends GrailsUnitTestCase {

    GogoduckService service

    @Override
    void setUp() {

        super.setUp();

        service = new GogoduckService()
        service.grailsApplication = [config: [gogoduck: [url: 'GOGODUCK_URL']]]
    }

    void testRegisterJob() {

        def postCallCount = 0
        def roundUpEndTimeCount = 0

        def testParams = [jobParameters: "{gogoduck_json}"]
        def testSuccessHandler = new Object()
        def testConnection = [
            post: { params, successHandler ->

                postCallCount++
                assertEquals "{gogoduck_json}", params.body
                assertEquals testSuccessHandler, successHandler
            }
        ]

        service.metaClass._gogoduckConnection = { -> testConnection }
        service.metaClass._roundUpEndTime = {
            params ->
            roundUpEndTimeCount++

            params
        }

        service.successHandler = testSuccessHandler

        service.registerJob(testParams)

        assertEquals 1, postCallCount
        assertEquals 1, roundUpEndTimeCount
    }

    void testRegisterJobEmptyParams() {

        def testParams = [jobParameters: ""]

        // Verify an exception is thrown when empty params passed
        try {
            service.registerJob(testParams)
            fail()
        }
        catch (Exception e) {
        }
    }

    void testGogoduckConnection() {

        def connection = service._gogoduckConnection()

        assertNotNull connection
        assertEquals 'GOGODUCK_URL/job/', connection.uri.toString()
    }

    void testSuccessHandler() {

        assertNotNull service.successHandler
    }

    void testRoundUpEndTime() {
        def jobParams = '''{"layerName":"cars_australia_weekly","emailAddress":"jkburges@gmail.com","geoserver":"http://gogoduck.aodn.org.au/gogoduck","subsetDescriptor":{"temporalExtent":{"start":"2009-01-01T00:00:00.000Z","end":"2009-12-25T23:04:36.923Z"},"spatialExtent":{"north":90,"south":-90,"east":180,"west":-180}}}'''

        def alteredJobParams = service._roundUpEndTime(jobParams)

        assertTrue alteredJobParams.contains("2009-12-25T23:04:36.923999Z")

        // Unchanged.
        assertTrue alteredJobParams.contains("2009-01-01T00:00:00.000Z")
    }
}
