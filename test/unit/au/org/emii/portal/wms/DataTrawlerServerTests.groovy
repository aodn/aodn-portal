package au.org.emii.portal.wms

import grails.test.GrailsUnitTestCase

class DataTrawlerServerTests extends GrailsUnitTestCase {

    def dataTrawlerServer
    def validResponse
    def groovyPageRenderer
    def validResponseWithNonVisualised

    protected void setUp() {
        super.setUp()

        mockLogging(DataTrawlerServer)

        dataTrawlerServer = new DataTrawlerServer(groovyPageRenderer)

        validResponse =
            """<?xml version="1.0"?>
<filters>
  <filter>
    <name>geom</name>
    <type>geometrypropertytype</type>
    <label>Bounding Box</label>
    <visualised>true</visualised>
   </filter>
  <filter>
    <name>source</name>
    <type>string</type>
    <label>Ship</label>
    <visualised>true</visualised>
    <excludedFromDownload>false</excludedFromDownload>
  </filter>
  <filter>
    <name>survey</name>
    <type>string</type>
    <label>Voyage</label>
    <visualised>true</visualised>
    <excludedFromDownload>false</excludedFromDownload>
  </filter>
  <filter>
    <name>time</name>
    <type>timestamp</type>
    <label>Time (UTC)</label>
    <visualised>true</visualised>
    <excludedFromDownload>false</excludedFromDownload>
    <wmsStartDateName>time_coverage_start</wmsStartDateName>
    <wmsEndDateName>time_coverage_end</wmsEndDateName>
  </filter>
  <filter>
    <name>max_depth</name>
    <type>numeric</type>
    <label>Cast depth</label>
    <visualised>true</visualised>
    <excludedFromDownload>false</excludedFromDownload>
  </filter>
</filters>"""

        validResponseWithNonVisualised =
            """<?xml version="1.0"?>
<filters>
  <filter>
    <name>geom</name>
    <type>geometrypropertytype</type>
    <label>Bounding Box</label>
    <visualised>true</visualised>
   </filter>
  <filter>
    <name>source</name>
    <type>string</type>
    <label>Ship</label>
    <visualised>true</visualised>
    <excludedFromDownload>false</excludedFromDownload>
  </filter>
  <filter>
    <name>survey</name>
    <type>string</type>
    <label>Voyage</label>
    <visualised>true</visualised>
    <excludedFromDownload>false</excludedFromDownload>
  </filter>
  <filter>
    <name>time</name>
    <type>timestamp</type>
    <label>Time (UTC)</label>
    <visualised>true</visualised>
    <excludedFromDownload>false</excludedFromDownload>
    <wmsStartDateName>time_coverage_start</wmsStartDateName>
    <wmsEndDateName>time_coverage_end</wmsEndDateName>
  </filter>
  <filter>
    <name>max_depth</name>
    <type>numeric</type>
    <label>Cast depth</label>
    <visualised>false</visualised>
    <excludedFromDownload>false</excludedFromDownload>
  </filter>
</filters>"""
    }

    void testValidFilters() {
        dataTrawlerServer.metaClass._getFiltersXml = { server, layer -> return validResponse }

        def expected = [
            [
                label: "Bounding Box",
                type: "geometrypropertytype",
                name: "geom",
                visualised: true
            ],
            [
                label: "Ship",
                type: "string",
                name: "source",
                visualised: true
            ],
            [
                label: "Voyage",
                type: "string",
                name: "survey",
                visualised: true
            ],
            [
                label: "Time (UTC)",
                type: "timestamp",
                name: "time",
                visualised: true,
                wmsStartDateName: 'TIME_COVERAGE_START',
                wmsEndDateName: 'TIME_COVERAGE_END'
            ],
            [
                label: "Cast depth",
                type: "numeric",
                name: "max_depth",
                visualised: true
            ]
        ]

        def filtersJson = dataTrawlerServer.getFilters("http://server", "layer")
        assertEquals expected, filtersJson
    }

    void testValidFiltersWithNonVisualised() {
        dataTrawlerServer.metaClass._getFiltersXml = { server, layer -> return validResponseWithNonVisualised }

        def expected = [
            [
                label: "Bounding Box",
                type: "geometrypropertytype",
                name: "geom",
                visualised: true
            ],
            [
                label: "Ship",
                type: "string",
                name: "source",
                visualised: true
            ],
            [
                label: "Voyage",
                type: "string",
                name: "survey",
                visualised: true
            ],
            [
                label: "Time (UTC)",
                type: "timestamp",
                name: "time",
                visualised: true,
                wmsStartDateName: 'TIME_COVERAGE_START',
                wmsEndDateName: 'TIME_COVERAGE_END'
            ]
        ]

        def filtersJson = dataTrawlerServer.getFilters("http://server", "layer")
        assertEquals expected, filtersJson
    }

    void testInvalidFilters() {
        dataTrawlerServer.metaClass._getFiltersXml = { server, layer -> return "yucky invalid xml" }

        def expected = []

        def filtersJson = dataTrawlerServer.getFilters("http://server", "layer")

        assertEquals expected, filtersJson
    }
}
