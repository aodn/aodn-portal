/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal.wms
import grails.converters.JSON

import grails.test.GrailsUnitTestCase

class GeoserverServerTests extends GrailsUnitTestCase {

    def geoserverServer
    def validGeoserverResponse
    def filterValuesXml
    def emptyXml

    protected void setUp() {
        super.setUp()
        geoserverServer = new GeoserverServer()

        validGeoserverResponse =
"""<?xml version="1.0"?>
<filters>
  <filter>
    <label>Date (UTC)</label>
    <name>TIME</name>
    <type>DateRange</type>
    <visualised>true</visualised>
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
        geoserverServer.metaClass._getFilterValuesXml = { server, layer, filter -> return filterValuesXml }

        def expected = [
            "EAC1-2012",
            "EAC2-2012",
            "EAC3-2012",
            "EAC4-2012",
            "EAC5-2012"
        ]

        def filterValues = geoserverServer.getFilterValues("http://server", "layer", "some_filter")

        assertEquals expected, filterValues
    }

    void testInvalidFilterValues() {
        geoserverServer.metaClass._getFilterValuesXml = { server, layer, filter -> return "here be invalid xml" }

        def expected = []

        def filterValues = geoserverServer.getFilterValues("http://server", "layer", "some_filter")

        assertEquals expected, filterValues
    }

    void testValidFilters() {
        geoserverServer.metaClass._getFiltersXml = { server, layer -> return validGeoserverResponse }
        geoserverServer.metaClass._getFilterValuesXml = { server, layer, filter ->
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
                values: []
            ],
            [
                label: "deployment_code",
                type: "String",
                name: "deployment_code",
                visualised: true,
                values: [
                    "EAC1-2012",
                    "EAC2-2012",
                    "EAC3-2012",
                    "EAC4-2012",
                    "EAC5-2012"
                ]
            ],
            [
                label: "geom",
                type: "BoundingBox",
                name: "geom",
                visualised: true,
                values: []
            ]
        ]

        def filtersJson = geoserverServer.getFilters("http://server", "layer")
        assertEquals expected, filtersJson
    }

    void testInvalidFilters() {
        geoserverServer.metaClass._getFiltersXml = { server, layer -> return "here be invalid xml" }

        def expected = []

        def filtersJson = geoserverServer.getFilters("http://server", "layer")

        assertEquals expected, filtersJson
    }

    void testGetOwsEndpoint() {
        def server = "http://geoserver-123.aodn.org.au/geoserver/wms"
        assertEquals("http://geoserver-123.aodn.org.au/geoserver/ows", geoserverServer.getOwsEndpoint(server))
    }

    void testGetFiltersUrl() {
        def server = "http://geoserver-123.aodn.org.au/geoserver/wms"
        def layer = "aodn:aodn_dsto_glider_trajectory_map"
        assertEquals(
            "http://geoserver-123.aodn.org.au/geoserver/ows?request=enabledFilters&service=layerFilters&version=1.0.0&workspace=aodn&layer=aodn_dsto_glider_trajectory_map",
            geoserverServer.getFiltersUrl(server, layer)
        )
    }

    void testGetFilterValuesUrl() {
        def server = "http://geoserver-123.aodn.org.au/geoserver/wms"
        def layer = "aodn:aodn_dsto_glider_trajectory_map"
        def filter = "driftnum"
        assertEquals(
            "http://geoserver-123.aodn.org.au/geoserver/ows?request=uniqueValues&service=layerFilters&version=1.0.0&workspace=aodn&layer=aodn_dsto_glider_trajectory_map&propertyName=driftnum",
            geoserverServer.getFilterValuesUrl(server, layer, filter)
        )
    }

    void testGetWorkspace() {
        def fullLayerName = "aodn:aodn_dsto_glider_trajectory_map"
        def layerName = geoserverServer.getLayerName(fullLayerName)
        def workspace = geoserverServer.getLayerWorkspace(fullLayerName)

        assertEquals("aodn", workspace)
        assertEquals("aodn_dsto_glider_trajectory_map", layerName)
    }

    void testGetWorkspaceWhenNoWorkspaceSpecified() {
        def fullLayerName = "aodn_dsto_glider_trajectory_map"
        def layerName = geoserverServer.getLayerName(fullLayerName)
        def workspace = geoserverServer.getLayerWorkspace(fullLayerName)

        assertEquals("", workspace)
        assertEquals(fullLayerName, layerName)
    }
}
