/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.test.ControllerUnitTestCase

class FilterControllerTests extends ControllerUnitTestCase {

    protected void setUp() {
        super.setUp()
    }

    protected void tearDown() {
        super.tearDown()

        Filter.metaClass = null
        FilterType.metaClass = null
    }

    void testDelete() {
        def server1 = new Server()
        server1.id = 1

        def layer1 = new Layer()
        layer1.id = 3
        layer1.server = server1

        def filter1 = new Filter(name: "vesselName", wmsStartDateName: "start_date", wmsEndDateName: "end_date", type: FilterType.String, label: "Vessel Name", possibleValues: ["ship1", "ship2", "ship3"], layer: layer1)
        def filter2 = new Filter(name: "sensorType", wmsStartDateName: "start_date", wmsEndDateName: "end_date", type: FilterType.String, label: "Sensor Type", possibleValues: ["ship1", "ship2", "ship3"], layer: layer1)

        layer1.filters = [filter1, filter2]

        mockDomain(Server, [server1])
        mockDomain(Layer, [layer1])
        mockDomain(Filter, [filter1, filter2])

        println "Before delete"
        println layer1.filters

        filter1.delete(failOnError: true)

        println "After delete"
        println layer1.filters

        assertEquals 1, layer1.filters.size()
        assertEquals 1, Filter.list().size()
    }

    void testTrimFilterPossibleValues() {

        def shortString = "12345"
        def tooLongString = "_________________________________________________50________________________________________________100_______________________________________________150_______________________________________________200_______________________________________________250____"
        def tooLongStringTrimmed = "_________________________________________________50________________________________________________100_______________________________________________150_______________________________________________200_______________________________________________250..."

        def testData = [possibleValues: [shortString, tooLongString]]

        def (firstResult, secondResult) = controller._trimFilterPossibleValues(testData)

        assertEquals shortString, firstResult
        assertEquals tooLongStringTrimmed, secondResult
    }

    void testDeconstructLayerName_NoNamespace() {

        def (namespace, layerName) = controller._deconstructLayerName("argo_float")

        assertNull namespace
        assertEquals "argo_float", layerName
    }

    void testDeconstructLayerName_WithNamespace() {

        def (namespace, layerName) = controller._deconstructLayerName("imos:argo_float")

        assertEquals "imos", namespace
        assertEquals "argo_float", layerName
    }

    void testValidateCredential() {

        def cfg = new Config()
        mockDomain Config, [cfg]

        // Check null-safe
        assertFalse controller._validateCredential("12345")

        cfg.wfsScannerCallbackPassword = "12345"

        // Check wrong password
        assertFalse controller._validateCredential("asdf")

        // Check correct password
        assertTrue controller._validateCredential("12345")
    }

    void testUpdateFiltersForLayer() {

        def testLayer = [:] as Layer
        def testLayerData = [:]
        def updateFilterCallCount = 0
        def filterThatSaves = [
            hasErrors: { false },
            save: { true }
        ]
        def filterThatDoesntSave = [
            save: { false }
        ]
        def filterThatWasntCreated = null

        controller.metaClass._updateFilterWithData = {
            layer, name, newFilterData ->

                updateFilterCallCount++

                // Check arguments
                assertEquals testLayer, layer
                assertEquals testLayerData, newFilterData

                switch (updateFilterCallCount) {
                    case 1:
                        assertEquals "name1", name
                        return filterThatDoesntSave

                    case 2:
                        assertEquals "name2", name
                        return filterThatSaves

                    case 3:
                        assertEquals "name3", name
                        return filterThatWasntCreated

                    default:
                        fail "_updateFilter() should only be called three times."
                }
        }

        def results = controller._updateFiltersForLayer(
            testLayer,
            ['name1': testLayerData, 'name2': testLayerData, 'name3': testLayerData]
        )

        assertEquals 3, updateFilterCallCount
        assertEquals 3, results.size()

        results = results.reverse() // So asserts can happen in the order we expect
        assertEquals "Unable to save filter 'name1'.", results.pop()
        assertEquals "Saved filter 'name2'.", results.pop()
        assertEquals "Unable to save filter 'name3'.", results.pop()
    }

    void testUpdateFilterWithData_LayerExists() {

        def testLayer = [:] as Layer
        def testFilterName = "someCoolFilterName"
        def testFilter = [
            name: testFilterName,
            possibleValues: [],
            type: FilterType.String
        ]
        def testPossibleValues = ["abcd", "defg"]
        def testFilterData = [
            name: "newFilterName",
            type: "int",
            possibleValues: testPossibleValues
        ]

        Filter.metaClass.static.findByLayerAndName = {
            layer, name ->

            assertEquals testLayer, layer
            assertEquals testFilterName, name
            testFilter
        }

        // No possible values to start with
        assertEquals 0, testFilter.possibleValues.size()

        controller._updateFilterWithData(testLayer, testFilterName, testFilterData)

        assertEquals testFilterName, testFilter.name // ie. it hasn't been changed to 'newFilterName'
        assertEquals 2, testFilter.possibleValues.size()
        assertEquals testPossibleValues.first(), testFilter.possibleValues.first()
        assertEquals testPossibleValues.last(), testFilter.possibleValues.last()
    }

    void testUpdateFilterWithData_LayerDoesntExist() {

        def testLayer = [:] as Layer
        def testName = "filterName"
        def testPossibleValues = ["1", "2"]
        def testFilterData = [
            name: "newFilterName",
            type: "string",
            possibleValues: testPossibleValues
        ]
        FilterType.metaClass.static.typeFromString = {
            String s ->

            assertEquals testFilterData.type, s
            return FilterType.String
        }
        Filter.metaClass.static.findByLayerAndName = {
            layer, name ->

            assertEquals testLayer, layer
            assertEquals testName, name
            return null
        }

        def filter = controller._updateFilterWithData(testLayer, testName, testFilterData)

        assertEquals testFilterData.name, filter.name
        assertEquals testFilterData.name, filter.label
        assertEquals testLayer, filter.layer
        assertEquals FilterType.String, filter.type
        assertEquals 2, filter.possibleValues.size()
        assertEquals testPossibleValues.first(), filter.possibleValues.first()
        assertEquals testPossibleValues.last(), filter.possibleValues.last()
    }

    void testUpdateFilterWithData_IgnorePossibleValues() {
        def testLayer = [:] as Layer
        def testName = "filterName"
        def testPossibleValues = ["1", "2"]
        def testFilterData = [
            possibleValues: testPossibleValues
        ]

        FilterType.metaClass.static.typeFromString = {
            return FilterType.String
        }

        Filter.metaClass.static.findByLayerAndName = {
            layer, name ->

            return null
        }

        def filter = controller._updateFilterWithData(testLayer, testName, testFilterData)
        assertEquals(testPossibleValues.size(), filter.possibleValues.size())
    }

    void testUpdateFilterWithData_DoesntIgnorePossibleValues() {
        def testLayer = [:] as Layer
        def testName = "filterName"
        def testPossibleValues = ["1", "2"]
        def testFilterData = [
            possibleValues: testPossibleValues
        ]

        FilterType.metaClass.static.typeFromString = {
            return FilterType.Number
        }

        Filter.metaClass.static.findByLayerAndName = {
            layer, name ->

            return null
        }

        def filter = controller._updateFilterWithData(testLayer, testName, testFilterData)
        assertEquals([], filter.possibleValues)
    }

    void testUpdateFilter_InvalidCredentials() {

        mockParams.filterData = "{}"
        controller.metaClass._validateCredential = { false }

        controller.updateFilter()

        assertEquals "Credentials incorrect", mockResponse.contentAsString
    }

    void testUpdateFilter_LayerExists() {

        def testLayer = [:] as Layer

        mockParams.filterData = """
            {
                "serverHost": "SERVER_URL",
                "layerName": "LAYER_NAME",
                "filters": "FILTERS"
            }
        """
        controller.metaClass._validateCredential = { true }
        controller.metaClass._findLayerWith = {
            a, b ->

                assert "SERVER_URL", a
                assert "LAYER_NAME", b

                return testLayer
        }
        controller.metaClass._updateFiltersForLayer = {
            layer, filters ->

                assertEquals testLayer, layer
                assertEquals "FILTERS", filters

                return ["[Result 1]", "[Result 2]"]
        }

        controller.updateFilter()

        assertEquals "[Result 1] [Result 2]", mockResponse.contentAsString
    }

    void testUpdateFilter_LayerDoesntExists() {

        mockParams.filterData = """
            {
                "serverHost": "SERVER_URL",
                "layerName": "LAYER_NAME"
            }
        """
        controller.metaClass._validateCredential = { true }
        controller.metaClass._findLayerWith = { a, b -> null }

        controller.updateFilter()

        assertEquals "Unable to find Layer on Server SERVER_URL with name LAYER_NAME", mockResponse.contentAsString
    }
}
