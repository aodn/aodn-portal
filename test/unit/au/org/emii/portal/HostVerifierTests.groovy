/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.test.GrailsUnitTestCase

class HostVerifierTests extends GrailsUnitTestCase {

    def request
    def verifier
    def mockConfig

    protected void setUp() {
        super.setUp()
        request = new MockRequest()
        mockConfig = new ConfigObject()
        verifier = new HostVerifier()

        verifier.grailsApplication = mockConfig

        _addConfig(mockConfig, ["config", "geonetwork", "url"], 'http://geonetwork.aodn.org.au/geonetwork')
        _addConfig(mockConfig, ["config", "baselayerServer", "uri"], 'http://geoserverstatic.emii.org.au')

        _addConfig(
            mockConfig,
            ["config", "knownServers"], 
            [
                [ uri: 'http://geoserver.emii.org.au' ],
                [ uri: 'http://geoserver.imos.org.au' ]
            ]
        )
    }

    protected void tearDown() {
        super.tearDown()
    }

    void testAddressIsNull() {
        assertFalse(verifier.allowedHost(request, null))
    }

    void testAddressIsEmptyString() {
        assertFalse(verifier.allowedHost(request, ''))
    }

    void testHostNotAllowed() {
        assertFalse(verifier.allowedHost(request, 'http://www.google.com'))
    }

    void testHostAllowed() {
        assertTrue(verifier.allowedHost(request, 'http://geoserver.emii.org.au'))
        assertTrue(verifier.allowedHost(request, 'http://geoserver.imos.org.au'))
    }

    void testHostInHeaderAllowed() {
        assertTrue(verifier.allowedHost(request, 'http://localhost'))
    }

    void testGeonetworkAllowed() {
        assertTrue(verifier.allowedHost(request, 'http://geonetwork.aodn.org.au'))
    }

    void testExternalIndexAllowed() {
        _addConfig(mockConfig, ["config", "portal", "instance", "splash", "index"], 'http://aodnsplash.emii.org.au')
        assertTrue(verifier.allowedHost(request, 'http://aodnsplash.emii.org.au'))
    }

    void testExternalLinksAllowed() {
        _addConfig(mockConfig, ["config", "portal", "instance", "splash", "links"], 'http://aodnlinks.emii.org.au')
        assertTrue(verifier.allowedHost(request, 'http://aodnlinks.emii.org.au'))
    }

    def _addConfig(configObject, keys, value) {
        keys.eachWithIndex{ key, i ->
            if (i == keys.size() - 1) {
                configObject."$key" = value
            }
            else {
                if (!configObject."$key") {
                    configObject."$key" = new ConfigObject()
                }
                configObject = configObject."$key"
            }
        }
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
