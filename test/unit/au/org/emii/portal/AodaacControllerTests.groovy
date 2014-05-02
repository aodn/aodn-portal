
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.test.ControllerUnitTestCase

class AodaacControllerTests extends ControllerUnitTestCase {

    protected void setUp() {

        super.setUp()

        mockDomain AodaacJob
    }

    protected void tearDown() {
        super.tearDown()

        AodaacJob.metaClass = null
        AodaacProductLink.metaClass = null
        Layer.metaClass = null
    }

    void testCreateJob() {

        def createJobCalledTimes = 0

        def jobCreated = [jobId: 1]

        mockParams.a = "b"
        mockParams.notificationEmailAddress = "email"

        controller.aodaacAggregatorService = [
            createJob: { params ->

                createJobCalledTimes++
                assertEquals mockParams, params

                return jobCreated
            }
        ]

        controller.createJob()

        assertEquals 1, createJobCalledTimes
        assertEquals "Job created (ID: 1)", mockResponse.contentAsString
    }
}
