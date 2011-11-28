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

		def layer1 = new Layer(name : "layer1", description : "description");
		mockForConstraintsTests(Layer, [layer1])
		
		def testLayer = new Layer()
		assertFalse testLayer.validate()
		assertEquals "nullable", testLayer.errors["name"]
		assertEquals "nullable", testLayer.errors["disabled"]
		assertEquals "nullable", testLayer.errors["description"]
		assertEquals "nullable", testLayer.errors["server"]
		assertEquals "nullable", testLayer.errors["cache"]
		assertEquals "nullable", testLayer.errors["opacity"]
		assertEquals "nullable", testLayer.errors["layers"]
		assertEquals "nullable", testLayer.errors["imageFormat"]
		assertEquals "nullable", testLayer.errors["queryable"]
		assertEquals "nullable", testLayer.errors["isBaseLayer"]
                assertEquals "nullable", testLayer.errors["source"]
		
		testLayer = new Layer(description: "")
		assertFalse testLayer.validate()
		assertEquals "blank", testLayer.errors["description"]
		
                testLayer = new Layer(source: "")
		assertFalse testLayer.validate()
		assertEquals "blank", testLayer.errors["source"]
        
		testLayer = new Layer(imageFormat : "image/jpg")
		assertFalse testLayer.validate()
		assertEquals "inList", testLayer.errors["imageFormat"]
    }
}
