package au.org.emii.portal

import grails.test.*

class AsyncDownloadServiceTests extends GrailsUnitTestCase {

    AsyncDownloadService service

    void testRegisterJob() {

        def requestCalled = false
        service = new AsyncDownloadService() {
            def getBody(params) {}
            def getConnection(params) {
                [
                    request: { method, handler ->
                        requestCalled = true
                    }
                ]
            }
        }

        service.registerJob()

        assertTrue requestCalled
    }

    void testGetJobParametersEmptyParams() {
        service = new AsyncDownloadService() {
            def getBody(params) {}
            def getConnection(params) {}
        }

        def testParams = [jobParameters: ""]

        // Verify an exception is thrown when empty params passed
        try {
            service.getJobParameters(testParams)
            fail()
        }
        catch (Exception e) {
        }
    }
}
