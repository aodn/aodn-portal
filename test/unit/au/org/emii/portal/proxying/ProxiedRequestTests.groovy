package au.org.emii.portal.proxying

import grails.test.GrailsUnitTestCase

class ProxiedRequestTests extends GrailsUnitTestCase {

    def proxyRedirectService
    def proxiedRequest
    def request
    def response
    def params
    def grailsApplication

    @Override
    void setUp() {
        super.setUp();

        request = [:]
        response = [outputStream: null]
        params = [url: 'http://www.google.com']

        grailsApplication = [config: [proxyConnectTimeout: 2000]]

        proxyRedirectService = [

            getRedirectedUrl: { String url -> url }
        ]

        proxiedRequest = new ProxiedRequest(request, response, params, proxyRedirectService, grailsApplication)
    }

    void testProxy() {

        def testStreamProcessor = new Object()

        def executeRequestCallCount = 0

        proxiedRequest.executeRequest = { streamProcessor ->

            assertEquals testStreamProcessor,  streamProcessor
            executeRequestCallCount++
        }

        proxiedRequest.proxy(testStreamProcessor)

        assertEquals 1, executeRequestCallCount
    }

    void testDetermineResponseContentType() {

        assertEquals null, response.contentType

        request.contentType = 'image/gif'
        proxiedRequest._determineResponseContentType()
        assertEquals 'image/gif', response.contentType

        params.format = 'text/html'
        proxiedRequest._determineResponseContentType()
        assertEquals 'text/html', response.contentType
    }

    void testGetTargetUrl() {

        def params = [
            one: '1',
            controller: 'a',
            action: 'b',
            url: 'http://www.google.com/',
            _dc: 'e',
            two: '2'
        ]

        def targetUrl = ProxiedRequest._getTargetUrl(params, proxyRedirectService)

        assertEquals URL.class, targetUrl.getClass()
        assertEquals "http://www.google.com/?one=1&two=2", targetUrl.toString()
    }

    void testOnConnectionOpened() {
        response.containsHeader = {
            false
        }

        def headerField = null
        def headerValue = null

        response.setHeader = { field, value ->
            headerField = field
            headerValue = value
        }

        def conn = [getHeaderField: {'test'}]

        proxiedRequest.onConnectionOpened(conn)

        assertEquals 'Content-disposition', headerField
        assertEquals 'test', headerValue
    }
}
