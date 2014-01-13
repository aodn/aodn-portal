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
    }

    void testUrlListForLayerNoLayerId() {

        controller.urlListForLayer()

        assertEquals "No layerId provided", mockResponse.contentAsString
    }

    void testUrlListForLayer() {

        _setUpExampleObjects()

        def testParamProcessor = new Object()
        controller.metaClass.requestSingleFieldParamProcessor = { fieldName ->
            assertEquals "relativeFilePath", fieldName
            return testParamProcessor
        }

        def testStreamProcessor = new Object()
        controller.metaClass.urlListStreamProcessor = { layer ->
            assertEquals testLayer, layer
            return testStreamProcessor
        }

        def performProxyingCalledCount = 0
        controller._performProxying = { paramProcessor, streamProcessor ->
            performProxyingCalledCount++

            assertEquals testParamProcessor, paramProcessor
            assertEquals testStreamProcessor, streamProcessor
        }

        mockParams.layerId = 1

        controller.urlListForLayer()

        assertEquals 1, performProxyingCalledCount
    }

    void testDownloadNetCdfFilesForLayerNoLayerId() {

        controller.downloadNetCdfFilesForLayer()

        assertEquals "No layerId provided", mockResponse.contentAsString
    }

    void testDownloadNetCdfFilesForLayerInvalidHost() {

        _setUpExampleObjects()
        mockParams.layerId = 1
        mockParams.url = 'the_url'

        controller.hostVerifier = [allowedHost: { r, u -> false }]

        controller.estimateSizeForLayer()

        assertEquals "Host for address 'the_url' not allowed", mockResponse.contentAsString
    }

    void testDownloadNetCdfFilesForLayer() {

        _setUpExampleObjects()
        mockParams.layerId = 1
        mockParams.url = 'http://www.example.com/'

        def testUrlList = """\
            url1
            url2
        """

        def archiveGenerated = false
        controller.hostVerifier = [allowedHost: { r, u -> true }]
        controller.metaClass.urlListStreamProcessor = { layer ->
            assertEquals testLayer, layer
            { inputStream, outputStream -> outputStream << testUrlList }
        }
        controller.bulkDownloadService = [
            generateArchiveOfFiles: { urlList, outputStream, locale ->
                assertEquals testUrlList, urlList
                assertEquals mockResponse.outputStream, outputStream
                archiveGenerated = true
            }
        ]

        controller.downloadNetCdfFilesForLayer()

        assertTrue archiveGenerated
    }

    void testEstimateSizeForLayerNoLayerId() {

        controller.estimateSizeForLayer()

        assertEquals "No layerId provided", mockResponse.contentAsString
    }

    void testEstimateSizeForLayerInvalidHost() {

        _setUpExampleObjects()
        mockParams.layerId = 1
        mockParams.url = "the_url"

        controller.hostVerifier = [allowedHost: { r, u -> false }]

        controller.estimateSizeForLayer()

        assertEquals "Host for address 'the_url' not allowed", mockResponse.contentAsString
    }

    void testEstimateSizeForLayer() {

        _setUpExampleObjects()

        mockParams.layerId = 1

        def testStreamProcessor = new Object()
        controller.metaClass.calculateSumStreamProcessor = { filenameFieldName, sizeFieldName ->
            assertEquals "relativeFilePath", filenameFieldName
            assertEquals "size", sizeFieldName
            return testStreamProcessor
        }
        controller.hostVerifier = [allowedHost: { r, u -> true }]
        controller.grailsApplication = [config: [indexedFile: [fileSizeColumnName: "size"]]]
        controller.metaClass._executeExternalRequest = { url, streamProcessor, resultStream ->
            assertEquals testStreamProcessor, streamProcessor
            resultStream << "the output"
        }

        controller.estimateSizeForLayer()

        assertEquals "the output", mockResponse.contentAsString
    }

    void testRequestSingleFieldParamProcessor() {

        def pp = controller.requestSingleFieldParamProcessor("relativeFilePath")
        def params = [url: "the_url?a=b"]

        params = pp(params)

        assertEquals "the_url?a=b&PROPERTYNAME=relativeFilePath", params.url
    }

    void testUrlListStreamProcessor() {

        _setUpExampleObjects()

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

        def sp = controller.urlListStreamProcessor(testLayer)
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

    void testCalculateSumStreamProcessorWithProblems() {

        def input = """\
            FID,relativeFilePath,size
            aatams_sattag_nrt_wfs.331443,file_a,100
            aatams_sattag_nrt_wfs.331445,file_b,not a number

        """

        def expectedOutput = "-1"

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
    }

    static void assertCorrectProcessing(streamProcessor, input, expectedOutput) {

        def inputStream = new ByteArrayInputStream(input.bytes)
        def outputStream = new ByteArrayOutputStream()

        streamProcessor(inputStream, outputStream)

        def output = outputStream.toString("UTF-8")

        assertEquals expectedOutput, output
    }
}
