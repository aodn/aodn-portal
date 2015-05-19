/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.converters.JSON
import grails.test.ControllerUnitTestCase

class LayerControllerTests extends ControllerUnitTestCase {

    def messageArgs
    def hostVerifier

    protected void setUp() {
        super.setUp()

        controller.metaClass.message = { LinkedHashMap args -> messageArgs = args }
        controller.metaClass._recache = {}
        hostVerifier = mockFor(HostVerifier)
        hostVerifier.demand.allowedHost { address -> return true }
        controller.hostVerifier = hostVerifier.createMock()

        controller.grailsApplication = new ConfigObject()
    }

    void testGetFiltersAsJsonGeoserver() {
        this.controller.params.server = 'some_server'
        this.controller.params.layer = 'some_layer'

        def methodCalled = false
        wms.GeoserverServer.metaClass.getFilters = { server, layer ->
            methodCalled = true
            return []
        }

        this.controller.getFilters()

        // Restore original wms.GeoserverServer class
        wms.GeoserverServer.metaClass = null

        assertTrue methodCalled
    }

    void testGetFiltersAsJsonNcWMS() {
        this.controller.params.serverType = 'ncwms'
        this.controller.params.server = 'some_server'
        this.controller.params.layer = 'some_layer'

        def methodCalled = false
        wms.NcwmsServer.metaClass.getFilters = { server, layer ->
            methodCalled = true
            return []
        }

        this.controller.getFilters()

        // Restore original wms.NcwmsServer class
        wms.NcwmsServer.metaClass = null

        assertTrue methodCalled
    }

    void testGetSylesAsJsonNcWMS() {
        this.controller.params.serverType = 'ncwms'
        this.controller.params.server = 'some_server'
        this.controller.params.layer = 'some_layer'

        def methodCalled = false
        wms.NcwmsServer.metaClass.getStyles = { server, layer ->
            methodCalled = true
            return []
        }

        this.controller.getStyles()

        // Restore original wms.NcwmsServer class
        wms.NcwmsServer.metaClass = null

        assertTrue methodCalled
    }

    void testApplicationXmlIsXmlContent() {
        if (!controller._isXmlContent("application/xml")) {
            fail()
        }
    }

    void testTextXmlIsXmlContent() {
        if (!controller._isXmlContent("text/xml")) {
            fail()
        }
    }

    void testTextPlainIsNotXmlContent() {
        if (controller._isXmlContent("text/plain")) {
            fail()
        }
    }

    void testTextHtmlIsNotXmlContent() {
        if (controller._isXmlContent("text/html")) {
            fail()
        }
    }

    void testExtractCharsetWithNoFollowingStatement() {
        def testHeader = "application/xml;charset=UTF-8"
        assertEquals("UTF-8", controller._extractCharsetType(testHeader))
    }

    void testExtractCharsetWithFollowingStatement() {
        def testHeader = "application/xml;charset=UTF-8;value=somethingextra"
        assertEquals("UTF-8", controller._extractCharsetType(testHeader))
    }

    void testExtractCharsetWithNoPrefixStatement() {
        def testHeader = "charset=UTF-8;value=somethingextra"
        assertEquals("UTF-8", controller._extractCharsetType(testHeader))
    }

    void testConfiguredBaselayers() {
        def baselayerConfig = [
            [name: 'layer one'],
            [name: 'layer two']
        ]

        controller.metaClass.grailsApplication = [
            config: [
                baselayers: baselayerConfig
            ]
        ]

        controller.configuredBaselayers()

        assertEquals(String.valueOf(baselayerConfig as JSON), mockResponse.contentAsString)
    }

    void testMetadataUrlConstruction() {
        controller.grailsApplication.config.geonetwork.url = "http://geonetwork.com"

        def uuid = "some_uuid"
        def url = controller._getMetadataUrl(uuid)

        assertEquals(url, "http://geonetwork.com/srv/eng/xml_iso19139.mcp?styleSheet=xml_iso19139.mcp.xsl&uuid=some_uuid")
    }
}
