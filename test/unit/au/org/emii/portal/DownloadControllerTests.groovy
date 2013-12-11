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

    protected void tearDown() {
        super.tearDown()
    }

    void testUrlListForLayer() {

        def server = new Server(name: 'My Server', uri: "http://www.google.com/", urlListDownloadPrefixToRemove: "/mnt/imos-t4", urlListDownloadPrefixToSubstitue: "http://data.imos.org.au")
        def layer = new Layer(id: 1, name: "The Layer", urlDownloadFieldName: "relativeFilePath", server: server, dataSource: "test data")

        mockDomain Server, [server]
        mockDomain Layer, [layer]

        def performProxyingCalled = false

        controller._performProxying = { paramProcessor, streamProcessor ->

            performProxyingCalled = true

            assertNotNull paramProcessor
            checkParamProcessor paramProcessor

            assertNotNull streamProcessor
            checkUrlListStreamProcessor streamProcessor
        }

        mockParams.layerId = 1
        mockParams.url = "the_url?a=b"

        controller.urlListForLayer()

        assertTrue performProxyingCalled
    }

    def checkParamProcessor = { paramsProcessor ->

        def params = [url: "the_url?a=b"]

        params = paramsProcessor(params)

        assertEquals "the_url?a=b&PROPERTYNAME=relativeFilePath", params.url
    }

    def checkUrlListStreamProcessor = { streamProcessor ->

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

        streamProcessor inputStream, outputStream

        def output = outputStream.toString("UTF-8")

        assertEquals expectedOutput, output
    }
}
