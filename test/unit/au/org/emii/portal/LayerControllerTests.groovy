package au.org.emii.portal

import grails.test.*
import org.apache.shiro.*
import org.apache.shiro.subject.*
import org.apache.shiro.authc.*
import org.codehaus.groovy.grails.web.json.JSONElement
import grails.converters.deep.JSON

class LayerControllerTests extends ControllerUnitTestCase {
    protected void setUp() {
        super.setUp()
    }

    protected void tearDown() {
        super.tearDown()
    }

    void testIndex() {
            this.controller.index()
            assertEquals "list", this.controller.redirectArgs["action"]
    }

    void testSaveOrUpdate() {
        
        String metadata = '{metaDataElement: "metaData", serverUri: "serverUriText", dataSource:"testDataSource"}'
        this.controller.params.username = "testUserName"
        this.controller.params.password = "testPassword"
        this.controller.params.metadata = metadata
        this.controller.params.layerData = "012345678901234567890123456789001234567890123456789012345678901234567890123456789012345678901234567890123456789"

        def server = new Server(id : 10, uri : "serverUriText", shortAcron : "A", name : "name1", type : "WMS-1.1.1", lastScanDate: null, scanFrequency : 0, disable : false, allowDiscoveries : true, opacity : 3, imageFormat : "image/png", comments : "" )
        mockDomain Server, [server]

        def mockSubject = [ getPrincipal: { "sys.admin@emii.org.au" },
                            isPermitted: { true },
                            toString: { return "mockSubject" },
                            login: { UsernamePasswordToken authtoken -> }
                          ] as Subject

        def securityUtilsControl = mockFor(SecurityUtils)
        securityUtilsControl.demand.static.getSubject(2..2) { -> mockSubject}

        def mockMetadata = JSON.parse(metadata)

        def JSONControler = mockFor(JSON)
        JSONControler.demand.static.parse(2..2) {String layerData -> mockMetadata}

        def mockLayer = new Layer()
        def layerServiceControl = mockFor(LayerService)
        layerServiceControl.demand.updateWithNewData(1..1) { JSONElement e, Server s, String ds -> mockLayer }
        this.controller.layerService = layerServiceControl.createMock()

        this.controller.saveOrUpdate()
        
        assertNotNull "Server should now have a lastScanDate", server.lastScanDate
        
        assertEquals "Response text should match", "Complete (saved)", controller.response.contentAsString
    }
}