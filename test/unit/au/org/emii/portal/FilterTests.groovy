package au.org.emii.portal

import grails.test.GrailsUnitTestCase

class FilterTests extends GrailsUnitTestCase {
    protected void setUp() {
        super.setUp()
    }

    protected void tearDown() {
        super.tearDown()
    }

    void testConstraints() {

        // Code review - PM: This isn't wrong or anything but we've stopped writing constraints unit test for domain classes.
        // They are too much work to maintain and they don't really add much (any?) safety
        mockDomain(Filter)

        def filter1 = new Filter(name : "vesselName", type : FilterTypes.STRINGTYPE, label: "Vessel Name", filterValues: "ship 1, ship 2, ship 3");
        mockForConstraintsTests(Filter, [filter1])

        def testFilter = new Filter()
        assertFalse testFilter.validate()
        assertEquals "nullable", testFilter.errors["name"]
        assertEquals "nullable", testFilter.errors["type"]
    }

    void testToJSON(){
        def server1 = new Server()
        server1.id = 1

        def layer1 = new Layer()
        layer1.id = 3
        layer1.server = server1

        def filter1 = new Filter(name: "vesselName", type: FilterTypes.STRINGTYPE, label: "Vessel Name", filterValues: "ship1, ship2, ship3", layer: layer1)

        def expected = [:]
        expected["label"] = "Vessel Name"
        expected["type"] = FilterTypes.STRINGTYPE
        expected["name"] = "vesselName"
        expected["filterValues"] = "ship1, ship2, ship3"
        expected["layerId"] = 3

        assertEquals filter1.toLayerData().toString(), expected.toString()
    }
}
