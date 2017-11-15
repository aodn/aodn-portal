package au.org.emii.portal

import grails.test.*

class WpsAwsServiceTests extends GrailsUnitTestCase {
    WpsAwsService service

    @Override
    void setUp() {
        super.setUp()

        service = new WpsAwsService()

    }

    void testGetConnection() {

        def connection = service.getConnection([ server: 'myserver' ])

        assertNotNull connection
        assertEquals 'myserver', String.valueOf(connection.uri)
        assertEquals groovyx.net.http.ContentType.XML, connection.contentType
    }

    void testGetBody() {
        def params = [ jobParameters: [ typeName: 'an awesome layer', cqlFilter: 'some cql' ] ]
        def called = false

        service.groovyPageRenderer = [
            render: { args ->
                called = true

                assertEquals '/wps/asyncRequest.xml', args.template
                assertEquals params, args.model
            }
        ]

        service.getBody(params)
        assertTrue called
    }
}
