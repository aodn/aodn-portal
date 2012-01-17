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
	

	void testShowServerByItsId() {
		mockDomain(Server, [new Server(id : 10, uri : "uri1", shortAcron : "A", name : "name1", type : "WMS-1.1.1", parseDate: null, parseFrequency : 0, disable : false, allowDiscoveries : true, opacity : 3, imageFormat : "image/png", comments : "" )])
		this.controller.params.serverId = "10_10"
		this.controller.showServerByItsId()
		assertTrue this.controller.response.contentAsString.equals('{"allowDiscoveries":true,"class":"au.org.emii.portal.Server","comments":"","disable":false,"id":10,"imageFormat":"image/png","name":"name1","opacity":3,"parseDate":null,"parseFrequency":0,"shortAcron":"A","type":"WMS-1.1.1","uri":"uri1","version":null}')
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
