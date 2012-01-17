package au.org.emii.portal

import grails.test.*

class DepthControllerTests extends ControllerUnitTestCase {
    protected void setUp() {
        super.setUp()
    }

    protected void tearDown() {
        super.tearDown()
    }

    void testIndexIncorrectParams() {
		this.controller.index()
		assertTrue this.controller.response.contentAsString.equals("incorrect parameters supplied")
    }
	
	void testIndexServiceUnavailable() {
		this.controller.params.lat = 10
		this.controller.params.lon = 20
		def configControl = mockFor(Config)
		def mockConfig = configControl.createMock()
		configControl.demand.static.activeInstance(1..1) { -> mockConfig}
		configControl.demand.getUseDepthService(1..1) { -> null}
		this.controller.index()
		assertTrue this.controller.response.contentAsString.equals("This service is unavailable")
	}
	
	void testIndex() {
		this.controller.params.lat = 10
		this.controller.params.lon = 20
		def depthServiceConfigControl = mockFor(DepthService)
		depthServiceConfigControl.demand.getNearestDepth(1..1) {Map params -> "depth service text"}
		this.controller.depthService = depthServiceConfigControl.createMock()
		def configControl = mockFor(Config)
		def mockConfig = new Config()
		mockConfig.useDepthService = true;
		configControl.demand.static.activeInstance(1..1) { -> mockConfig}
		this.controller.index()
		configControl.verify()
		assertTrue this.controller.response.contentAsString.equals("depth service text")
	}
	
}
