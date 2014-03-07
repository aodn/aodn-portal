package aodn.portal

import grails.test.*

class GogoduckControllerTests extends ControllerUnitTestCase {

    void testRegisterJobNoParams() {

        controller.gogoduckService = [
            registerJob: {
                fail "registerJob() should not be called"
            }
        ]

        controller.registerJob()

        assertTrue mockResponse.contentAsString.length() > 0
        assertEquals 400, controller.renderArgs.status
    }

    void testRegisterJobWithException() {

        def testParams = new Object()
        mockParams.put 'jobParameters', testParams

        controller.gogoduckService = [
            registerJob: { throw new Exception("Something went wrong") }
        ]

        controller.registerJob()

        assertTrue mockResponse.contentAsString.length() > 0
        assertEquals 500, controller.renderArgs.status
    }

    void testRegisterJobNoProblems() {

        def testParams = new Object()
        mockParams.put 'jobParameters', testParams

        def registerCalledCount = 0
        controller.gogoduckService = [
            registerJob: { params ->

                registerCalledCount++
                assertEquals testParams, params
            }
        ]

        controller.registerJob()

        assertEquals 1, registerCalledCount
        assertTrue mockResponse.contentAsString.length() > 0
    }
}
