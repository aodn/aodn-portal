package au.org.emii.portal

import grails.test.ControllerUnitTestCase

class ProxyControllerTests extends ControllerUnitTestCase {

    def controller

    protected void setUp() {
        super.setUp()

        mockLogging ProxyController

        controller = new ProxyController()
    }

    protected void tearDown() {
        super.tearDown()
    }

    void testUrlList() {

        def server = new Server(name: 'My Server', uri: "http://www.google.com/")
        mockDomain Server, [server]
        def layer = new Layer(id: 1, name: "The Layer", urlDownloadFieldName: "relativeFilePath", server: server, dataSource: "test data")
        mockDomain Layer, [layer]

        def performProxyingCalled = false

        controller._performProxying = { beforeAction, streamProcessor ->

            performProxyingCalled = true

            assertNull beforeAction
            assertNotNull streamProcessor

            checkUrlListStreamProcessor streamProcessor
        }

        mockParams.layerId = 1
        controller.urlList()

        assertTrue performProxyingCalled
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
urlBase/IMOS/Q9900542.nc\n\
urlBase/IMOS/Q9900543.nc\n\
urlBase/IMOS/Q9900540.nc\n\
urlBase/IMOS/Q9900541.nc\n\
"""

        def inputStream = new ByteArrayInputStream(input.bytes)
        def outputStream = new ByteArrayOutputStream()

        streamProcessor inputStream, outputStream

        def output = outputStream.toString("UTF-8")

        assertEquals expectedOutput, output
    }
}
