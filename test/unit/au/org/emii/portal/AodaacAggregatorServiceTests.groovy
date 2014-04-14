/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.test.GrailsUnitTestCase

class AodaacAggregatorServiceTests extends GrailsUnitTestCase {

    AodaacAggregatorService service

    protected void setUp() {

        super.setUp()

        mockLogging AodaacAggregatorService
        mockDomain AodaacJob

        def grailsApplication = [
            config: [
                aodaacAggregator: [
                    url: 'the_url',
                    environment: 'env'
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

        service.createJob('john@example.com', [:])

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

        def testJob = new AodaacJob('1234', 'fred@example.com')
        service.metaClass.jobUpdateUrl = { job -> 'the_url' }
        service.metaClass._makeApiCall = { url ->

            assertEquals 'the_url', url
            return [status: "RUNNING"]
        }
        service.metaClass._linksForFiles = { fail "Should not get called" }

        service.updateJob(testJob)

        assertEquals testJob.status, AodaacJob.Status.RUNNING
    }

    void testUpdateJobEndedAfterUpdate() {

        def testJob = new AodaacJob('1234', 'fred@example.com')
        service.metaClass.jobUpdateUrl = { job -> 'the_url' }
        service.metaClass._makeApiCall = { url ->

            assertEquals 'the_url', url
            return [status: "SUCCESS"]
        }
        service.metaClass._linksForFiles = { 'links' }
        def sendEmailCalled = false
        service.metaClass._sendNotificationEmail = { job, replacements ->

            assertEquals testJob, job
            assertEquals(['links'], replacements)
            sendEmailCalled = true
        }

        service.updateJob(testJob)

        assertEquals testJob.status, AodaacJob.Status.SUCCESS
        assertTrue sendEmailCalled
    }

    void testCheckIncompleteJobs() {

        new AodaacJob('1', 'john@example.com').save()
        def endedJob = new AodaacJob('2', 'john@example.com')
        endedJob.setStatus AodaacJob.Status.FAIL
        endedJob.save()

        AodaacJob.metaClass.static.findAll = { query ->

            println query
            assertEquals "from AodaacJob as job where job.status not in ('FAIL','SUCCESS')", query
            return [endedJob]
        }

        def callCount = 0
        def jobIds = []
        service.metaClass.updateJob = {
            callCount++
            jobIds << it.jobId
        }

        service.checkIncompleteJobs()

        assertEquals 1, callCount
        assertEquals(['2'], jobIds)
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

        def testApiCallUrl = [
            toURL: { ->
                [text: "{id: 1}"]
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

        def testJob = new AodaacJob('1234', 'john@example.com')

        service.metaClass._getEmailBodyMessageCode = { 'body_code'  }

        service.metaClass.to = { recipients ->
            assertEquals(['john@example.com'], recipients)
        }
        service.metaClass.subject = { text ->
            assertEquals 'test.aodaacJob.notification.email.subject [1234]', text
        }
        service.metaClass.body = { text ->
            assertEquals 'body_code [file_link, test.emailFooter]', text
        }
        service.metaClass.from = { sender ->
            assertEquals 'example@example.com', sender
        }
        def sendMailCallCount = 0
        service.metaClass.sendMail = {
            sendMailCallCount++
            it.call()
        }

        service._sendNotificationEmail(testJob, ['file_link'])

        assertEquals 1, sendMailCallCount
    }

    void testGetEmailBodyReplacementsForFailedJobWithErrorMessage() {

        def testJob = [
            failed: { -> true },
            errors: 'error'
        ]
        service.metaClass._prettifyErrorMessage = { message ->
            assertEquals message, 'error'
            return 'pretty'
        }

        def replacements = service._getEmailBodyReplacements(testJob)

        assertEquals(['pretty', 'test.emailFooter'], replacements)
    }

    void testGetEmailBodyReplacementsForSuccessfulJob() {

        def testJob = [failed: { -> false }]

        def replacements = service._getEmailBodyReplacements(testJob)

        assertEquals(['test.emailFooter'], replacements)
    }

    void testLinksForFiles() {

        def testFiles = ['url1', 'url2']
        def expectedResult = """<a href="url1">url1</a> <a href="url2">url2</a>"""

        assertEquals expectedResult, service._linksForFiles(testFiles)
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

    void testgetEmailBodyMessageCode() {

        def testJob = [
            status: 'WOBBLY'
        ]

        def result = service._getEmailBodyMessageCode(testJob)

        assertEquals "test.aodaacJob.notification.email.wobblyBody", result
    }
}
