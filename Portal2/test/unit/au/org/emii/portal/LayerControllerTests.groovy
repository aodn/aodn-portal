package au.org.emii.portal

import grails.test.*
import org.apache.shiro.*
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
            
        // COMMENTED-OUT AS THIS TEST IS CURRENTLY INCOMPATIBLE WITH THE UserController TESTS. I WILL RESOLVE THE INCOMPATABILITY - DN
        
//		String metadata = '{"metaDataElement": "metaData", "serverUri": "serverUriText"}'
//		this.controller.params.username = "testUserName"
//		this.controller.params.password = "testPassword"
//		this.controller.params.metadata = metadata
//		this.controller.params.layerData = "012345678901234567890123456789001234567890123456789012345678901234567890123456789012345678901234567890123456789"
//		
//		mockDomain(Server, [new Server(id : 10, uri : "serverUriText", shortAcron : "A", name : "name1", type : "WMS-1.1.1", lastScanDate: null, scanFrequency : 0, disable : false, allowDiscoveries : true, opacity : 3, imageFormat : "image/png", comments : "" )])
//
//		def subjectControl = mockFor(org.apache.shiro.subject.Subject)
//		subjectControl.demand.login(1..1) {UsernamePasswordToken authtoken -> }
//		subjectControl.demand.isPermitted(1..1) {String permissionString -> true}
//		def mockSubject = subjectControl.createMock()
//		
//		def securityUtilsControl = mockFor(SecurityUtils)
//		securityUtilsControl.demand.static.getSubject(1..2) { -> mockSubject}
//
//		def mockMetadata = JSON.parse(metadata)
//
//		def JSONControler = mockFor(JSON)
//		JSONControler.demand.static.parse(1..1) {String layerData -> mockMetadata}
//		JSONControler.demand.static.parse(1..1) {String layerData -> mockMetadata}
//				
//		def mockLayer = new Layer()
//		def layerServiceControl = mockFor(LayerService)
//		layerServiceControl.demand.updateWithNewData(1..1) {JSONElement e, Server s, String ds -> mockLayer}
//		this.controller.layerService = layerServiceControl.createMock()
//
//		// the first statement in the _updateLayers method is a bit weird.
//		
//		this.controller.saveOrUpdate()
	}
	
}
