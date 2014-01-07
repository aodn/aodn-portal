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

    protected void setUp() {
        super.setUp()

        mockLogging DownloadController

        controller = new DownloadController()
    }

    void testUrlListForLayer() {

        def server = new Server(name: 'My Server', uri: "http://www.google.com/", urlListDownloadPrefixToRemove: "/mnt/imos-t4", urlListDownloadPrefixToSubstitue: "http://data.imos.org.au")
        def layer = new Layer(id: 1, name: "The Layer", urlDownloadFieldName: "relativeFilePath", server: server, dataSource: "test data")

        mockDomain Server, [server]
        mockDomain Layer, [layer]

        def testParamProcessor = new Object()
        controller.metaClass.requestSingleFieldParamProcessor = { fieldName ->
            assertEquals "relativeFilePath", fieldName
            return testParamProcessor
        }

        def testStreamProcessor = new Object()
        controller.metaClass.urlListStreamProcessor = { fieldName, prefixToRemove, newUrlBase ->
            assertEquals "relativeFilePath", fieldName
            assertEquals "/mnt/imos-t4", prefixToRemove
            assertEquals "http://data.imos.org.au", newUrlBase
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

    void testEstimateSizeForLayerNoLayerId() {
        fail "Write tests"
    }

    void testEstimateSizeForLayerInvalidHost() {
        fail "Write tests"
    }

    void testEstimateSizeForLayer() {

        def server = new Server(name: 'My Server', uri: "http://www.google.com/", urlListDownloadPrefixToRemove: "/mnt/imos-t4", urlListDownloadPrefixToSubstitue: "http://data.imos.org.au")
        def layer = new Layer(id: 1, name: "The Layer", urlDownloadFieldName: "relativeFilePath", server: server, dataSource: "test data")

        mockDomain Server, [server]
        mockDomain Layer, [layer]

        def testStreamProcessor = new Object()
        controller.metaClass.calculateSumStreamProcessor = { filenameFieldName, sizeFieldName ->
            assertEquals "relativeFilePath", filenameFieldName
            assertEquals "size", sizeFieldName
            return testStreamProcessor
        }

        mockParams.layerId = 1

        controller.estimateSizeForLayer()

        assertEquals "asdf", mockResponse.contentAsString
        fail "Write tests"
    }

    void testRequestSingleFieldParamProcessor() {

        def pp = controller.requestSingleFieldParamProcessor("relativeFilePath")
        def params = [url: "the_url?a=b"]

        params = pp(params)

        assertEquals "the_url?a=b&PROPERTYNAME=relativeFilePath", params.url
    }

    void testUrlListStreamProcessor() {

        def input = """\
            FID,profile_id,relativeFilePath
            aatams_sattag_nrt_wfs.331443,21772,/mnt/imos-t4/IMOS/Q9900542.nc
            aatams_sattag_nrt_wfs.331445,21772,/mnt/imos-t4/IMOS/Q9900543.nc
            aatams_sattag_nrt_wfs.331441,21772,/mnt/imos-t4/IMOS/Q9900540.nc
            aatams_sattag_nrt_wfs.331442,21772,/mnt/imos-t4/IMOS/Q9900541.nc
            aatams_sattag_nrt_wfs.331443,21772,/mnt/imos-t4/IMOS/Q9900542.nc
            aatams_sattag_nrt_wfs.331445,21772,/mnt/imos-t4/IMOS/Q9900543.nc

        """

        def expectedOutput = """\
http://data.imos.org.au/IMOS/Q9900542.nc\n\
http://data.imos.org.au/IMOS/Q9900543.nc\n\
http://data.imos.org.au/IMOS/Q9900540.nc\n\
http://data.imos.org.au/IMOS/Q9900541.nc\n\
"""

        def inputStream = new ByteArrayInputStream(input.bytes)
        def outputStream = new ByteArrayOutputStream()

        def sp = controller.urlListStreamProcessor("relativeFilePath", "/mnt/imos-t4", "http://data.imos.org.au")
        sp(inputStream, outputStream)

        def output = outputStream.toString("UTF-8")

        assertEquals expectedOutput, output
    }

    void testCalculateSumStreamProcessorNoProblems() {

        def input = """\
            FID,profile_id,relativeFilePath,size
            aatams_sattag_nrt_wfs.331443,21772,file_a,100
            aatams_sattag_nrt_wfs.331445,21772,file_b,200
            aatams_sattag_nrt_wfs.331441,21772,file_c,300
            aatams_sattag_nrt_wfs.331446,21772,file_d,300
            aatams_sattag_nrt_wfs.331447,21772,file_d,300
            aatams_sattag_nrt_wfs.331442,21772,file_e,400
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
            FID,profile_id,relativeFilePath,size
            aatams_sattag_nrt_wfs.331443,21772,file_a,100
            aatams_sattag_nrt_wfs.331445,21772,file_b,not a number

        """

        def expectedOutput = "-1"

        assertCorrectProcessing(
            controller.calculateSumStreamProcessor("relativeFilePath", "size"),
            input,
            expectedOutput
        )
    }

    static void assertCorrectProcessing(streamProcessor, input, expectedOutput) {

        def inputStream = new ByteArrayInputStream(input.bytes)
        def outputStream = new ByteArrayOutputStream()

        streamProcessor(inputStream, outputStream)

        def output = outputStream.toString("UTF-8")

        assertEquals expectedOutput, output
    }
}
