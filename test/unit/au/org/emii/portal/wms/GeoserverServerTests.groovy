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
    <downloadOnly>false</downloadOnly>
    <possibleValues/>
  </filter>
  <filter>
    <label>deployment_code</label>
    <name>deployment_code</name>
    <type>String</type>
    <downloadOnly>false</downloadOnly>
    <possibleValues>
      <possibleValue>EAC1-2012</possibleValue>
      <possibleValue>EAC2-2012</possibleValue>
      <possibleValue>EAC3-2012</possibleValue>
      <possibleValue>EAC4-2012</possibleValue>
      <possibleValue>EAC5-2012</possibleValue>
    </possibleValues>
  </filter>
  <filter>
    <label>geom</label>
    <name>geom</name>
    <type>BoundingBox</type>
    <downloadOnly>false</downloadOnly>
    <possibleValues/>
  </filter>
</filters>"""
    }

    void testValidFilters() {
        geoserverServer.metaClass._getFiltersXml = { server, layer -> return validGeoserverResponse }

        def expected = [
            [
                label: "Date (UTC)",
                type: "DateRange",
                name: "TIME",
                downloadOnly: false,
                possibleValues: []
            ],
            [
                label: "deployment_code",
                type: "String",
                name: "deployment_code",
                downloadOnly: false,
                possibleValues: [
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
                downloadOnly: false,
                possibleValues: []
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
}
