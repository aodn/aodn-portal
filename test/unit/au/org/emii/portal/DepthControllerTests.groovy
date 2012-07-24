package au.org.emii.portal

import grails.test.ControllerUnitTestCase

class DepthControllerTests extends ControllerUnitTestCase {

    protected void setUp() {
        super.setUp()
    }

    protected void tearDown() {
        super.tearDown()
    }

    void testIndexIncorrectParams() {

        controller.index()

        assertEquals "Incorrect parameters supplied", this.controller.response.contentAsString
    }
	
	void testIndexServiceUnavailable() {

        controller.params.lat = 10
		controller.params.lon = 20

		controller._generateServiceUrl = { -> null }

        controller.index()

        assertEquals "This service is unavailable", this.controller.response.contentAsString
	}
	
	void testIndex() {

        controller.params.lat = 10
		controller.params.lon = 20

        controller._generateServiceUrl = { -> [text: "depth service text"] }

		controller.index()

        assertEquals "depth service text", this.controller.response.contentAsString
	}

    void testGenerateServiceUrl() {

        def baseUrl = "http://depthservice.aodn.org.au/depth/index"

        controller.params.lat = 10
        controller.params.lon = 20
        controller.grailsApplication = [config: [depthService: [url: baseUrl]]]

        assertEquals "${baseUrl}.xml?lat=10&lon=20".toURL(), controller._generateServiceUrl()
    }
}
