
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

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

		mockDomain(Layer)
		
        def layer1 = new Layer(name : "layer1", abstractTrimmed : "description");
        mockForConstraintsTests(Layer, [layer1])

        def testLayer = new Layer()
        assertFalse testLayer.validate()
        assertEquals "nullable", testLayer.errors["server"]
        assertEquals "nullable", testLayer.errors["dataSource"]

		//This constraint is managed 
		//in the getLayers() method, since layers is transient
        assertNotNull testLayer.layers
        assertTrue testLayer.layers.isEmpty()

        testLayer = new Layer(dataSource: "")
        assertFalse testLayer.validate()
        assertEquals "blank", testLayer.errors["dataSource"]
    }
}
