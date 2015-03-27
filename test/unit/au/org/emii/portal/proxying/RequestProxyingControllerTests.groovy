/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal.proxying

import grails.test.*

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
}
