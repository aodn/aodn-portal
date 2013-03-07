
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.test.GrailsUnitTestCase
import org.apache.commons.codec.binary.Base64

class ServerTests extends GrailsUnitTestCase {

    protected void setUp() {
        super.setUp()
    }

    protected void tearDown() {
        super.tearDown()
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
