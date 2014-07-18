/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.test.*

class GogoduckControllerTests extends ControllerUnitTestCase {

    def downloadAuthService

    protected void setUp() {

        super.setUp()

        downloadAuthService = mockFor(DownloadAuthService)
        downloadAuthService.demand.static.verifyChallengeResponse {}

        controller.downloadAuthService = downloadAuthService.createMock()
    }

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

    void testRegisterJobBadChallengeResponse() {

        def testParams = new Object()
        mockParams.put 'jobParameters', testParams

        controller.gogoduckService = [
            registerJob: { params ->
                assertEquals testParams, params
            }
        ]

        controller.downloadAuthService.metaClass.verifyChallengeResponse = {
            ipAddress, session, challengeResponse ->

            return false
        }

        controller.registerJob()

        assertEquals 500, controller.renderArgs.status
    }
}
