package au.org.emii.portal.wms
import grails.test.GrailsUnitTestCase


class CoreGeoserverUtilsTests extends GrailsUnitTestCase {

    def coreGSUtils
    def validDescribeLayerResponse

    protected void setUp() {
        super.setUp()

        coreGSUtils = new CoreGeoserverUtils()

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

    void testLookup() {
        def describeLayerCalledCount = 0

        CoreGeoserverUtils.metaClass._describeLayer = { server, layer -> describeLayerCalledCount++ ; return validDescribeLayerResponse }

        def result = coreGSUtils._lookupWfs("https://geoserver.aodn.org.au/geoserver/wms", "imos:argo_profile_map")

        assertEquals(1, describeLayerCalledCount) // describeLayer called
        assertEquals(["https://geoserver.aodn.org.au/geoserver/wfs?", "imos:argo_profile_map"], result)

        result = coreGSUtils._lookupWfs("https://geoserver.aodn.org.au/geoserver/wms", "imos:argo_profile_map")
        assertEquals(1, describeLayerCalledCount) // describeLayer not called - cache used
        assertEquals(["https://geoserver.aodn.org.au/geoserver/wfs?", "imos:argo_profile_map"], result)
    }
}
