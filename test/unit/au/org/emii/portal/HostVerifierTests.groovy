
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.test.*

class HostVerifierTests extends GrailsUnitTestCase {

	def request
	def verifier

	protected void setUp() {
        super.setUp()
	    _mockServer()
	    _mockConfig()
	    request = new MockRequest()
		verifier = new HostVerifier()
    }

    protected void tearDown() {
        super.tearDown()
	    Server.metaClass = null
	    Config.metaClass = null
    }

    void testHostNotAllowed() {
	    assertFalse(verifier.allowedHost(request, 'http://www.google.com'.toURL()))
    }

	void testHostAllowed() {
		assertTrue(verifier.allowedHost(request, 'http://geoserver.emii.org.au'.toURL()))
	}

	void testAnotherHostAllowed() {
		assertTrue(verifier.allowedHost(request, 'http://geoserver.imos.org.au'.toURL()))
	}

	void testHostInHeaderAllowed() {
		assertTrue(verifier.allowedHost(request, 'http://localhost'.toURL()))
	}

	void testHostInConfigAllowed() {
		verifier.grailsApplication = _mockGrailsApplication(["config", "spatialsearch", "url"], 'http://spatialsearchtest.emii.org.au')
		assertTrue(verifier.allowedHost(request, 'http://spatialsearchtest.emii.org.au'.toURL()))
	}

	void testExternalIndexAllowed() {
		verifier.grailsApplication = _mockGrailsApplication(["config", "portal", "instance", "splash", "index"], 'http://aodnsplash.emii.org.au')
		assertTrue(verifier.allowedHost(request, 'http://aodnsplash.emii.org.au'.toURL()))
	}

	void testExternalLinksAllowed() {
		verifier.grailsApplication = _mockGrailsApplication(["config", "portal", "instance", "splash", "links"], 'http://aodnlinks.emii.org.au')
		assertTrue(verifier.allowedHost(request, 'http://aodnlinks.emii.org.au'.toURL()))
	}

	void testExternalCommunityAllowed() {
		verifier.grailsApplication = _mockGrailsApplication(["config", "portal", "instance", "splash", "community"], 'http://aodncommunity.emii.org.au')
		assertTrue(verifier.allowedHost(request, 'http://aodncommunity.emii.org.au'.toURL()))
	}

	def void _mockServer() {
		Server.metaClass.'static'.list = {
			return [
				new Server([id: 1, uri: 'http://geoserver.emii.org.au']),
				new Server([id: 2, uri: 'http://geoserver.imos.org.au']),
			]
		}
	}

	def _mockConfig() {
		Config.metaClass.'static'.activeInstance = {
			def c = new Config()
			c.catalogUrl = 'http://mest-test.emii.org.au'
			return c
		}
	}

	def _mockGrailsApplication(keys, value) {
		def grailsApplication = new ConfigObject()

		def configObject = grailsApplication
		keys.eachWithIndex { key, i ->
			if (i == keys.size() - 1) {
				configObject."$key" = value
			}
			else {
				configObject."$key" = new ConfigObject()
				configObject = configObject."$key"
			}
		}
		return grailsApplication
	}

	class MockRequest {

		def host

		MockRequest() {
			this('http://localhost')
		}

		MockRequest(host) {
			this.host = host
		}

		def getHeader(header) {
			return host
		}
	}
}
