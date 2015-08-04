

package au.org.emii.portal

import grails.test.ControllerUnitTestCase

@TestFor(DepthController)
class DepthControllerTests {

    void testIndexIncorrectParams() {
        controller.index()

        expect:
        "Incorrect parameters supplied" == response.contentAsString
    }

    void testIndexServiceUnavailable() {
        controller.params.lat = 10
        controller.params.lon = 20

        DepthController.metaClass.static._generateServiceUrl = { -> null }

        controller.index()

        expect:
        "This service is unavailable" == response.contentAsString
    }

    void testIndex() {
        controller.params.lat = 10
        controller.params.lon = 20

        DepthController.metaClass.static._generateServiceUrl = { [text: "depth service text"] }

        controller.index()

        expect:
        "depth service text" == response.contentAsString
    }

    void testGenerateServiceUrl() {
        def baseUrl = "http://depthservice.aodn.org.au/depth/index"
        controller.params.lat = 10
        controller.params.lon = 20

        controller.grailsApplication.config.depthService.url = baseUrl

        expect:
        "${baseUrl}.xml?lat=10&lon=20".toURL() == controller._generateServiceUrl()
    }
}
