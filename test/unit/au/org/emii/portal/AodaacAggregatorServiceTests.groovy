/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import au.org.emii.portal.config.PortalInstance
import au.org.emii.portal.exceptions.AodaacException
import grails.test.GrailsUnitTestCase

class AodaacAggregatorServiceTests extends GrailsUnitTestCase {

    def aodaacAggregatorService

    def productInfoJS = """\

        var datasets = [
          { id: "1", name: "GHRSST subskin 2011 (VPAC)",
            products: [ "1" ]
          },
          { id: "2", name: "L3P GHRSST subskin (from CSIRO server)",
            products: [ "2" ]
          }
         ];
        var productData = [
          { id: "1", name: "GHRSST subskin 2011 (VPAC THREDDS server)", description: "" },
          { id: "2", name: "ABOM Legacy 14-day SST Mosaic", description: "" }
         ];
        productExtents=[
         {
           id : "1" ,
           extents : {
            lat : [ -30.681 , -24.452 ] ,
            lon : [ 148.383 , 159.281 ] ,
            dateTime : [ "01/01/2010 00:00:00" , "06/08/2012 23:59:59" ]
                     }
         } ,
         {
           id : "2" ,
           extents : {
            lat : [ -90 , 90 ] ,
            lon : [ -180 , 180 ] ,
            dateTime : [ "01/01/2011 00:00:00" , "14/01/2011 23:59:59" ]
                     }
         }
        ];
    """

    def _prod1 = [extents: [lat: [min: -30.681 as Double, max: -24.452 as Double], lon: [min: 148.383 as Double, max: 159.281 as Double], dateTime: [min: "01/01/2010", max: "06/08/2012"]], name: "GHRSST subskin 2011 (VPAC THREDDS server)", productId: "1"]
    def _prod2 = [extents: [lat: [min: -90 as Integer, max: 90 as Integer], lon: [min: -180 as Integer, max: 180 as Integer], dateTime: [min: "01/01/2011", max: "14/01/2011"]], name: "ABOM Legacy 14-day SST Mosaic", productId: "2"]
    def productInfoAll = [_prod1, _prod2]
    def productInfoId1 = [_prod1]
    def productInfoId2 = [_prod2]

    def testCreateParams = [
        productId: "66",
        dateRangeStart: "01/01/2011",
        dateRangeEnd: "02/02/2012",
        latitudeRangeStart: "14.0",
        latitudeRangeEnd: "14.7",
        longitudeRangeStart: "110.0",
        longitudeRangeEnd: "120.0",
        timeOfDayRangeStart: "0100",
        timeOfDayRangeEnd: "2355",
        outputFormat: "txt"
    ]
    def expectedCreateModifiedParams = [
        "txt",
        "20110101",
        "20120202",
        "0100",
        "2355",
        "14.0",
        "14.7",
        "110.0",
        "120.0",
        "66"
    ]
    def createJobJsonResponse = """{"jobId":"1234"}"""

    def testJob

    protected void setUp() {

        super.setUp()

        // Test job
        testJob = [
            jobId: "JOB_42",
            notificationEmailAddress: "someEmailAddress",
            latestStatus: null,
            expired: false,
            dateCreated: new Date()
        ] as AodaacJob

        testJob.jobParams = new AodaacJobParams([
            dateRangeStart: new Date(2012, 2, 2),
            dateRangeEnd: new Date(2013, 3, 3),
            environment: "test",
            latitudeRangeStart: 90,
            latitudeRangeEnd: 89,
            longitudeRangeStart: 140,
            longitudeRangeEnd: 141,
            outputFormat: "csv",
            productId: 3,
            server: "theServer"
        ])

        mockDomain AodaacJob, [testJob]
        mockLogging AodaacAggregatorService, false

        // Create service and portal instance and link
        def portalInstance = new PortalInstance()
        aodaacAggregatorService = new AodaacAggregatorService() // Why is this not injected?
        aodaacAggregatorService.portalInstance = portalInstance
        aodaacAggregatorService.grailsApplication = [
            config: [
                portal: [
                    instance: [name: "testInstance"],
                    systemEmail: [fromAddress: "systemEmailAddress"]
                ],
                aodaacAggregator: [
                    idleJobTimeout: 14 // In hours
                ]
            ]
        ]
        portalInstance.grailsApplication = aodaacAggregatorService.grailsApplication

        aodaacAggregatorService.metaClass.getProductDataJavascriptAddress = {
            [toURL: { [text: productInfoJS] }]
        }
    }

    protected void tearDown() {

        super.tearDown()

        aodaacAggregatorService.metaClass = null
        String.metaClass = null
    }

    void testGetProductInfo_OneId() {

        def result

        result = aodaacAggregatorService.getProductInfo([1])

        assertEquals productInfoId1, result
    }

    void testGetProductInfo_ManyIds() {

        def result

        result = aodaacAggregatorService.getProductInfo([1, 2])

        assertEquals productInfoAll, result
    }

    void testGetProductInfo_ManyIdsOneInvalid() {

        def result

        result = aodaacAggregatorService.getProductInfo([2, 4])

        assertEquals productInfoId2, result
    }

    void testProductIdsForLayer() {

        def testLayer = [
            name: "layerName",
            server: "theServer"
        ]

        AodaacProductLink.metaClass.static.findAllByLayerNameIlikeAndServer = { name, server ->

            assertEquals "layerName", name
            assertEquals "theServer", server

            return [[productId: 5], [productId: 5], [productId: 6]]
        }

        def productIds = aodaacAggregatorService.productIdsForLayer(testLayer)

        assertEquals([5, 6], productIds)
    }

    void testCreateJob() {

        // General test job exists
        assertEquals 1, AodaacJob.count()

        def testParams = testCreateParams
        def testEmailAddress = "email"

        aodaacAggregatorService.metaClass._aggregatorCommandAddress = { cmd, args ->

            assertEquals expectedCreateModifiedParams, args

            return [toURL: { [text: createJobJsonResponse] }]
        }

        aodaacAggregatorService.metaClass._aggregatorEnvironment = { "env" }
        aodaacAggregatorService.metaClass._aggregatorBaseAddress = { "url/" }

        aodaacAggregatorService.createJob testEmailAddress, testParams

        assertEquals 2, AodaacJob.count()
    }

    void testCreateJob_ExceptionThrown() {

        def testParams = testCreateParams
        def testEmailAddress = "email"

        aodaacAggregatorService.metaClass._aggregatorCommandAddress = { cmd, args ->

            return [toURL: { throw new Exception("Some Test Exception") }]
        }

        aodaacAggregatorService.metaClass._aggregatorEnvironment = { "env" }
        aodaacAggregatorService.metaClass._aggregatorBaseAddress = { "url/" }

        try {
            aodaacAggregatorService.createJob testEmailAddress, testParams

            fail "Expected Exception"
        }
        catch (AodaacException e) {

            assertEquals "Unable to create new job (response: 'null')", e.message
        }
        catch (Exception e) {

            fail "Expected AodaacException, got ${ e.getClass() }"
        }
    }

    void testUpdateJob_ExceptionThrown() {

        aodaacAggregatorService.metaClass._aggregatorCommandAddress = { cmd, args ->

            return [toURL: { throw new Exception("Some Test Exception") }]
        }

        try {
            aodaacAggregatorService.updateJob([latestStatus: [jobEnded: false]])

            fail "Expected Exception"
        }
        catch (AodaacException e) {

            assertEquals "Unable to update job '[latestStatus:[jobEnded:false]]'", e.message
        }
        catch (Exception e) {

            fail "Expected AodaacException, got ${ e.getClass() }"
        }
    }

    void testUpdateJob_JobEndedAlready() {

        testJob.latestStatus = [jobEnded: true]
        def verifyResultsTimesCalled = 0

        aodaacAggregatorService.metaClass._verifyResultFileExists = { job ->

            verifyResultsTimesCalled++
            assertEquals testJob, job
        }

        aodaacAggregatorService.metaClass._aggregatorCommandAddress = { cmd, args -> fail "Should not be called" }

        aodaacAggregatorService.updateJob testJob

        assertEquals 1, verifyResultsTimesCalled
    }

    void testUpdateJob_JobNotEnded() {

        def timesCalled = [:]
        timesCalled._retrieveResults = 0
        timesCalled._verifyResultFileExists = 0
        timesCalled._sendNotificationEmail = 0
        timesCalled._jobIsTakingTooLong = 0

        // Just count usages of support methods
        aodaacAggregatorService.metaClass._retrieveResults = {

            timesCalled._retrieveResults++
        }
        aodaacAggregatorService.metaClass._verifyResultFileExists = {

            timesCalled._verifyResultFileExists++
        }
        aodaacAggregatorService.metaClass._sendNotificationEmail = {

            timesCalled._sendNotificationEmail++
        }

        aodaacAggregatorService.metaClass._jobIsTakingTooLong = { job ->

            assertEquals testJob, job
            timesCalled._jobIsTakingTooLong++

            return false
        }

        // Mock request/response from server
        aodaacAggregatorService.metaClass._aggregatorCommandAddress = { cmd, args ->

            assertEquals(["JOB_42"], args)

            return [toURL: {
                [
                    text: """\
                    {
                        datafileReady: false,
                        hasErrors: true,
                        jobEnded: false,
                        started: true,
                        urlCount: 3,
                        urlsComplete: 3,
                        errors: "errz",
                        cgiSeq: /var/aodaac/test/log,
                        warnings: /var/aodaac/prod/log
                    }
                    """ // 'warnings' variable used to test second possible replacement
                ]
            }]
        }

        assertEquals 1, AodaacJob.count()

        aodaacAggregatorService.updateJob testJob

        assertEquals 1, AodaacJob.count()
        assertEquals 1, timesCalled._jobIsTakingTooLong
        assertEquals 0, timesCalled._retrieveResults
        assertEquals 0, timesCalled._verifyResultFileExists
        assertEquals 0, timesCalled._sendNotificationEmail
    }

    void testUpdateJob_JobTakenTooLong() {

        testJob.dateCreated = new Date(1900, 1, 1) // Date long ago

        def timesCalled = [:]
        timesCalled._jobHasTakenTooLong = 0
        timesCalled._sendNotificationEmail = 0
        timesCalled._markJobAsExpired = 0

        // Just count usages of support methods
        aodaacAggregatorService.metaClass._retrieveResults = {
            fail "Shouldn't be called"
        }

        aodaacAggregatorService.metaClass._jobIsTakingTooLong = { job ->

            timesCalled._jobHasTakenTooLong++
            assertEquals testJob, job

            return true
        }

        aodaacAggregatorService.metaClass._sendNotificationEmail = { job ->

            timesCalled._sendNotificationEmail++
            assertEquals testJob, job
        }

        aodaacAggregatorService.metaClass._markJobAsExpired = { job ->

            timesCalled._markJobAsExpired++
            assertEquals testJob, job
        }

        // Mock request/response from server
        aodaacAggregatorService.metaClass._aggregatorCommandAddress = { cmd, args ->

            assertEquals(["JOB_42"], args)

            return [toURL: {
                [
                    text: """\
                    {
                        datafileReady: false,
                        hasErrors: false,
                        jobEnded: false,
                        started: true,
                        urlCount: 3,
                        urlsComplete: 1,
                        errors: "",
                        cgiSeq: /var/aodaac/test/log,
                        warnings: ""
                    }
                    """
                ]
            }]
        }

        aodaacAggregatorService.updateJob testJob

        assertEquals 1, timesCalled._jobHasTakenTooLong
        assertEquals 1, timesCalled._sendNotificationEmail
        assertEquals 1, timesCalled._markJobAsExpired
    }

    void testCancelJob() {

        def timesUpdateCalled = 0

        // Mock request/response from server
        aodaacAggregatorService.metaClass._aggregatorCommandAddress = { cmd, args ->

            assertEquals(["JOB_42"], args)

            return [toURL: { [text: "Not actually used"] }]
        }

        aodaacAggregatorService.metaClass.updateJob = { job ->

            timesUpdateCalled++
            assertEquals testJob, job
        }

        aodaacAggregatorService.cancelJob testJob

        assertEquals 1, timesUpdateCalled
    }

    void testCancelJob_ExceptionThrown() {

        aodaacAggregatorService.metaClass._aggregatorCommandAddress = { cmd, args ->

            return [toURL: { throw new Exception("Test Exception") }]
        }

        try {
            aodaacAggregatorService.cancelJob([jobId: 5])

            fail "Expected Exception"
        }
        catch (AodaacException e) {

            assertEquals "Unable to cancel job '[jobId:5]'", e.message
        }
        catch (Exception e) {

            fail "Expected AodaacException, got ${ e.getClass() }"
        }
    }

    void testDeleteJob() {

        def timesCancelCalled = 0

        // Mock request/response from server
        aodaacAggregatorService.metaClass._aggregatorCommandAddress = { cmd, args ->

            assertEquals(["JOB_42"], args)
        }

        aodaacAggregatorService.metaClass.cancelJob = { job ->

            timesCancelCalled++
            assertEquals testJob, job
        }

        aodaacAggregatorService.deleteJob testJob

        assertEquals 1, timesCancelCalled
    }

    void testDeleteJob_ExceptionThrown() {

        aodaacAggregatorService.metaClass._aggregatorCommandAddress = { cmd, args ->

            return [toURL: { throw new Exception("Test Exception") }]
        }

        try {
            aodaacAggregatorService.deleteJob([jobId: 3])

            fail "Expected Exception"
        }
        catch (AodaacException e) {

            assertEquals "Unable to delete job '[jobId:3]'", e.message
        }
        catch (Exception e) {

            fail "Expected AodaacException, got ${ e.getClass() }"
        }
    }

    void testRetrieveResults() {

        aodaacAggregatorService.metaClass._aggregatorCommandAddress = { cmd, args ->

            assertEquals(["JOB_42"], args)

            return [toURL: { [text: " theResponse! "] }]
        }

        aodaacAggregatorService._retrieveResults testJob

        assertEquals "theResponse!", testJob.result.dataUrl
    }

    void testVerifyResultsFileExists() {

        def openConnectionCalledCount = 0
        def connectCalledCount = 0

        testJob.dataFileExists = false
        testJob.result = [dataUrl: "http://www.google.com"]

        def connObject = [
            connect: {-> connectCalledCount++ },
            requestMethod: "NOT HEAD",
            responseCode: 267
        ]

        String.metaClass.toURL = {->

            return [
                openConnection: {->

                    openConnectionCalledCount++
                    return connObject
                }
            ]
        }

        aodaacAggregatorService._verifyResultFileExists testJob

        assertEquals "HEAD", connObject.requestMethod
        assertEquals true, testJob.dataFileExists
        assertNotNull testJob.mostRecentDataFileExistCheck

        assertEquals 1, openConnectionCalledCount
        assertEquals 1, connectCalledCount
    }

    void testVerifyResultsFileExists_ExceptionThrown() {

        testJob.dataFileExists = true
        testJob.result = [dataUrl: "http://www.goofle.com/"]

        String.metaClass.toURL = {-> throw new Exception("Some Test Exception") }

        aodaacAggregatorService._verifyResultFileExists testJob

        assertEquals false, testJob.dataFileExists
    }

    void testSendNotificationEmail() {

        // Set up job
        testJob.jobId = "12345"
        testJob.latestStatus = [jobEnded: true]
        testJob.result = [dataUrl: "dataUrl"]
        testJob.dataFileExists = true

        def timesCalled = [:]
        timesCalled.sendMail = 0
        timesCalled.messageSourceGetMessage = 0
        timesCalled.getEmailReplacements = 0
        timesCalled.getEmailBodyMessageCode = 0

        def argsReturned = []

        aodaacAggregatorService.metaClass._getEmailBodyReplacements = { job ->

            assertEquals testJob, job
            timesCalled.getEmailReplacements++

            return argsReturned
        }

        aodaacAggregatorService.metaClass._getEmailBodyMessageCode = { job ->

            assertEquals testJob, job
            timesCalled.getEmailBodyMessageCode++

            return 'testinstance.aodaacJob.notification.email.testBody'
        }

        aodaacAggregatorService.messageSource = [
            getMessage: { code, args, locale ->

                if (timesCalled.messageSourceGetMessage == 0) {

                    assertEquals "testinstance.aodaacJob.notification.email.testBody", code
                    assertEquals argsReturned, args
                }
                else if (timesCalled.messageSourceGetMessage == 1) {

                    assertEquals "testinstance.aodaacJob.notification.email.subject", code
                    assertEquals(['12345'], args)
                }

                timesCalled.messageSourceGetMessage++
            }
        ]

        aodaacAggregatorService.metaClass.sendMail = { c ->

            timesCalled.sendMail++
        }

        aodaacAggregatorService._sendNotificationEmail testJob

        assertEquals 1, timesCalled.sendMail
        assertEquals 1, timesCalled.getEmailReplacements
        assertEquals 1, timesCalled.getEmailBodyMessageCode
        assertEquals 2, timesCalled.messageSourceGetMessage // Once for subject, once for body
    }

    void testSendNotificationEmail_JobNotEnded() {

        testJob.latestStatus = [jobEnded: false]

        def sendMailCalledCount = 0

        aodaacAggregatorService.metaClass.static.sendMail = { c ->

            sendMailCalledCount++
        }

        aodaacAggregatorService._sendNotificationEmail testJob

        assertEquals 0, sendMailCalledCount
    }

    void testSendNotificationEmail_NoNotificationEmailAddress() {

        testJob.latestStatus = [jobEnded: true]
        testJob.notificationEmailAddress = ""

        def sendMailCalledCount = 0

        aodaacAggregatorService.metaClass.static.sendMail = { c ->

            sendMailCalledCount++
        }

        aodaacAggregatorService._sendNotificationEmail testJob

        assertEquals 0, sendMailCalledCount
    }

    void testJobHasTakenToolong() {

        def adjustedDate = new GregorianCalendar()
        adjustedDate.add(Calendar.HOUR, -14) // 14 hours ago

        testJob.latestStatus = [urlsComplete: 2]

        assertFalse aodaacAggregatorService._jobIsTakingTooLong(testJob) as Boolean // Job is not too old here (it's just been created)

        // Set date as old, but progress has been made
        testJob.dateCreated = adjustedDate.time
        assertFalse aodaacAggregatorService._jobIsTakingTooLong(testJob) as Boolean

        // Old job with no progress made
        testJob.latestStatus.urlsComplete = 0
        assertTrue aodaacAggregatorService._jobIsTakingTooLong(testJob) as Boolean
    }

    void testMarkJobAsExpired() {

        assertFalse testJob.expired as Boolean

        aodaacAggregatorService._markJobAsExpired(testJob)

        assertTrue testJob.expired as Boolean
    }

    void testGetEmailReplacements_SuccessfulJob() {

        // Set up job
        testJob.jobId = "12345"
        testJob.latestStatus = [jobEnded: true]
        testJob.result = [dataUrl: 'dataUrl']
        testJob.dataFileExists = true

        // Set up message source
        aodaacAggregatorService.metaClass._getEmailFooter = { 'FOOTER_CONTENT' }

        def replacements = aodaacAggregatorService._getEmailBodyReplacements(testJob)

        assertEquals(['dataUrl', 'FOOTER_CONTENT'], replacements)
    }

    void testGetEmailReplacements_ExpiredJob() {

        def testDate = new Date(00, 0, 1, 11, 34, 56)

        // Set up job
        testJob.dateCreated = testDate
        testJob.expired = true

        def expectedParamsString = _expectedEmailParamsString(testJob)

        // Set up message source
        aodaacAggregatorService.metaClass._getEmailFooter = {-> 'FOOTER_CONTENT' }

        def replacements = aodaacAggregatorService._getEmailBodyReplacements(testJob)

        assertEquals([testDate.dateTimeString, expectedParamsString, 'FOOTER_CONTENT'], replacements)
    }

    void testGetEmailReplacements_UnsuccessfulJob() {

        // Set an error message
        def expectedErrorMessage = 'The error message'
        testJob.latestStatus = [theErrors: expectedErrorMessage]

        def expectedParamsString = _expectedEmailParamsString(testJob)

        // Set up message source
        aodaacAggregatorService.metaClass._getEmailFooter = { 'FOOTER_CONTENT' }

        def replacements = aodaacAggregatorService._getEmailBodyReplacements(testJob)

        assertEquals([expectedErrorMessage, expectedParamsString, 'FOOTER_CONTENT'], replacements)
    }

    void testPrettifyErrorMessageWithRegexp() {

        _assertPrettify("some error message", "Error is: pretty error")
    }

    void testPrettifyErrorMessageUnmatchedRegexp() {

        def errorMessage = "there's no match for this"
        _assertPrettify(errorMessage, errorMessage)
    }

    void testPrettifyErrorMessageLimitExceeded() {

        def errorMessage = "java.lang.Exception: requested ~ 23986632492 bytes; limit = 1000000000"
        def expectedErrorMessage = "The requested job will have too much data. You have requested roughly 24 times the maximum aggregation size."
        _assertPrettify(errorMessage, expectedErrorMessage)
    }

    void _assertPrettify(originalErrorMessage, expectedPrettifiedErrorMessage) {

        aodaacAggregatorService.grailsApplication = [
            config: [
                aodaacAggregator: [
                    errorLookup: [
                        /some.*message/: { errorMessage -> return expectedPrettifiedErrorMessage },
                        /.*java\.lang\.Exception: requested ~ [0-9]+ bytes; limit = [0-9]+/: { errorMessage ->

                            def numBytes = (errorMessage =~ /[0-9]+/)
                            assert (numBytes.count == 2): "Expecting 2 numerical values in error string: " + errorMessage
                            def actualBytes = Long.valueOf(numBytes[0])
                            def limitBytes = Long.valueOf(numBytes[1])

                            def amountOver = Math.round(actualBytes / limitBytes)

                            return "The requested job will have too much data. You have requested roughly ${amountOver} times the maximum aggregation size."
                        }
                    ]
                ]
            ]
        ]

        assertEquals(expectedPrettifiedErrorMessage, aodaacAggregatorService._prettifyErrorMessage(originalErrorMessage))
    }

    void testGetEmailBodyMessageCode() {

        testJob.dataFileExists = true
        assertEquals "testinstance.aodaacJob.notification.email.successBody", aodaacAggregatorService._getEmailBodyMessageCode(testJob) as String

        testJob.dataFileExists = false
        assertEquals "testinstance.aodaacJob.notification.email.failedBody", aodaacAggregatorService._getEmailBodyMessageCode(testJob) as String

        testJob.expired = true
        assertEquals "testinstance.aodaacJob.notification.email.expiredBody", aodaacAggregatorService._getEmailBodyMessageCode(testJob) as String
    }

    void testGetEmailFooter() {

        def timesCalled = 0

        aodaacAggregatorService.messageSource = [
            getMessage: { code, args, locale ->

                assertEquals "testinstance.emailFooter", code
                assertEquals([].toArray(), args)
                timesCalled++

                return 'FOOTER_TEXT'
            }
        ]

        def result = aodaacAggregatorService._getEmailFooter()

        assertEquals 'FOOTER_TEXT', result
        assertEquals 1, timesCalled
    }

    static def _expectedEmailParamsString(job) {

        def p = job.jobParams
        return """\
ProductId: ${ p.productId }
Output format: ${ p.outputFormat }
Date range start: ${ p.dateRangeStart }
Date range end: ${ p.dateRangeEnd }
Time of day start: ${ p.timeOfDayRangeStart }
Time of day end: ${ p.timeOfDayRangeEnd }
Lat range start: ${ p.latitudeRangeStart }
Lat range end: ${ p.latitudeRangeEnd }
Long range start: ${ p.longitudeRangeStart }
Long range end: ${ p.longitudeRangeEnd }"""
    }
}
