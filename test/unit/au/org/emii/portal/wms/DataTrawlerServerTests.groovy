package au.org.emii.portal.wms

import grails.test.GrailsUnitTestCase

class DataTrawlerServerTests extends GrailsUnitTestCase {

    def dataTrawlerServer
    def validResponse
    protected void setUp() {
        super.setUp()

        mockLogging(DataTrawlerServer)

        dataTrawlerServer = new DataTrawlerServer(null)

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
    }

    void testValidFilters() {
        dataTrawlerServer.metaClass._describeFeatureType = { server, layer -> return validResponse }
        dataTrawlerServer.metaClass.getLayerInfo = {server, layer -> return [
                owsUrl: "http://server.url",
                owsType: "owsTypo",
                wfsUrl: "http://wfs.server.url",
                typeName: "thetypename"
        ]}

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
        dataTrawlerServer.metaClass._describeFeatureType = { server, layer -> return "here be invalid xml" }

        def expected = []

        def filtersJson = dataTrawlerServer.getFilters("http://server", "layer")

        assertEquals expected, filtersJson
    }
}