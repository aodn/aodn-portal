package au.org.emii.portal.proxying

import grails.test.GrailsUnitTestCase

class ProxiedRequestTests extends GrailsUnitTestCase {

    def proxiedRequest
    def request
    def response
    def params

    @Override
    void setUp() {
        super.setUp();

        request = [:]
        response = [outputStream: null]
        params = [url: 'http://www.google.com']

        proxiedRequest = new ProxiedRequest(request, response, params)
    }

    void testProxy() {

        def testStreamProcessor = new Object()

        def executeRequestCallCount = 0
        def determineResponseTypeCallCount = 0

        proxiedRequest.executeRequest = { streamProcessor ->

            assertEquals testStreamProcessor,  streamProcessor
            executeRequestCallCount++
        }
        proxiedRequest._determineResponseContentType = { determineResponseTypeCallCount++ }

        proxiedRequest.proxy(testStreamProcessor)

        assertEquals 1, executeRequestCallCount
        assertEquals 1, determineResponseTypeCallCount
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

        def targetUrl = ProxiedRequest._getTargetUrl(params)

        assertEquals URL.class, targetUrl.getClass()
        assertEquals "http://www.google.com/?one=1&two=2", targetUrl.toString()
    }
}
