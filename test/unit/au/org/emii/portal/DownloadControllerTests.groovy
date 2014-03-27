/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.test.ControllerUnitTestCase

class DownloadControllerTests extends ControllerUnitTestCase {

    def controller
    def testServer
    def testLayer

    protected void setUp() {
        super.setUp()

        mockLogging DownloadController

        controller = new DownloadController()
        controller.grailsApplication = [config: [indexedFile: [fileSizeColumnName: "size"]]]

        _setUpExampleObjects()
        _setHostShouldBeValid(true)
    }

    void testUrlListForLayerNoLayerId() {

        mockParams.layerId = null

        controller.urlListForLayer()

        assertEquals "No layerId provided", mockResponse.contentAsString
    }

    void testUrlListForLayer() {

        def testParamProcessor = new Object()
        controller.metaClass.requestSingleFieldParamProcessor = { fieldName ->
            assertEquals "relativeFilePath", fieldName
            return testParamProcessor
        }

        def testStreamProcessor = new Object()
        controller.metaClass.urlListStreamProcessor = { fieldName, prefixToRemove, newUrlBase ->
            assertEquals testLayer.urlDownloadFieldName, fieldName
            assertEquals testServer.urlListDownloadPrefixToRemove, prefixToRemove
            assertEquals testServer.urlListDownloadPrefixToSubstitue, newUrlBase

            return testStreamProcessor
        }

        def performProxyingCalledCount = 0
        controller._performProxying = { paramProcessor, streamProcessor ->
            performProxyingCalledCount++

            assertEquals testParamProcessor, paramProcessor
            assertEquals testStreamProcessor, streamProcessor
        }

        controller.urlListForLayer()

        assertEquals 1, performProxyingCalledCount
    }

    void testDownloadNetCdfFilesForLayerNoLayerId() {

        mockParams.layerId = null

        controller.downloadNetCdfFilesForLayer()

        assertEquals "No layerId provided", mockResponse.contentAsString
    }

    void testDownloadNetCdfFilesForLayerInvalidHost() {

        _setHostShouldBeValid(false)

        controller.estimateSizeForLayer()

        assertEquals "Host for address 'http://www.example.com/?PROPERTYNAME=relativeFilePath,size' not allowed", mockResponse.contentAsString
    }

    void testDownloadNetCdfFilesForLayer() {

        mockParams.downloadFilename = 'somedata.txt'

        def archiveGenerated = false
        controller.metaClass.urlListStreamProcessor = { fieldName, prefixToRemove, newUrlBase ->
            assertEquals testLayer.urlDownloadFieldName, fieldName
            assertEquals testServer.urlListDownloadPrefixToRemove, prefixToRemove
            assertEquals testServer.urlListDownloadPrefixToSubstitue, newUrlBase

            { inputStream, outputStream ->
                outputStream << """\
                    url1
                    url2
                """
            }
        }
        controller.bulkDownloadService = [
            generateArchiveOfFiles: { urlList, outputStream, locale ->
                assertEquals(["url1", "url2"], urlList)
                assertEquals mockResponse.outputStream, outputStream
                archiveGenerated = true
            }
        ]

        controller.downloadNetCdfFilesForLayer()

        assertTrue archiveGenerated
    }

    void testEstimateSizeForLayerNoLayerId() {

        mockParams.layerId = null

        controller.estimateSizeForLayer()

        assertEquals "No layerId provided", mockResponse.contentAsString
    }

    void testEstimateSizeForLayerInvalidHost() {

        _setHostShouldBeValid(false)

        controller.estimateSizeForLayer()

        assertEquals "Host for address 'http://www.example.com/?PROPERTYNAME=relativeFilePath,size' not allowed", mockResponse.contentAsString
    }

    void testEstimateSizeForLayerNoUrlColumnSpecified() {

        testLayer.urlDownloadFieldName = null

        def testStreamProcessor = new Object()
        controller.metaClass.calculateSumStreamProcessor = { filenameFieldName, sizeFieldName ->
            assertEquals null, filenameFieldName
            assertEquals "size", sizeFieldName
            return testStreamProcessor
        }

        controller.estimateSizeForLayer()

        assertEquals "-1", mockResponse.contentAsString
    }

    void testEstimateSizeForLayerNoProblems() {

        def testStreamProcessor = new Object()
        controller.metaClass.calculateSumStreamProcessor = { filenameFieldName, sizeFieldName ->
            assertEquals "relativeFilePath", filenameFieldName
            assertEquals "size", sizeFieldName
            return testStreamProcessor
        }
        controller.metaClass._executeExternalRequest = { url, streamProcessor, resultStream ->
            assertEquals testStreamProcessor, streamProcessor
            resultStream << "the output"
        }

        controller.estimateSizeForLayer()

        assertEquals "the output", mockResponse.contentAsString
    }

    void testEstimateSizeForLayerWitExternalRequestException() {

        def testStreamProcessor = new Object()
        controller.metaClass.calculateSumStreamProcessor = { filenameFieldName, sizeFieldName ->  testStreamProcessor }
        controller.metaClass._executeExternalRequest = { url, streamProcessor, resultStream ->
            throw new Exception("Test Exception")
        }

        controller.estimateSizeForLayer()

        assertEquals "-1", mockResponse.contentAsString
    }

    void testRequestSingleFieldParamProcessor() {

        def pp = controller.requestSingleFieldParamProcessor("relativeFilePath")
        def params = [url: "the_url?a=b"]

        params = pp(params)

        assertEquals "the_url?a=b&PROPERTYNAME=relativeFilePath", params.url
    }

    void testUrlListStreamProcessor() {

        def input = """\
            FID,relativeFilePath
            aatams_sattag_nrt_wfs.331443,/mnt/imos-t4/IMOS/Q9900542.nc
            aatams_sattag_nrt_wfs.331445,/mnt/imos-t4/IMOS/Q9900543.nc
            aatams_sattag_nrt_wfs.331441,/mnt/imos-t4/IMOS/Q9900540.nc
            aatams_sattag_nrt_wfs.331442,/mnt/imos-t4/IMOS/Q9900541.nc
            aatams_sattag_nrt_wfs.331443,/mnt/imos-t4/IMOS/Q9900542.nc
            aatams_sattag_nrt_wfs.331445,/mnt/imos-t4/IMOS/Q9900543.nc

        """

        def expectedOutput = """\
http://data.imos.org.au/IMOS/Q9900542.nc\n\
http://data.imos.org.au/IMOS/Q9900543.nc\n\
http://data.imos.org.au/IMOS/Q9900540.nc\n\
http://data.imos.org.au/IMOS/Q9900541.nc\n\
"""

        def inputStream = new ByteArrayInputStream(input.bytes)
        def outputStream = new ByteArrayOutputStream()

        def sp = controller.urlListStreamProcessor('relativeFilePath', '/mnt/imos-t4/', 'http://data.imos.org.au/')
        sp(inputStream, outputStream)

        def output = outputStream.toString("UTF-8")

        assertEquals expectedOutput, output
    }

    void testCalculateSumStreamProcessorNoProblems() {

        def input = """\
            FID,relativeFilePath,size
            aatams_sattag_nrt_wfs.331443,file_a,100
            aatams_sattag_nrt_wfs.331445,file_b,200
            aatams_sattag_nrt_wfs.331441,file_c,300
            aatams_sattag_nrt_wfs.331446,file_d,300
            aatams_sattag_nrt_wfs.331447,file_d,300
            aatams_sattag_nrt_wfs.331442,file_e,400
        """

        def expectedOutput = "1300"

        assertCorrectProcessing(
            controller.calculateSumStreamProcessor("relativeFilePath", "size"),
            input,
            expectedOutput
        )
    }

    void _setUpExampleObjects() {

        testServer = new Server(name: 'My Server', uri: "http://www.google.com/", urlListDownloadPrefixToRemove: "/mnt/imos-t4", urlListDownloadPrefixToSubstitue: "http://data.imos.org.au")
        testLayer = new Layer(id: 1, name: "The Layer", urlDownloadFieldName: "relativeFilePath", server: testServer, dataSource: "test data")

        mockDomain Server, [testServer]
        mockDomain Layer, [testLayer]

        mockParams.layerId = 1
        mockParams.url = 'http://www.example.com/'
    }

    void _setHostShouldBeValid(valid) {

        controller.hostVerifier = [allowedHost: { r, u -> valid }]
    }

    static void assertCorrectProcessing(streamProcessor, input, expectedOutput) {

        def inputStream = new ByteArrayInputStream(input.bytes)
        def outputStream = new ByteArrayOutputStream()

        streamProcessor(inputStream, outputStream)

        def output = outputStream.toString("UTF-8")

        assertEquals expectedOutput, output
    }
}
