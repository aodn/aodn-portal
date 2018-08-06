package au.org.emii.portal.wms

import grails.test.GrailsUnitTestCase

class DataTrawlerServerTests extends GrailsUnitTestCase {

    def dataTrawlerServer
    def validDataTrawlerResponse
    def filterValuesXml
    def filterValuesXml2
    def emptyXml

    protected void setUp() {
        super.setUp()

        mockLogging(DataTrawlerServer)

        dataTrawlerServer = new DataTrawlerServer(true)

        validDataTrawlerResponse =
"""<?xml version="1.0"?>
<filters>
<filter>
<name>Date</name>
<type>datetime</type>
<label>Date</label>
<visualised>true</visualised>
<wmsEndDateName>end_time</wmsEndDateName>
<wmsStartDateName>start_time</wmsStartDateName>
</filter>
<filter>
<name>geom</name>
<type>geometrypropertytype</type>
<label>Bounding Box</label>
<visualised>true</visualised>
<values/>
</filter>
<filter>
<name>vessel</name>
<type>string</type>
<label>Vessel Name</label>
<visualised>true</visualised>
<values>
    <value value="34">Boobie Island</value>
</values>
</filter>
</filters>"""

        filterValuesXml =
"""<?xml version="1.0"?>
<filters>
<filter>
<name>survey_name</name>
<type>string</type>
<label>Survey</label>
<visualised>true</visualised>
<values>
<value>COOK195901</value>
<value>COUR197834</value>
<value>COUR197835</value>
<value>COUR197836</value>
<value>COUR197840</value>
</values>
</filter>
</filters>"""

        emptyXml = """<?xml version="1.0"?>"""
    }

    void testValidFilterValues() {
        dataTrawlerServer.metaClass._getFiltersXml = { server, layer -> return filterValuesXml }

        def expected = [
            "COOK195901",
            "COUR197834",
            "COUR197835",
            "COUR197836",
            "COUR197840"
        ]

        def filterValues = dataTrawlerServer.getFilterValues("http://server", "some_layer", "survey_name")

        assertEquals expected, filterValues
    }

    void testInvalidFilterValues() {
        dataTrawlerServer.metaClass._getFiltersXml = { server, layer -> return "here be invalid xml" }

        def expected = []

        def filterValues = dataTrawlerServer.getFilterValues("http://server", "layer", "some_filter")

        assertEquals expected, filterValues
    }

    void testValidFilters() {
        dataTrawlerServer.metaClass._getFiltersXml = { server, layer -> return validDataTrawlerResponse }

        def expected = [
            [
                label: "Date",
                type: "datetime",
                name: "Date",
                visualised: true,
                wmsStartDateName: 'start_time',
                wmsEndDateName: 'end_time'
            ],
            [
                label: "Bounding Box",
                type: "geometrypropertytype",
                name: "geom",
                visualised: true,
                wmsStartDateName: '',
                wmsEndDateName: ''
            ],
            [
                label: "Vessel Name",
                type: "BoundingBox",
                name: "vessel",
                visualised: true,
                wmsStartDateName: '',
                wmsEndDateName: ''
            ]
        ]

        def filtersJson = dataTrawlerServer.getFilters("http://server", "layer")
        assertEquals expected, filtersJson
    }

    void testInvalidFilters() {
        dataTrawlerServer.metaClass._getFiltersXml = { server, layer -> return "here be invalid xml" }

        def expected = []

        def filtersJson = dataTrawlerServer.getFilters("http://server", "layer")

        assertEquals expected, filtersJson
    }
}
