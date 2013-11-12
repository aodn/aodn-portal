package au.org.emii.portal.scanner

import au.org.emii.portal.Server
import grails.test.GrailsUnitTestCase

class WmsScannerServiceTests extends GrailsUnitTestCase {
    def wmsScannerService

    protected void setUp() {
        super.setUp()
        wmsScannerService = new WmsScannerService()

        //grailsApplication.config.wmsScanner.url
        wmsScannerService.grailsApplication = [
            config: [
                wmsScanner: [
                    url: "http://blah.au"
                ]
            ]
        ]
    }

    void testDeleteJob() {
        def count = 0

        wmsScannerService.metaClass.saveOrUpdateCallbackUrl = {
            return "http://blah.com/layer/update"
        }

        wmsScannerService.metaClass.callService = { address ->
            assertEquals address, "http://blah.au/scanJob/delete?id=3&callbackUrl=http://blah.com/layer/update"
            count++
        }

        assertEquals wmsScannerService.callDelete(3), "Deleted"
        assertEquals count, 1
    }

    void testRegister() {
        def server = [
            id: 1,
            scanFrequency: 120,
            password: "somePassword",
            uri: "http://geoserver.blah.com",
            type: "GEO-1.1.1"
        ] as Server

        mockDomain(Server, [server])

        wmsScannerService.metaClass.saveOrUpdateCallbackUrl = {
            return "http://localhost/filter/updateFilter"
        }

        wmsScannerService.metaClass.scanJobUrl = {
            return "http://scannerHost.com/scanJob/"
        }

        def count = 0

        wmsScannerService.metaClass.callService = { String address ->
            assertTrue address.contains("http://scannerHost.com/scanJob/register?")
            assertTrue address.contains("jobName=Server+scan+for+%27null%27&jobDescription=Created+by+Portal")
            assertTrue address.contains("jobType=WMS")
            assertTrue address.contains("wmsVersion=1.1.1")
            assertTrue address.contains("uri=http%3A%2F%2Fgeoserver.blah.com&callbackUrl=http%3A%2F%2Flocalhost%2Ffilter%2FupdateFilter")
            assertTrue address.contains("callbackPassword=somePassword")
            assertTrue address.contains("scanFrequency=120")
            assertTrue address.contains("password=somePassword")
            count++
        }

        assertEquals wmsScannerService.callRegister(1, "somePassword"), "Registered"

        assertEquals count, 1
    }


    void testUpdate() {

        def server = [
            id: 1,
            scanFrequency: 120,
            password: "somePassword",
            uri: "http://geoserver.blah.com",
            type: "GEO-1.1.1",
            username: "hello",
        ] as Server

        mockDomain(Server, [server])

        Server.metaClass.static.findWhere = { map ->
            return server
        }

        wmsScannerService.metaClass.saveOrUpdateCallbackUrl = {
            return "http://blah.com/layer/update"
        }

        wmsScannerService.metaClass.scanJobUrl = {
            return "http://scannerHost.com/scanJob/"
        }

        def count = 0


        wmsScannerService.metaClass.callService = { address ->
            assertEquals address, "http://scannerHost.com/scanJob/update?id=100&callbackUrl=http%3A%2F%2Fblah.com%2Flayer%2Fupdate&callbackPassword=portalPassword&jobType=WMS&wmsVersion=1.1.1&uri=http%3A%2F%2Fgeoserver.blah.com&scanFrequency=120&username=hello&password=somePassword"
            count++
        }

        assertEquals wmsScannerService.callUpdate(100, "http://geoserver.blah.com", "portalPassword"), "Updated"

        assertEquals count, 1
    }
}
