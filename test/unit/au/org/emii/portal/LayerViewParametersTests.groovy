package au.org.emii.portal

import grails.test.*

class LayerViewParametersTests extends GrailsUnitTestCase {

    def lvp
    
    protected void setUp() {
        super.setUp()

        mockDomain(LayerViewParameters)
        lvp = new LayerViewParameters(layer: new Layer(), centreLat: 12f, centreLon: 34f, openLayersZoomLevel: 5)
    }

    protected void tearDown() {
        super.tearDown()
    }

    void testLayer() {
        assertInvalid("layer", null)
        assertValid("layer", new Layer())
    }

    void testLat() {
        assertInvalid("centreLat", [null, 91f, -91f])
        assertValid("centreLat", [90f, -90f, 0f])
    }

    void testLon() {
        assertInvalid("centreLon", [null, 181f, -181f])
        assertValid("centreLon", [180f, -180f, 0f])
    }

    void testZoomLevel() {
        assertInvalid("openLayersZoomLevel", [null, -1])
        assertValid("openLayersZoomLevel", [0, 1, 20])
    }
    
    void assertInvalid(property, values) {

        assertValid(property, values, false)
    }
    
    void assertValid(property, values, shouldBeValid = true) {

        values.each {
            value ->
                
                try {
                    lvp[property] = value
                    lvp.save(failOnError: true)

                    if (!shouldBeValid) {
                        fail()
                    }
                }
                catch (Exception e) {
                    if (shouldBeValid) {
                        fail()
                    }
                }
        }
    }
}
