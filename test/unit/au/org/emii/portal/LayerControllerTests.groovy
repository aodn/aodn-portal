/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.converters.JSON
import grails.test.ControllerUnitTestCase
import org.codehaus.groovy.grails.web.json.JSONElement

class LayerControllerTests extends ControllerUnitTestCase {

    def messageArgs
    def hostVerifier

    protected void setUp() {
        super.setUp()

        controller.metaClass.message = { LinkedHashMap args -> messageArgs = args }
        controller.metaClass._recache = {}
        hostVerifier = mockFor(HostVerifier)
        hostVerifier.demand.allowedHost { request, address -> return true }
        controller.hostVerifier = hostVerifier.createMock()
    }

    // TODO should be tested
    /*void testGetFiltersAsJson() {
        def server1 = new Server()
        server1.id = 1

        def layer1 = new Layer()
        layer1.id = 3
        layer1.server = server1

        def filter1 = new Filter(name: "vesselName", wmsStartDateName: "start_date", wmsEndDateName: "end_date", type: FilterType.String, label: "Vessel Name", possibleValues: ["ship1", "ship2", "ship3"], layer: layer1, enabled: true, downloadOnly: false)
        def filter2 = new Filter(name: "voyage dates", wmsStartDateName: "start_date", wmsEndDateName: "end_date",  type: FilterType.Date, label: "Voyage Dates", possibleValues: [], layer: layer1, enabled: true, downloadOnly: true)
        def filter3 = new Filter(name: "disabled filter", wmsStartDateName: "start_date", wmsEndDateName: "end_date",  type: FilterType.String, label: "Sensor Type", possibleValues: ["type1", "type2"], layer: layer1, enabled: false, downloadOnly: false)
        def filter4 = new Filter(name: "numberFilter", wmsStartDateName: "start_date", wmsEndDateName: "end_date",  type: FilterType.Number, label: "numberFilter", possibleValues: [], layer: layer1, enabled: true, downloadOnly: false)

        layer1.filters = [filter1, filter2, filter3, filter4]

        mockDomain(Server, [server1])
        mockDomain(Layer, [layer1])
        mockDomain(Filter, [filter1, filter2, filter3])

        //test layer with filters
        this.controller.params.layerId = 3
        this.controller.getFiltersAsJSON()

        def response = this.controller.response.contentAsString

        def expected = """[\
{"label":"numberFilter","type":"Number","name":"numberFilter","wmsStartDateName":"start_date","wmsEndDateName":"end_date","layerId":3,"enabled":true,"possibleValues":[],"downloadOnly":false},\
{"label":"Vessel Name","type":"String","name":"vesselName","wmsStartDateName":"start_date","wmsEndDateName":"end_date","layerId":3,"enabled":true,"possibleValues":["ship1","ship2","ship3"],"downloadOnly":false},\
{"label":"Voyage Dates","type":"Date","name":"voyage dates","wmsStartDateName":"start_date","wmsEndDateName":"end_date","layerId":3,"enabled":true,"possibleValues":[],"downloadOnly":true}\
]"""

        assertEquals expected, response // Validates encoding, ordering and only including 'enabled' filters
    }*/

    void testGetFiltersAsJsonNcWMS() {
        this.controller.params.serverType = 'ncwms'
        this.controller.params.server = 'some_server'
        this.controller.params.layer = 'some_layer'

        def methodCalled = false
        wms.NcwmsServer.metaClass.getFilters = { server, layer ->
            methodCalled = true
            return []
        }

        this.controller.getFiltersAsJSON()

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

        this.controller.getStylesAsJSON()

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

        controller.metaClass.grailsApplication = new ConfigObject()
        controller.grailsApplication.config.geonetwork.url = "http://geonetwork.com"

        def uuid = "some_uuid"
        def url = controller._getMetadataUrl(uuid)

        assertEquals(url, "http://geonetwork.com/srv/eng/xml_iso19139.mcp?styleSheet=xml_iso19139.mcp.xsl&uuid=some_uuid")
    }
}
