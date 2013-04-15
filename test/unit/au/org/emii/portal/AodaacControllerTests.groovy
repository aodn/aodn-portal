
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

    void testProductInfo_PassingProductIds() {

        mockDomain AodaacProductLink

        controller.aodaacAggregatorService = [
                getProductInfo: {
                    ids ->

                    assertEquals( ["1", "2"], ids )

                    return [theResult: "yo"]
                }
        ]

        // Set up the call
        mockParams.productIds = "1,2"

        controller.productInfo()

        assertEquals """{"theResult":"yo"}""", mockResponse.contentAsString
    }

    void testProductInfo_PassingLayerId() {

        mockDomain AodaacProductLink
        mockDomain Layer

        def testLayer = [layerId: 2, name: "layerName", server: "layerServer"]

        Layer.metaClass.static.get = {
            id ->

            assertEquals 2, id

            return testLayer
        }

        controller.aodaacAggregatorService = [
                getProductInfo: {
                    ids ->

                    assertEquals( [5, 6], ids )

                    return [theResult: "yo"]
                }
        ]

        AodaacProductLink.metaClass.static.findAllByLayerNameIlikeAndServer = {
            name, server ->

            assertEquals "layerName", name
            assertEquals "layerServer", server

            return [[productId: 5], [productId: 5], [productId: 6]]
        }

        // Set up the call
        mockParams.layerId = "2"

        controller.productInfo()

        assertEquals """{"theResult":"yo"}""", mockResponse.contentAsString
    }

    void testProductInfo_PassingNoParam() {

        controller.productInfo()

        assertEquals "[]", mockResponse.contentAsString
    }

    void testCreateJob() {

        def createJobCalledTimes = 0

        def jobCreated = [jobId: 1]

        mockParams.a = "b"
        mockParams.notificationEmailAddress = "email"

        controller.aodaacAggregatorService = [
                createJob: {
                    email, params ->

                    createJobCalledTimes++
                    assertEquals "email", email
                    assertEquals mockParams, params

                    return jobCreated
                }
        ]

        assertEquals( [], controller._getJobIdList() )

        controller.createJob()

        assertEquals 1, createJobCalledTimes
        assertEquals( [1], controller._getJobIdList() )
        assertEquals "Job created (ID: 1)", mockResponse.contentAsString
    }

    void testUpdateJob() {

        def updateJobCalledTimes = 0
        def findByJobIdCalledTimes = 0

        def jobId = 99
        def jobOfInterest = [jobId: jobId]

        mockParams.id = jobId

        AodaacJob.metaClass.static.findByJobId = {
            id ->

            findByJobIdCalledTimes++
            assertEquals jobId, id
            return jobOfInterest
        }

        controller.aodaacAggregatorService = [
                updateJob: {
                    job ->

                    updateJobCalledTimes++
                    assertEquals job, jobOfInterest
                }
        ]

        controller.updateJob()

        assertEquals 1, updateJobCalledTimes
        assertEquals 1, findByJobIdCalledTimes
        assertEquals "Job updated (ID: $jobId)", mockResponse.contentAsString
    }

    void testCancelJob() {

        def cancelJobCalledTimes = 0
        def findByJobIdCalledTimes = 0

        def jobId = 66
        def jobOfInterest = [jobId: jobId]

        mockParams.id = jobId

        AodaacJob.metaClass.static.findByJobId = {
            id ->

            findByJobIdCalledTimes++
            assertEquals jobId, id
            return jobOfInterest
        }

        controller.aodaacAggregatorService = [
                cancelJob: {
                    job ->

                    cancelJobCalledTimes++
                    assertEquals job, jobOfInterest
                }
        ]

        // Test jobListIds before removal
        controller._addToList jobOfInterest
        assertEquals( [jobId], controller._getJobIdList() )

        controller.cancelJob()

        assertEquals 1, cancelJobCalledTimes
        assertEquals 1, findByJobIdCalledTimes
        assertEquals "Job cancelled (ID: $jobId)", mockResponse.contentAsString

        assertEquals( [], controller._getJobIdList() )
    }

    void testDeleteJob() {

        def deleteJobCalledTimes = 0
        def findByJobIdCalledTimes = 0

        def jobId = 13
        def jobOfInterest = [jobId: jobId]

        mockParams.id = jobId

        AodaacJob.metaClass.static.findByJobId = {
            id ->

            findByJobIdCalledTimes++
            assertEquals jobId, id
            return jobOfInterest
        }

        controller.aodaacAggregatorService = [
                deleteJob: {
                    job ->

                    deleteJobCalledTimes++
                    assertEquals job, jobOfInterest
                }
        ]

        // Test jobListIds before removal
        controller._addToList jobOfInterest
        assertEquals( [jobId], controller._getJobIdList() )

        controller.deleteJob()

        assertEquals 1, deleteJobCalledTimes
        assertEquals 1, findByJobIdCalledTimes
        assertEquals "Job deleted (ID: $jobId)", mockResponse.contentAsString

        assertEquals( [], controller._getJobIdList() )
    }

    void testUserJobInfo_HasJobsInList() {

        def getAllCalledTimes = 0

        def testJob1 = [jobId: 2]
        def testJob2 = [jobId: 4]

        controller._addToList testJob1
        controller._addToList testJob2

        AodaacJob.metaClass.static.getAll = {
            List ids ->

            getAllCalledTimes++
            assertEquals( [2, 4], ids )
            return [testJob1, testJob2]
        }

        controller.userJobInfo()

        assertEquals 1, getAllCalledTimes
        assertEquals '[{"jobId":2},{"jobId":4}]', mockResponse.contentAsString
    }

    void testUserJobInfo_NoJobsInList() {

        AodaacJob.metaClass.static.getAll = {
            List ids ->

            fail "Should not be called"
        }

	    controller.aodaacAggregatorService = [
		    updateJob: {
			    job ->

			    fail "Should not be called"
		    }
	    ]

        controller.userJobInfo()

        assertEquals '[]', mockResponse.contentAsString
    }
}
