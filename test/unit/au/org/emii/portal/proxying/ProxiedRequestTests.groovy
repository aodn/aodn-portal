/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

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
        def determineDownloadFilenameCallCount = 0

        proxiedRequest.executeRequest = { streamProcessor ->

            assertEquals testStreamProcessor,  streamProcessor
            executeRequestCallCount++
        }
        proxiedRequest._determineResponseContentType = { determineResponseTypeCallCount++ }
        proxiedRequest._determineDownloadFilename = { determineDownloadFilenameCallCount++ }

        proxiedRequest.proxy(testStreamProcessor)

        assertEquals 1, executeRequestCallCount
        assertEquals 1, determineResponseTypeCallCount
        assertEquals 1, determineDownloadFilenameCallCount
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

    void testDetermineDownloadFilename() {

        def setHeaderCallCount = 0
        response.setHeader = { name, value ->
            setHeaderCallCount++
            assertEquals 'Content-disposition', name
            assertEquals 'attachment; filename=the_filename.pdf', value
        }

        proxiedRequest._determineDownloadFilename()
        assertEquals 0, setHeaderCallCount

        params.downloadFilename = 'the_filename.pdf'
        proxiedRequest._determineDownloadFilename()
        assertEquals 1, setHeaderCallCount
    }

    void testGetTargetUrl() {

        def params = [
            one: '1',
            controller: 'a',
            action: 'b',
            url: 'http://www.google.com/',
            format: 'd',
            _dc: 'e',
            two: '2'
        ]

        def targetUrl = ProxiedRequest._getTargetUrl(params)

        assertEquals URL.class, targetUrl.getClass()
        assertEquals "http://www.google.com/?one=1&two=2", targetUrl.toString()
    }
}
