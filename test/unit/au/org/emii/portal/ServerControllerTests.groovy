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
        mockDomain(Server, [new Server(id : 10, uri : "uri1", shortAcron : "A", name : "name1", type : "WMS-1.1.1", lastScanDate: null, scanFrequency: 0, disable: false, allowDiscoveries : true, opacity : 3, imageFormat : "image/png", comments : "" )])
        this.controller.params.serverId = "10_10"
        this.controller.showServerByItsId()
        assertEquals '{"allowDiscoveries":true,"class":"au.org.emii.portal.Server","comments":"","disable":false,"id":10,"imageFormat":"image/png","lastScanDate":null,"name":"name1","opacity":3,"scanFrequency":0,"shortAcron":"A","type":"WMS-1.1.1","uri":"uri1","version":null}', this.controller.response.contentAsString
    }
	
    void testCheckForBrokenLinks() {
        def checkLinksServiceControl = mockFor(CheckLinksService)
        checkLinksServiceControl.demand.check(1..1) {String serverId -> "Result string"}
        this.controller.checkLinksService = checkLinksServiceControl.createMock()
        this.controller.params.server = "10"
        this.controller.checkForBrokenLinks()
        assertEquals "Result string", this.controller.response.contentAsString
    }
}
