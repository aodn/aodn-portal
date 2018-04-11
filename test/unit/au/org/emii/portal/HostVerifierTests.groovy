package au.org.emii.portal

import grails.test.GrailsUnitTestCase

class HostVerifierTests extends GrailsUnitTestCase {

    def verifier
    def mockConfig

    protected void setUp() {
        super.setUp()
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
        assertFalse(verifier.allowedHost(null))
    }

    void testAddressIsEmptyString() {
        assertFalse(verifier.allowedHost(''))
    }

    void testHostNotAllowed() {
        assertFalse(verifier.allowedHost('http://www.google.com'))
    }

    void testHostAllowed() {
        assertTrue(verifier.allowedHost('http://geoserver.emii.org.au'))
        assertTrue(verifier.allowedHost('http://geoserver.imos.org.au'))
    }

    void testGeonetworkAllowed() {
        assertTrue(verifier.allowedHost('http://geonetwork.aodn.org.au'))
    }

    void testExcludedHost() {
        def devConfig = new ConfigObject()
        def hostVerifier = new HostVerifier()

        hostVerifier.grailsApplication = devConfig

        _addConfig(devConfig, ["config", "geonetwork", "url"], 'http://geonetwork.aodn.org.au/geonetwork')
        _addConfig(devConfig, ["config", "baselayerServer", "uri"], 'http://geoserverstatic.emii.org.au')
        _addConfig(devConfig, ["config", "excludedHosts"], ["geoserver-wps.aodn.org.au"])

        assertTrue(hostVerifier.allowedHost("http://geoserver-123.aodn.org.au/geoserver"))
        assertFalse(hostVerifier.allowedHost("http://geoserver-wps.aodn.org.au/geoserver"))
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

}
