package au.org.emii.portal.wms

import grails.test.GrailsUnitTestCase

class CoreGeoserverServerTests extends GrailsUnitTestCase {

    def coreGeoserverServer
    def validGeoserverResponse
    def validDescribeLayerResponse

    protected void setUp() {
        super.setUp()

        mockLogging(CoreGeoserverServer)

        coreGeoserverServer = new CoreGeoserverServer(null)

        validGeoserverResponse =
"""<?xml version="1.0" encoding="UTF-8"?><xsd:schema xmlns:gml="http://www.opengis.net/gml" xmlns:imos="imos.mod" xmlns:xsd="http://www.w3.org/2001/XMLSchema" elementFormDefault="qualified" targetNamespace="imos.mod">
  <xsd:import namespace="http://www.opengis.net/gml" schemaLocation="http://geoserver-rc.aodn.org.au/geoserver/schemas/gml/2.1.2/feature.xsd"/>
  <xsd:complexType name="layerType">
    <xsd:complexContent>
      <xsd:extension base="gml:AbstractFeatureType">
        <xsd:sequence>
          <xsd:element maxOccurs="1" minOccurs="0" name="campaign_name" nillable="true" type="xsd:string"/>
          <xsd:element maxOccurs="1" minOccurs="0" name="time_coverage_start" nillable="true" type="xsd:dateTime"/>
          <xsd:element maxOccurs="1" minOccurs="0" name="time_coverage_end" nillable="true" type="xsd:dateTime"/>
          <xsd:element maxOccurs="1" minOccurs="0" name="geom" nillable="true" type="gml:GeometryPropertyType"/>
        </xsd:sequence>
      </xsd:extension>
    </xsd:complexContent>
  </xsd:complexType>
  <xsd:element name="layer" substitutionGroup="gml:_Feature" type="imos:layerType"/>
</xsd:schema>"""

        validDescribeLayerResponse =
'''<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE WMS_DescribeLayerResponse SYSTEM "https://geoserver.aodn.org.au/geoserver/schemas/wms/1.1.1/WMS_DescribeLayerResponse.dtd">
<WMS_DescribeLayerResponse version="1.1.1">
  <LayerDescription name="imos:argo_profile_map" wfs="https://geoserver.aodn.org.au/geoserver/wfs?" owsURL="https://geoserver.aodn.org.au/geoserver/wfs?" owsType="WFS">
    <Query typeName="imos:argo_profile_map"/>
  </LayerDescription>
</WMS_DescribeLayerResponse>
'''
    }

    void testValidFilters() {

        coreGeoserverServer.metaClass._describeFeatureType = { server, layer -> return validGeoserverResponse }
        coreGeoserverServer.metaClass.getLayerInfo = {server, layer -> return [
                owsUrl: "http://server.url",
                owsType: "owsTypo",
                wfsUrl: "http://wfs.server.url",
                typeName: "thetypename"
        ]}

        def expected = [
            [
                label: "campaign name",
                type: "string",
                name: "campaign_name",
                visualised: true
            ],
            [
                label: "Time",
                type: "datetime",
                name: "TIME",
                visualised: true,
                wmsStartDateName: 'time_coverage_start',
                wmsEndDateName: 'time_coverage_end'
            ],
            [
                label: "geom",
                type: "geometrypropertytype",
                name: "geom",
                visualised: true
            ]
        ]

        def filtersJson = coreGeoserverServer.getFilters("http://server", "layer")
        assertEquals expected, filtersJson
    }

    void testInvalidFilters() {
        coreGeoserverServer.metaClass._describeFeatureType = { server, layer -> return "here be invalid xml" }
        coreGeoserverServer.metaClass.getLayerInfo = {server, layer -> return [
                owsType: "owsTypo",
                wfsUrl: "http://wfs.server.url",
                typeName: "thetypename"
        ]}

        def expected = []

        def filtersJson = coreGeoserverServer.getFilters("http://server", "layer")

        assertEquals expected, filtersJson
    }

    void testLookup() {
        def result = coreGeoserverServer.getLayerInfo("http://geoserver-rc.aodn.org.au/geoserver/wms", "imos:argo_profile_map")
        def expected = ["owsType": "WFS", "wfsUrl": "http://geoserver-rc.aodn.org.au/geoserver/wfs?", "typeName": "imos:argo_profile_map"]

        assertEquals(expected, result)
    }
}
