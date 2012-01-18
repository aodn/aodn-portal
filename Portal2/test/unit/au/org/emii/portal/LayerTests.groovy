package au.org.emii.portal

import grails.test.*

class LayerTests extends GrailsUnitTestCase {
    protected void setUp() {
        super.setUp()
    }

    protected void tearDown() {
        super.tearDown()
    }

    void testConstraints() {

        def layer1 = new Layer(name : "layer1", abstractTrimmed : "description");
        mockForConstraintsTests(Layer, [layer1])

        def testLayer = new Layer()
        assertFalse testLayer.validate()
        assertEquals "nullable", testLayer.errors["name"]
        assertEquals "nullable", testLayer.errors["server"]
        assertEquals "nullable", testLayer.errors["source"]

        assertNotNull testLayer.layers
        assertTrue testLayer.layers.isEmpty()

        testLayer = new Layer(source: "")
        assertFalse testLayer.validate()
        assertEquals "blank", testLayer.errors["source"]
    }
}
