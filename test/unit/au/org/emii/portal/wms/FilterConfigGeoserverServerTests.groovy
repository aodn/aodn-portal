package au.org.emii.portal.wms

import au.org.emii.portal.UrlUtils
import grails.test.GrailsUnitTestCase

class FilterConfigGeoserverServerTests  extends GrailsUnitTestCase {
    def server
    def validFilterConfig

    protected void setUp() {
        super.setUp()

        mockLogging(FilterConfigGeoserverServer)

        server = new FilterConfigGeoserverServer(null, null)

        validFilterConfig =
            """<?xml version="1.0"?>
<filters>
    <filter>
        <name>data_centre_name</name>
        <type>string</type>
        <label>Data centre name</label>
        <visualised>true</visualised>
        <excludedFromDownload>false</excludedFromDownload>
    </filter>
    <filter>
        <name>platform_number</name>
        <type>string</type>
        <label>Platform Number</label>
        <visualised>true</visualised>
        <excludedFromDownload>false</excludedFromDownload>
    </filter>
    <filter>
        <name>juld</name>
        <type>datetime</type>
        <label>Time</label>
        <visualised>true</visualised>
        <excludedFromDownload>false</excludedFromDownload>
    </filter>
    <filter>
        <name>position</name>
        <type>geometrypropertytype</type>
        <label>Bounding Box</label>
        <visualised>true</visualised>
        <excludedFromDownload>false</excludedFromDownload>
    </filter>
    <filter>
        <name>profile_processing_type</name>
        <type>string</type>
        <label>Realtime/Delayed</label>
        <visualised>true</visualised>
        <excludedFromDownload>false</excludedFromDownload>
    </filter>
</filters>"""

    }

    void testValidFilters() {

        def expected = [[
            label: 'Data centre name',
            type: 'string',
            name: 'data_centre_name',
            visualised: true
        ],[
            label: 'Platform Number',
            type: 'string',
            name: 'platform_number',
            visualised: true
        ],[
            label: 'Time',
            type: 'datetime',
            name: 'juld',
            visualised: true
        ],[
            label: 'Bounding Box',
            type: 'geometrypropertytype',
            name: 'position',
            visualised: true
        ],[
            label: 'Realtime/Delayed',
            type: 'string',
            name: 'profile_processing_type',
            visualised: true
        ]]

        UrlUtils.metaClass.static.load = { url -> validFilterConfig}

        def result = server.getFilters('http://server', 'dummy')

        assertEquals expected, result
    }

    void testInvalidFilters() {

        UrlUtils.metaClass.static.load = { url -> "here be invalid xml" }

        def expected = ["bogusfilter"]
        def filters = expected
        try {
            filters = server.getFilters("http://server", "layer")
        }
        catch(e) {}
        assertEquals expected, filters
    }

}
