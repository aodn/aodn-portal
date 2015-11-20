package au.org.emii.portal.proxying

import grails.test.GrailsUnitTestCase

import static au.org.emii.portal.HttpUtils.Status.*

class HostVerifyingControllerTests extends GrailsUnitTestCase {

    def controller

    @Override
    void setUp() {
        super.setUp()

        mockController(HostVerifyingController)

        controller = new HostVerifyingController() {}
        controller.hostVerifier = [
            allowedHost: { it == 'http://known_site/' }
        ]
    }

    void testUrlWithKnownServerAllowed() {

        def called = false

        controller.ifAllowed('http://known_site/') {
            called = true
        }

        assertTrue called
    }

    void testUrlWithUnknownServerPrevented() {

        def called = false

        controller.ifAllowed('http://random_site/') {
            called = true
        }

        assertFalse called
        assertEquals HTTP_403_FORBIDDEN, controller.renderArgs.status
    }
}
