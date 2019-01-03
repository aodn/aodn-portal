package au.org.emii.portal.wms

import grails.test.GrailsUnitTestCase

class ImosGeoserverServerTests extends GrailsUnitTestCase {

    def imosGeoserverServer
    def validGeoserverResponse
    def filterValuesXml
    def emptyXml

    protected void setUp() {
        super.setUp()

        mockLogging(ImosGeoserverServer)

        imosGeoserverServer = new ImosGeoserverServer(true)

        validGeoserverResponse =
"""<?xml version="1.0"?>
<filters>
  <filter>
    <label>Date (UTC)</label>
    <name>TIME</name>
    <type>DateRange</type>
    <visualised>true</visualised>
    <wmsStartDateName>time_start</wmsStartDateName>
    <wmsEndDateName>time_end</wmsEndDateName>
  </filter>
  <filter>
    <label>deployment_code</label>
    <name>deployment_code</name>
    <type>String</type>
    <visualised>true</visualised>
  </filter>
  <filter>
    <label>geom</label>
    <name>geom</name>
    <type>BoundingBox</type>
    <visualised>true</visualised>
  </filter>
</filters>"""

        filterValuesXml =
"""<?xml version="1.0"?>
<uniqueValues>
  <value>EAC1-2012</value>
  <value>EAC2-2012</value>
  <value>EAC3-2012</value>
  <value>EAC4-2012</value>
  <value>EAC5-2012</value>
</uniqueValues>"""

        emptyXml = """<?xml version="1.0"?>"""
    }

    void testValidFilterValues() {
        imosGeoserverServer.metaClass._getFilterValuesXml = { server, layer, filter -> return filterValuesXml }

        def expected = [
            "EAC1-2012",
            "EAC2-2012",
            "EAC3-2012",
            "EAC4-2012",
            "EAC5-2012"
        ]

        def filterValues = imosGeoserverServer.getFilterValues("http://server", "layer", "some_filter")

        assertEquals expected, filterValues
    }

    void testInvalidFilterValues() {
        imosGeoserverServer.metaClass._getFilterValuesXml = { server, layer, filter -> return "here be invalid xml" }

        def expected = ["bogusfiltervalue"]
        def filterValues = expected
        try {
            filterValues = imosGeoserverServer.getFilterValues("http://server", "layer", "some_filter")
        }
        catch(e) {}
        assertEquals expected, filterValues
    }

    void testValidFilters() {
        imosGeoserverServer.metaClass._getFiltersXml = { server, layer -> return validGeoserverResponse }
        imosGeoserverServer.metaClass._getFilterValuesXml = { server, layer, filter ->
            if (filter == "TIME" || filter == "geom") {
                return emptyXml
            }
            else {
                return filterValuesXml
            }
        }

        def expected = [
            [
                label: "Date (UTC)",
                type: "DateRange",
                name: "TIME",
                visualised: true,
                wmsStartDateName: 'time_start',
                wmsEndDateName: 'time_end'
            ],
            [
                label: "deployment_code",
                type: "String",
                name: "deployment_code",
                visualised: true,
                wmsStartDateName: '',
                wmsEndDateName: ''
            ],
            [
                label: "geom",
                type: "BoundingBox",
                name: "geom",
                visualised: true,
                wmsStartDateName: '',
                wmsEndDateName: ''
            ]
        ]

        def filtersJson = imosGeoserverServer.getFilters("http://server", "layer")
        assertEquals expected, filtersJson
    }

    void testInvalidFilters() {
        imosGeoserverServer.metaClass._getFiltersXml = { server, layer -> return "here be invalid xml" }

        def expected = ["bogusfilter"]
        def filtersJson = expected
        try {
            filtersJson = imosGeoserverServer.getFilters("http://server", "layer")
        }
        catch(e) {}
        assertEquals expected, filtersJson

    }

    void testGetFiltersUrl() {
        def server = "http://geoserver-123.aodn.org.au/geoserver/wms"
        def layer = "aodn:aodn_dsto_glider_trajectory_map"
        assertEquals(
            "http://geoserver-123.aodn.org.au/geoserver/wms?request=enabledFilters&service=layerFilters&version=1.0.0&layer=aodn:aodn_dsto_glider_trajectory_map",
            imosGeoserverServer.getFiltersUrl(server, layer)
        )
    }

    void testGetFilterValuesUrl() {
        def server = "http://geoserver-123.aodn.org.au/geoserver/wms"
        def layer = "aodn:aodn_dsto_glider_trajectory_map"
        def filter = "driftnum"
        assertEquals(
            "http://geoserver-123.aodn.org.au/geoserver/wms?request=uniqueValues&service=layerFilters&version=1.0.0&layer=aodn:aodn_dsto_glider_trajectory_map&propertyName=driftnum",
            imosGeoserverServer.getFilterValuesUrl(server, layer, filter)
        )
    }
}
