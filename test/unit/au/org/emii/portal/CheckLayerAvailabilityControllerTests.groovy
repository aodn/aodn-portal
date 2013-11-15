/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.test.ControllerUnitTestCase

class CheckLayerAvailabilityControllerTests extends ControllerUnitTestCase {

    void testShow_NoParams() {

        // No params passed-in
        controller.show()

        assertEquals 500, controller.renderArgs.status
        assertEquals "id not supplied or not an integer. id: 'null'", mockResponse.contentAsString
    }

    void testShow_NonIntegerLayerId() {

        controller.params.id = "A"
        controller.show()

        assertEquals 500, controller.renderArgs.status
        assertEquals "id not supplied or not an integer. id: 'A'", mockResponse.contentAsString
    }

    void testShow_LayerIsAlive() {

        controller.params.id = "1"
        controller.checkLayerAvailabilityService = [isLayerAlive: { true }]
        controller.show()

        assertEquals 200, controller.renderArgs.status
        assertEquals "Layer is available", mockResponse.contentAsString
    }

    void testShow_LayerNotAlive() {

        controller.params.id = "2"
        controller.checkLayerAvailabilityService = [isLayerAlive: { false }]
        controller.show()

        assertEquals 500, controller.renderArgs.status
        assertEquals "Layer is not available", mockResponse.contentAsString
    }
}
