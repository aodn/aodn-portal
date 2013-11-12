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
        def layer = new Layer(id: 1, name: "The Layer", urlDownloadFieldName: "device_wmo_ref", server: server, dataSource: "test data")
        mockDomain Layer, [layer]

        def performProxyingCalled = false

        controller._performProxying = { beforeAction, streamProcessor ->

            performProxyingCalled = true

            assertNull beforeAction
            assertNotNull streamProcessor

            checkUniqueListStreamProcessor streamProcessor
        }

        mockParams.layerId = 1
        controller.urlList()

        assertTrue performProxyingCalled
    }

    def checkUniqueListStreamProcessor = { streamProcessor ->

        def input = """\
            FID,profile_id,device_wmo_ref
            aatams_sattag_nrt_wfs.331443,21772,Q9900542
            aatams_sattag_nrt_wfs.331445,21772,Q9900543
            aatams_sattag_nrt_wfs.331441,21772,Q9900540
            aatams_sattag_nrt_wfs.331442,21772,Q9900541
            aatams_sattag_nrt_wfs.331443,21772,Q9900542
            aatams_sattag_nrt_wfs.331445,21772,Q9900543

        """

        def expectedOutput = "Q9900542\nQ9900543\nQ9900540\nQ9900541\n"

        def inputStream = new ByteArrayInputStream(input.bytes)
        def outputStream = new ByteArrayOutputStream()

        streamProcessor inputStream, outputStream

        def output = outputStream.toString("UTF-8")

        assertEquals expectedOutput, output
    }
}
