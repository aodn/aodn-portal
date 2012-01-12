package au.org.emii.portal

import grails.test.*

class ServerControllerTests extends ControllerUnitTestCase {
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
	
	void testList() {
		
		
		
	}
	
    void testCheckForBrokenLinks() {
		def checkLinksServiceControl = mockFor(CheckLinksService)
		checkLinksServiceControl.demand.check(1..1) {String serverId -> "Result string"}
		this.controller.checkLinksService = checkLinksServiceControl.createMock()
		this.controller.params.server = "10"
		this.controller.checkForBrokenLinks()
		assertTrue this.controller.response.contentAsString.equals("Result string")
    }
}
