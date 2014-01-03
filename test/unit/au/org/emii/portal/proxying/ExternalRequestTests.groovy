/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal.proxying

import au.org.emii.portal.Server
import grails.test.GrailsUnitTestCase

class ExternalRequestTests extends GrailsUnitTestCase {

    def externalRequest
    def outputStream
    def url

    @Override
    void setUp() {
        super.setUp()

        outputStream = [:]
        url = "http://www.google.com/".toURL()

        externalRequest = new ExternalRequest(outputStream, url)
    }

    @Override
    void tearDown() {
        super.tearDown()

        Server.metaClass = null
    }

    void testAddAuthenticationMatchingServer() {

        def addAuthenticationCallCount = 0

        def testConnection = new Object()
        def testServer = [
            addAuthentication: { conn ->
                addAuthenticationCallCount++
                assertEquals testConnection, conn
            }
        ]

        externalRequest.metaClass.'_getServer' = { url ->
            assertEquals this.url, url
            return testServer
        }

        externalRequest._addAuthentication(testConnection, url)

        assertEquals 1, addAuthenticationCallCount
    }

    void testAddAuthenticationNoMatchingServer() {

        def testConnection = new Object()

        externalRequest.metaClass.'_getServer' = { url -> null }

        externalRequest._addAuthentication(testConnection, url)

        // Nothing to check. Anything accidentally using the Server will throw a NullPointerException
    }

    void testGetServer() {

        def callCount = 0

        Server.metaClass.static.findByUriLike = { s ->

            assertEquals "%www.google.com%", s
            callCount++
        }

        externalRequest._getServer(url)

        assertEquals 1, callCount
    }
}
