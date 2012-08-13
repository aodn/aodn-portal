package au.org.emii.portal

import grails.test.*

class CheckLayerAvailabilityControllerTests extends ControllerUnitTestCase {
	
	def CheckLayerService
	
    protected void setUp() {
        super.setUp()
		
    }

    protected void tearDown() {
        super.tearDown()
    }

    void testIndex_NoParams() {
		controller.index() // with no supplied and required params
		assertEquals(500, controller.renderArgs.status)
	}
}
