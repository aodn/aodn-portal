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

        def testParams = "{gogoduck_json}"
        def testSuccessHandler = new Object()
        def testConnection = [
            post: { params, successHandler ->

                postCallCount++
                assertEquals testParams, params.body
                assertEquals testSuccessHandler, successHandler
            }
        ]

        service.metaClass._gogoduckConnection = { -> testConnection }
        service.successHandler = testSuccessHandler

        service.registerJob(testParams)

        assertEquals 1, postCallCount
    }

    void testGogoduckConnection() {

        def connection = service._gogoduckConnection()

        assertNotNull connection
        assertEquals 'GOGODUCK_URL/job/', connection.uri.toString()
    }

    void testSuccessHandler() {

        assertNotNull service.successHandler
    }
}
