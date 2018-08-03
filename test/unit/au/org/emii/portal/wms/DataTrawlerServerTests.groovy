package au.org.emii.portal.wms

import grails.test.GrailsUnitTestCase

class DataTrawlerServerTests extends GrailsUnitTestCase {

    def dataTrawlerServer
    def validResponse
    def filterValuesJson
    def emptyJson
    def groovyPageRenderer

    protected void setUp() {
        super.setUp()

        mockLogging(DataTrawlerServer)

        dataTrawlerServer = new DataTrawlerServer(groovyPageRenderer)

        validResponse =
            """<?xml version="1.0" encoding="UTF-8"?><xsd:schema xmlns:gml="http://www.opengis.net/gml" xmlns:imos="imos.mod" xmlns:xsd="http://www.w3.org/2001/XMLSchema" elementFormDefault="qualified" targetNamespace="imos.mod">
  <xsd:import namespace="http://www.opengis.net/gml" schemaLocation="http://geoserver-rc.aodn.org.au/geoserver/schemas/gml/2.1.2/feature.xsd"/>
  <xsd:complexType name="layerType">
    <xsd:complexContent>
      <xsd:extension base="gml:AbstractFeatureType">
        <xsd:sequence>
          <xsd:element maxOccurs="1" minOccurs="0" name="voyage_name" nillable="true" type="xsd:string"/>
          <xsd:element maxOccurs="1" minOccurs="0" name="TIME_COVERAGE_START" nillable="true" type="xsd:dateTime"/>
          <xsd:element maxOccurs="1" minOccurs="0" name="TIME_COVERAGE_END" nillable="true" type="xsd:dateTime"/>
          <xsd:element maxOccurs="1" minOccurs="0" name="geom" nillable="true" type="gml:GeometryPropertyType"/>
        </xsd:sequence>
      </xsd:extension>
    </xsd:complexContent>
  </xsd:complexType>
  <xsd:element name="layer" substitutionGroup="gml:_Feature" type="csiro:layerType"/>
</xsd:schema>"""

        filterValuesJson =
            '''{
  "values":["alpha","beta","kappa","omega"],
  "featureTypeName":"feature_type_name",
  "fieldName":"property_name",
  "size":5
}'''

        emptyJson =
            '''{
  "values":[],
  "featureTypeName":"feature_type_name",
  "fieldName":"property_name",
  "size":0
}'''
    }

    void testValidFilterValues() {
        CoreGeoserverUtils.metaClass._getPagedUniqueValues = { server, layer, filter, renderer -> return filterValuesJson }

        def expected = [
            "alpha",
            "beta",
            "kappa",
            "omega"
        ]

        def filterValues = dataTrawlerServer.getFilterValues("http://server", "layer", "some_filter")

        assertEquals expected, filterValues
    }

    void testInvalidFilterValues() {
        CoreGeoserverUtils.metaClass._getPagedUniqueValues = { server, layer, filter, renderer -> return "here be invalid json" }

        def expected = []

        def filterValues = dataTrawlerServer.getFilterValues("http://server", "layer", "some_filter")

        assertEquals expected, filterValues
    }

    void testValidFilters() {
        CoreGeoserverUtils.metaClass._describeFeatureType = { server, layer -> return validResponse }

        def expected = [
            [
                label: "Voyage name",
                type: "string",
                name: "voyage_name",
                visualised: true
            ],
            [
                label: "Time",
                type: "datetime",
                name: "TIME",
                visualised: true,
                wmsStartDateName: 'TIME_COVERAGE_START',
                wmsEndDateName: 'TIME_COVERAGE_END'
            ],
            [
                label: "Geom",
                type: "geometrypropertytype",
                name: "geom",
                visualised: true
            ]
        ]

        def filtersJson = dataTrawlerServer.getFilters("http://server", "layer")
        assertEquals expected, filtersJson
    }

    void testInvalidFilters() {
        CoreGeoserverUtils.metaClass._describeFeatureType = { server, layer -> return "here be invalid xml" }

        def expected = []

        def filtersJson = dataTrawlerServer.getFilters("http://server", "layer")

        assertEquals expected, filtersJson
    }
}
