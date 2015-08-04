

package au.org.emii.portal.proxying

import grails.test.*

import static au.org.emii.portal.HttpUtils.Status.*

class RequestProxyingControllerTests extends GrailsUnitTestCase {

    void testPerformProxyingAddsFileDownloadCookie() {
        mockController(RequestProxyingController)

        def proxyingController = new RequestProxyingController() {
        }

        def called = false
        def cookie = [:]

        proxyingController.metaClass._newDownloadTokenCookie = {
            cookie
        }
        proxyingController.metaClass._makeRequest = { request, response, params, paramProcessor, streamProcessor ->
        }

        proxyingController.response.metaClass.addCookie = { aCookie ->
            called = (aCookie == cookie)
        }

        proxyingController.params.downloadToken = null
        proxyingController._performProxying()
        assertFalse(called)

        proxyingController.params.downloadToken = 1234
        proxyingController._performProxying()
        assertTrue(called)
    }

    void testPerformProxyingCatchesBrokenUrl() {
        mockController(RequestProxyingController)

        def proxyingController = new RequestProxyingController() {
        }

        def mockProbeFieldName = "url"
        def mockProbeUrl = "http://geoserver.aodn.org/broken"

        proxyingController.metaClass._executeProbeRequest = { a, b, c ->

            throw new Exception('Failed before downloading started')
        }

        proxyingController._performProxying(null, null, mockProbeFieldName, mockProbeUrl)
        assertEquals HTTP_500_INTERNAL_SERVER_ERROR, proxyingController.renderArgs.status
    }
}
