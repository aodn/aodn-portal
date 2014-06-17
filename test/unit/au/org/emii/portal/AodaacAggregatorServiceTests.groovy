/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.test.GrailsUnitTestCase
import org.apache.commons.io.IOUtils

import static au.org.emii.portal.AodaacJob.Status.*

class AodaacAggregatorServiceTests extends GrailsUnitTestCase {

    AodaacAggregatorService service
    AodaacJob testJob
    def testParams = [
        productId: '1',
        latitudeRangeStart: '-90.0',
        latitudeRangeEnd: '90.0',
        longitudeRangeStart: '-180.0',
        longitudeRangeEnd: '180.0',
        dateRangeStart: "2001-04-21T00:34:11.222Z",
        dateRangeEnd: "2012-05-22T12:45:55.000Z",
        notificationEmailAddress: 'john@example.com'
    ]

    protected void setUp() {

        super.setUp()

        mockLogging AodaacAggregatorService
        mockDomain AodaacJob

        def grailsApplication = [
            config: [
                aodaacAggregator: [
                    url: 'the_url',
                    environment: 'env',
                    apiCallConnectTimeout: 1,
                    apiCallReadTimeout: 1
                ],
                portal: [
                    systemEmail: [
                        fromAddress: 'example@example.com'
                    ]
                ]
            ]
        ]

        service = new AodaacAggregatorService()
        service.grailsApplication = grailsApplication
        service.portalInstance = [code: { -> 'test' }]
        service.metaClass._getMessage = { key -> key }
        service.metaClass._getMessage = { key, replacements -> "$key $replacements" }

        testJob = new AodaacJob('1234', testParams)
    }

    void testGetProductInfoNoIds() {

        service.metaClass._makeApiCall = { fail "Should not be called" }

        assertEquals([], service.getProductInfo([]))
    }

    void testGetProductInfo() {

        def p1 = [id: 1];
        def p2 = [id: 2];
        def p3 = [id: 3];
        def p4 = [id: 4];

        service.metaClass._makeApiCall = { apiCallUrl ->

            assertEquals service.productDataJavascriptAddress, apiCallUrl

            return [
                [products: [p1, p2]],
                [products: [p3, p4]]
            ]
        }

        def products = service.getProductInfo([1, 3])

        assertEquals([p1], products)
    }

    void testGetProductInfoThrowsException() {

        service.metaClass._makeApiCall = { throw new Exception("For testing") }

        def products = service.getProductInfo([1])

        assertEquals([], products)
    }

    void testProductIdsForLayer() {

        def testLayer = [
            name: 'ACORN',
            server: 'AODN ncWMS'
        ]

        AodaacProductLink.metaClass.static.findAllByLayerNameIlikeAndServer = { name, server ->

            assertEquals 'ACORN', name
            assertEquals 'AODN ncWMS', server

            return [
                [productId: 1], [productId: 2], [productId: 1]
            ]
        }

        def ids = service.productIdsForLayer(testLayer)

        assertEquals([1, 2], ids)
    }

    void testCreateJob() {

        def testArgs = [:]
        service.metaClass._creationApiCallArgs = { params -> testArgs }
        service.metaClass.jobCreationUrl = { args ->

            assertEquals testArgs, args
            return 'creation_url'
        }
        def apiCallResponse = [id: '1234']
        service.metaClass._makeApiCall = { url ->

            assertEquals 'creation_url', url
            return apiCallResponse
        }

        assertEquals 0, AodaacJob.count()

        service.createJob(testParams)

        assertEquals 1, AodaacJob.count()

        def newJob = AodaacJob.get(1)
        assertEquals 'john@example.com', newJob.notificationEmailAddress
        assertEquals '1234', newJob.jobId
    }

    void testUpdateJobAlreadyEnded() {

        def testJob = [
            hasEnded: { -> true }
        ]
        service.metaClass._makeApiCall = { fail "Should not be called" }

        service.updateJob(testJob)
    }

    void testUpdateJobStillRunning() {

        service.metaClass.jobUpdateUrl = { job -> 'the_url' }
        service.metaClass._makeApiCall = { url ->

            assertEquals 'the_url', url
            return [status: "RUNNING"]
        }

        service.updateJob(testJob)

        assertEquals testJob.status, RUNNING
    }

    void testUpdateJobEndedAfterUpdate() {

        def testDetails = [status: "SUCCESS", files: ['f1', 'f2']]
        service.metaClass.jobUpdateUrl = { job -> 'the_url' }
        service.metaClass._makeApiCall = { url ->

            assertEquals 'the_url', url
            return testDetails
        }
        def sendEmailCalled = false
        service.metaClass._sendNotificationEmail = { job, currentDetails ->

            assertEquals testJob, job
            assertEquals testDetails, currentDetails
            sendEmailCalled = true
        }

        service.updateJob(testJob)

        assertEquals testJob.status, SUCCESS
        assertTrue sendEmailCalled
    }

    void testUpdateJobForJobUnknownToAodaac() {
        // AODAAC returns empty JSON for jobs it doesn't know about (including those older than a certain age).
        service.metaClass._makeApiCall = { [:] }

        service.updateJob(testJob)
        assertEquals testJob.status, ASSUME_EXPIRED
    }

    void testCheckIncompleteJobs() {

        testJob.setStatus FAIL
        testJob.save()

        AodaacJob.metaClass.static.findAll = { query ->

            assertEquals "from AodaacJob as job where job.status not in ('FAIL','ASSUME_EXPIRED','SUCCESS')", query
            return [testJob]
        }

        def callCount = 0
        def jobIds = []
        service.metaClass.updateJob = {
            callCount++
            jobIds << it.jobId
        }

        service.checkIncompleteJobs()

        assertEquals 1, callCount
        assertEquals(['1234'], jobIds)
    }

    void testCheckIncompleteJobsWithException() {
        def job1 = new AodaacJob('1111', testParams);
        def job2 = new AodaacJob('2222', testParams);

        AodaacJob.metaClass.static.findAll = { query ->
            return [job1, job2]
        }

        def updateJobCalledWithJob2 = false
        service.metaClass.updateJob = {

            job ->

            if (job == job1) {
                throw new Exception('bad stuff just happened')
            }

            if (job == job2) {
                updateJobCalledWithJob2 = true
            }
        }

        service.checkIncompleteJobs()
        assertTrue updateJobCalledWithJob2
    }

    void testCreationApiCallArgs() {

        def testParams = [
            dateRangeStart: "2013-11-01T07:59:59.999Z",
            dateRangeEnd:   "2013-11-20T10:30:00.000Z",
            latitudeRangeStart:  '-32',
            latitudeRangeEnd:    '-31',
            longitudeRangeStart: '113',
            longitudeRangeEnd:   '116',
            productId: "1"
        ]
        def expectedResult = [
            'startdate': "2013-11-01T07:59:59",
            'stopdate':  "2013-11-20T10:30:00",
            'nlat': "-31",
            'slat': "-32",
            'elon': "116",
            'wlon': "113",
            'products': "1"
        ]

        def result = service._creationApiCallArgs(testParams)

        assertEquals expectedResult, result
    }

    void testMakeApiCall() {

        service.metaClass._apiCallsDisabled = { -> false }
        def testConnection = [
            connect: { -> },
            inputStream: IOUtils.toInputStream("{id: 1}")
        ]
        def testApiCallUrl = [
            toURL: { ->
                [openConnection: { -> testConnection }]
            }
        ]

        def response = service._makeApiCall(testApiCallUrl)

        assertEquals([id: 1], response)
    }

    void testDateFromParams() {

        def dateIn = "2013-11-01T07:59:59.999Z"
        def expectedDateOut = "2013-11-01T07:59:59"

        def dateOut = service._dateFromParams(dateIn)

        assertEquals expectedDateOut, dateOut
    }

    void testSendNotificationEmail() {

        def testDetails = [files: ['file_link']]

        service.metaClass._getEmailBodyMessageCode = { job, details -> 'body_code' }
        service.metaClass._getEmailBodyReplacements = { job, details -> 'replacements' }

        service.metaClass.to = { recipients ->
            assertEquals(['john@example.com'], recipients)
        }
        service.metaClass.subject = { text ->
            assertEquals 'test.aodaacJob.notification.email.subject [1234]', text
        }
        service.metaClass.body = { text ->
            assertEquals 'body_code replacements', text
        }
        service.metaClass.from = { sender ->
            assertEquals 'example@example.com', sender
        }
        def sendMailCallCount = 0
        service.metaClass.sendMail = {
            sendMailCallCount++
            it.call()
        }

        service._sendNotificationEmail(testJob, testDetails)

        assertEquals 1, sendMailCallCount
    }

    void testGetEmailBodyReplacementsForFailedJobWithErrorMessage() {

        def testJob = [
            failed: { -> true }
        ]
        def testDetails = [
            errors: 'error'
        ]
        service.metaClass._prettifyErrorMessage = { message ->
            assertEquals message, 'error'
            return 'pretty'
        }

        def replacements = service._getEmailBodyReplacements(testJob, testDetails)

        assertEquals(['test.aodaacJob.emailOpening', 'pretty', 'test.emailFooter'], replacements)
    }

    void testGetEmailBodyReplacementsForSuccessfulJob() {

        def testJob = [failed: { -> false }] as AodaacJob
        def testDetails = [files: ['f1', 'f2']]

        def replacements = service._getEmailBodyReplacements(testJob, testDetails)

        assertEquals(['test.aodaacJob.emailOpening', 'f1\nf2', 'test.emailFooter'], replacements)
    }

    void testGetEmailBodyReplacementsForJobWithNoFiles() {

        def testJob = new AodaacJob('1234', [
                productId: "42",
                latitudeRangeStart: "-12.7",
                latitudeRangeEnd: "-11.1",
                longitudeRangeStart: "91.7",
                longitudeRangeEnd: "92.8",
                dateRangeStart: "2001-01-01T22:44:00.000Z",
                dateRangeEnd: "2001-03-02T21:46:59.000Z"
            ]
        )
        testJob.setStatus SUCCESS
        def testDetails = [files: []]
        service.metaClass.getProductInfo = {[
            extents: [
                lat: [[-90, 90]],
                lon: [[-180, 180]],
                time: [["2001-01-02 09:44:00.0", "2013-04-25 12:53:00.0"]]
            ]
        ]}

        def replacements = service._getEmailBodyReplacements(testJob, testDetails)

        assertEquals 4, replacements.size()
        assertEquals 'test.aodaacJob.emailOpening', replacements[0]
        assertEquals 'Latitude from -12.7 to -11.1\nLongitude from 91.7 to 92.8\nDate range from 2001-01-01T22:44:00 to 2001-03-02T21:46:59', replacements[1]
        assertEquals 'Latitude from -90 to 90\nLongitude from -180 to 180\nDate range from 2001-01-02 09:44:00.0 to 2013-04-25 12:53:00.0', replacements[2]
        assertEquals 'test.emailFooter', replacements[3]
    }

    void testPrettyifyErrorMessage() {

        service.grailsApplication.config.aodaacAggregator.errorLookup = [
            [
                key: '.*',
                value: { 'Pretty' }
            ]
        ]

        def result = service._prettifyErrorMessage('The message')

        assertEquals "Pretty", result
    }

    void testPrettyifyErrorMessageNoMatch() {

        service.grailsApplication.config.aodaacAggregator.errorLookup = [
            [
                key: 'asdf',
                value: { fail "Should not get called" }
            ]
        ]

        def result = service._prettifyErrorMessage('The message')

        assertEquals "Unknown error", result
    }

    void testGetEmailBodyMessageCode() {

        def testJob = [
            status: FAIL
        ] as AodaacJob
        def testDetails = [files: []]

        def result = service._getEmailBodyMessageCode(testJob, testDetails)

        assertEquals "test.aodaacJob.notification.email.failBody", result
    }

    void testGetEmailBodyMessageCodeWhenAssumeExpired() {

        def testJob = [
            status: ASSUME_EXPIRED
        ] as AodaacJob
        def testDetails = [files: []]

        def result = service._getEmailBodyMessageCode(testJob, testDetails)

        assertEquals "test.aodaacJob.notification.email.assume_expiredBody", result
    }

    void testGetEmailBodyMessageCodeWhenSuccessWithFiles() {

        def testJob = [
            status: SUCCESS
        ] as AodaacJob
        def testDetails = [
            files: ['out.nc']
        ]

        def result = service._getEmailBodyMessageCode(testJob, testDetails)

        assertEquals "test.aodaacJob.notification.email.successBody", result
    }

    void testGetEmailBodyMessageCodeWhenNoFiles() {

        def testJob = [
            status: SUCCESS
        ] as AodaacJob
        def testDetails = [
            files: []
        ]

        def result = service._getEmailBodyMessageCode(testJob, testDetails)

        assertEquals "test.aodaacJob.notification.email.noDataBody", result
    }
}
