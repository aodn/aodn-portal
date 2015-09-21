package au.org.emii.portal

import grails.test.*

class GogoduckServiceTests extends GrailsUnitTestCase {

    GogoduckService service

    @Override
    void setUp() {
        super.setUp()

        service = new GogoduckService()
        service.grailsApplication = [config: [gogoduck: [url: 'GOGODUCK_URL']]]
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

    void testGetJobParameters() {
        boolean called = false
        service.metaClass._roundUpEndTime = {
            called = true
        }

        service._getJobParameters([ jobParameters: '{}'])

        assertTrue called
    }

    void testRoundUpEndTime() {
        def jobParams = [
            'subsetDescriptor': [
                'temporalExtent': [
                    'start': '2009-01-01T00:00:00.000Z',
                    'end': '2009-12-25T23:04:36.923Z'
                ]
            ]
        ]

        service._roundUpEndTime(jobParams)

        assertEquals "2009-12-25T23:04:36.923999Z", jobParams.subsetDescriptor.temporalExtent.end
        // Unchanged.
        assertEquals "2009-01-01T00:00:00.000Z", jobParams.subsetDescriptor.temporalExtent.start
    }
}
