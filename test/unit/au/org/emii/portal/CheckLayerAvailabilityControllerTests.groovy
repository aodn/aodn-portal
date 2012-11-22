
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.test.ControllerUnitTestCase

class CheckLayerAvailabilityControllerTests extends ControllerUnitTestCase {

    protected void setUp() {

        super.setUp()
    }

    protected void tearDown() {

        super.tearDown()
    }

    void testIndex_NoParams() {

        // No params passed-in
        controller.index()

        assertEquals 500, controller.renderArgs.status
        assertEquals "layerId not supplied or not an integer. layerId: 'null'", mockResponse.contentAsString
	}

    void testIndex_NonIntegerLayerId() {

        controller.params.layerId = "A"
        controller.index()

        assertEquals 500, controller.renderArgs.status
        assertEquals "layerId not supplied or not an integer. layerId: 'A'", mockResponse.contentAsString
    }

    void testIndex_LayerIsAlive() {

        controller.params.layerId = "1"
        controller.checkLayerAvailabilityService = [ isLayerAlive: { true } ]
        controller.index()

        assertEquals 200, controller.renderArgs.status
        assertEquals "", mockResponse.contentAsString
    }

    void testIndex_LayerNotAlive() {

        controller.params.layerId = "2"
        controller.checkLayerAvailabilityService = [ isLayerAlive: { false } ]
        controller.index()

        assertEquals 500, controller.renderArgs.status
        assertEquals "", mockResponse.contentAsString
    }
}
