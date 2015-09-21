package au.org.emii.portal

import grails.test.*

class WpsServiceTests extends GrailsUnitTestCase {
    WpsService service

    @Override
    void setUp() {
        super.setUp()

        service = new WpsService()

    }

    void testGetConnection() {

        def connection = service.getConnection([ server: 'myserver' ])

        assertNotNull connection
        assertEquals 'myserver', String.valueOf(connection.uri)
        assertEquals groovyx.net.http.ContentType.XML, connection.contentType
    }

    void testGetBody() {
        def requestParams = [ typeName: 'an awesome layer', cqlFilter: 'some cql' ]
        def called = false

        service.groovyPageRenderer = [
            render: { args ->
                called = true

                assertEquals '/wps/asyncRequest.xml', args.template
                assertEquals requestParams, args.model
            }
        ]

        service.getBody(requestParams)

        assertTrue called
    }
}
