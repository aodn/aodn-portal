package au.org.emii.portal

import grails.test.*

class ServerTests extends GrailsUnitTestCase {
    protected void setUp() {
        super.setUp()
    }

    protected void tearDown() {
        super.tearDown()
    }

    void testConstraints() {

		def server1 = new Server(uri : "uri1", shortAcron : "A1", name : "name1");
		mockForConstraintsTests(Server, [server1])
		
		def testServer = new Server()
		assertFalse testServer.validate()
		assertEquals "nullable", testServer.errors["uri"]
		assertEquals "nullable", testServer.errors["shortAcron"]
		assertEquals "nullable", testServer.errors["name"]
		assertEquals "nullable", testServer.errors["type"]
		assertEquals "nullable", testServer.errors["parseDate"]
		assertEquals "nullable", testServer.errors["parseFrequency"]
		assertEquals "nullable", testServer.errors["disable"]
		assertEquals "nullable", testServer.errors["allowDiscoveries"]
		assertEquals "nullable", testServer.errors["opacity"]
		assertEquals "nullable", testServer.errors["imageFormat"]
		
		testServer = new Server(uri : "uri1", shortAcron : "A1", name : "name1")
		assertFalse testServer.validate()
		assertEquals "unique", testServer.errors["uri"]
		assertEquals "unique", testServer.errors["shortAcron"]
		assertEquals "unique", testServer.errors["name"]
		
		testServer = new Server(type : "WFS-1.0.0")
		assertFalse testServer.validate()
		assertEquals "inList", testServer.errors["type"]
    }

	void testToIdString() {
		def testServer = new Server(uri : "uri1", shortAcron : "A1", name : "name1")
		assertEquals testServer.toIdString(), "A1" 
	}
	
	void testToString() {
		def testServer = new Server(uri : "uri1", shortAcron : "A1", name : "name1")
		assertEquals testServer.toString(), "A1"
	}
}
