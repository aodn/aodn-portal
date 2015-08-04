

package au.org.emii.portal

import grails.test.ControllerUnitTestCase

import static au.org.emii.portal.DownloadController.SIZE_ESTIMATE_ERROR
import static au.org.emii.portal.HttpUtils.Status.*

@TestFor(DownloadController)
class DownloadControllerTests {

    def testServer

    void setUp() {
        controller.grailsApplication.config.indexedFile.fileSizeColumnName = "size"

        DownloadController.metaClass.static._getServer = { testServer }

        _setUpExampleObjects()
        _setHostShouldBeValid(true)
    }

    void testUrlListForLayerNoUrlFieldName() {

        controller.params.urlFieldName = null

        controller.urlListForLayer()

        assertEquals "urlFieldName was not provided", response.contentAsString
    }

    void testUrlListForLayer() {

        def testParamProcessor = new Object()
        controller.metaClass.requestSingleFieldParamProcessor = { fieldName ->
            assertEquals "relativeFilePath", fieldName
            return testParamProcessor
        }

        def testStreamProcessor = new Object()
        controller.metaClass.urlListStreamProcessor = { fieldName, urlSubstitutions ->
            assertEquals 'relativeFilePath', fieldName
            assertEquals testServer.urlListDownloadSubstitutions, urlSubstitutions

            return testStreamProcessor
        }

        def performProxyingCalledCount = 0
        controller._performProxyingIfAllowed = { paramProcessor, streamProcessor, fieldName ->
            performProxyingCalledCount++

            assertEquals testParamProcessor, paramProcessor
            assertEquals testStreamProcessor, streamProcessor
        }

        controller.urlListForLayer()

        assertEquals 1, performProxyingCalledCount
    }

    void testDownloadPythonSnippet() {
        controller.params.url = "http://someurl"
        def renderParams

        controller.g.metaClass.render = {
            Map theRenderParams ->
                renderParams = theRenderParams
        }
        controller.downloadPythonSnippet()

        assertEquals("text/plain", response.contentType)
        assertEquals("pythonSnippet.py", renderParams.template)
        assertEquals([ collectionUrl: "http://someurl" ], renderParams.model)
    }

    void testDownloadNetCdfFilesForLayerExceptionThrown() {

        controller.metaClass._executeExternalRequest = { a, b, c ->

            throw new Exception('Failed before downloading started')
        }

        controller.downloadNetCdfFilesForLayer()

        assertEquals 'An error occurred before downloading could begin', response.contentAsString
    }

    void testDownloadNetCdfFilesForLayerInvalidHost() {

        _setHostShouldBeValid(false)

        controller.downloadNetCdfFilesForLayer()

        assertEquals HTTP_403_FORBIDDEN, response.status
    }

    void testDownloadNetCdfFilesForLayer() {

        controller.params.downloadFilename = 'somedata.txt'

        def archiveGenerated = false
        controller.metaClass.urlListStreamProcessor = { fieldName, urlSubstitutions ->
            assertEquals 'relativeFilePath', fieldName
            assertEquals testServer.urlListDownloadSubstitutions, urlSubstitutions

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
                assertEquals response.outputStream, outputStream
                archiveGenerated = true
            }
        ]

        controller.downloadNetCdfFilesForLayer()

        assertTrue archiveGenerated
    }

    void testEstimateSizeForLayerNoUrlFieldName() {

        controller.params.urlFieldName = null

        controller.estimateSizeForLayer()

        assertEquals SIZE_ESTIMATE_ERROR, response.contentAsString
    }

    void testEstimateSizeForLayerInvalidHost() {

        _setHostShouldBeValid(false)

        controller.estimateSizeForLayer()

        assertEquals SIZE_ESTIMATE_ERROR, response.contentAsString
    }

    void testEstimateSizeForLayerNoUrlColumnSpecified() {

        controller.params.urlFieldName = null

        def testStreamProcessor = new Object()
        controller.metaClass.calculateSumStreamProcessor = { filenameFieldName, sizeFieldName ->
            assertEquals null, filenameFieldName
            assertEquals "size", sizeFieldName
            return testStreamProcessor
        }

        controller.estimateSizeForLayer()

        assertEquals SIZE_ESTIMATE_ERROR, response.contentAsString
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

        assertEquals "the output", response.contentAsString
    }

    void testEstimateSizeForLayerWitExternalRequestException() {

        def testStreamProcessor = new Object()
        controller.metaClass.calculateSumStreamProcessor = { filenameFieldName, sizeFieldName ->  testStreamProcessor }
        controller.metaClass._executeExternalRequest = { url, streamProcessor, resultStream ->
            throw new Exception("Test Exception")
        }

        controller.estimateSizeForLayer()

        assertEquals SIZE_ESTIMATE_ERROR, response.contentAsString
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
            some_cool_data,/some_path/foo/123.nc

        """

        def expectedOutput = """\
http://data.imos.org.au/IMOS/Q9900542.nc\n\
http://data.imos.org.au/IMOS/Q9900543.nc\n\
http://data.imos.org.au/IMOS/Q9900540.nc\n\
http://data.imos.org.au/IMOS/Q9900541.nc\n\
/some_path/bar/123.nc\n\
"""

        def inputStream = new ByteArrayInputStream(input.bytes)
        def outputStream = new ByteArrayOutputStream()

        def sp = controller.urlListStreamProcessor(
            'relativeFilePath',
            [
                '/mnt/imos-t4/': 'http://data.imos.org.au/',
                'foo': 'bar'
            ]
        )
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
        testServer = [
            name: 'My Server',
            uri: "http://www.google.com/",
            urlListDownloadSubstitutions: [
                '/mnt/imos-t4': 'http://data.aodn.org.au'
            ]
        ]

        controller.grailsApplication.config.knownServers = [ testServer ]

        controller.params.url = 'http://www.example.com/'
        controller.params.urlFieldName = 'relativeFilePath'
    }

    void _setHostShouldBeValid(valid) {
        controller.hostVerifier = [allowedHost: { u -> valid }]
    }

    static void assertCorrectProcessing(streamProcessor, input, expectedOutput) {

        def inputStream = new ByteArrayInputStream(input.bytes)
        def outputStream = new ByteArrayOutputStream()

        streamProcessor(inputStream, outputStream)

        def output = outputStream.toString("UTF-8")

        assertEquals expectedOutput, output
    }
}
