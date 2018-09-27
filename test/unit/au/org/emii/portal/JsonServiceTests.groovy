package au.org.emii.portal

import grails.test.GrailsUnitTestCase

import static groovyx.net.http.ContentType.JSON

class JsonServiceTests  extends GrailsUnitTestCase {

    JsonService service

    @Override
    void setUp() {
        super.setUp()
        service = new JsonService()
    }

    void testGetConnection() {

        def connection = service.getConnection([ server: 'myserver' ])

        assertNotNull connection
        assertEquals 'myserver', String.valueOf(connection.uri)
        assertEquals JSON, connection.contentType
    }

}

