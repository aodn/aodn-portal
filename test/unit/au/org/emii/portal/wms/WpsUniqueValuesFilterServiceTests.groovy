package au.org.emii.portal.wms

import grails.test.GrailsUnitTestCase

class WpsUniqueValuesFilterServiceTests extends GrailsUnitTestCase {
    def filterValuesService
    def filterValuesJson

    protected void setUp() {
        super.setUp()

        mockLogging(CoreGeoserverServer)

        filterValuesService = new WpsUniqueValuesFilterService(null, null)

        filterValuesJson =
            '''{
  "values":["ABFR","ADAB","ANHO","AUHO","BRER"],
  "featureTypeName":"feature_type_name",
  "fieldName":"property_name",
  "size":5
}'''
    }

    void testValidFilterValues() {
        filterValuesService.metaClass._getPagedUniqueValues = { layer, filter -> return filterValuesJson}

        def expected = [
            "ABFR",
            "ADAB",
            "ANHO",
            "AUHO",
            "BRER"
        ]

        def filterValues = filterValuesService.getFilterValues("layer", "some_filter")

        assertEquals expected, filterValues
    }

    void testInvalidFilterValues() {
        filterValuesService.metaClass._getPagedUniqueValues = { layer, filter -> return "here be invalid json" }

        def expected = []

        def filterValues = filterValuesService.getFilterValues("layer", "some_filter")

        assertEquals expected, filterValues
    }

}
