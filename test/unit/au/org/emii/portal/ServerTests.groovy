package au.org.emii.portal

import org.apache.commons.codec.binary.Base64;

import grails.test.*

class ServerTests extends GrailsUnitTestCase {
    protected void setUp() {
        super.setUp()
    }

    protected void tearDown() {
        super.tearDown()
    }

    void testConstraints() {

		def server1 = new Server(uri : "http://uri1.com", shortAcron : "A1", name : "name1");
		mockForConstraintsTests(Server, [server1])
		
		def testServer = new Server()
		assertFalse testServer.validate()
		assertEquals "nullable", testServer.errors["uri"]
		assertEquals "nullable", testServer.errors["shortAcron"]
		assertEquals "nullable", testServer.errors["name"]
		assertEquals "nullable", testServer.errors["type"]
		assertEquals "nullable", testServer.errors["disable"]
		assertEquals "nullable", testServer.errors["allowDiscoveries"]
		assertEquals "nullable", testServer.errors["opacity"]
		assertEquals "nullable", testServer.errors["imageFormat"]
		
		testServer = new Server(uri : "http://uri1.com", shortAcron : "A1", name : "name1")
		assertFalse testServer.validate()
		assertEquals "unique", testServer.errors["uri"]
		assertEquals "unique", testServer.errors["shortAcron"]
		assertEquals "unique", testServer.errors["name"]
		
		testServer = new Server(type : "WFS-1.0.0")
		assertFalse testServer.validate()
		assertEquals "inList", testServer.errors["type"]
		
		testServer = new Server(uri : "uri1")
		assertFalse testServer.validate()
		assertEquals "url", testServer.errors["uri"]
	}
	

	void testToIdString() {
		def testServer = new Server(uri : "http://uri1.com", shortAcron : "A1", name : "name1")
		assertEquals testServer.toIdString(), "A1" 
	}
	
	void testToString() {
		def testServer = new Server(uri : "http://uri1.com", shortAcron : "A1", name : "name1")
		assertEquals testServer.toString(), "A1"
	}
	
	void testIsCredentialled() {
		def server = new Server()
		
		assertFalse server.isCredentialled()
		
		server.username = "fred"
		assertFalse server.isCredentialled()
		
		server.password = "flintstone"
		assertTrue server.isCredentialled()
		
		server.username = null
		assertFalse server.isCredentialled()
	}
	
	void testCredentialEncoding() {
		def server = new Server()
		server.username = "fred"
		server.password = "flintstone"
		
		assertTrue server.getEncodedCredentials() instanceof String
		assertFalse "${server.username}:${server.password}".equals(server.getEncodedCredentials())
		assertEquals new String(Base64.encodeBase64("fred:flintstone".getBytes())), server.getEncodedCredentials()
	}
}
