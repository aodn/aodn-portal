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
        wms.ImosGeoserverServer.metaClass.getFilters = { server, layer ->
            methodCalled = true
            return []
        }

        this.controller.getFilters()

        // Restore original wms.GeoserverServer class
        wms.ImosGeoserverServer.metaClass = null

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

        controller.configuredLayers()

        assertEquals(String.valueOf(baselayerConfig as JSON), mockResponse.contentAsString)
    }
}
