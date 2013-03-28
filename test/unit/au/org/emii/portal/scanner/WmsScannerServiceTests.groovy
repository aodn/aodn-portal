package au.org.emii.portal.scanner

import grails.test.*
import au.org.emii.portal.Server

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

    void testDeleteJob(){
        def count = 0

        wmsScannerService.metaClass.callService = { address ->
            assertEquals address, "http://blah.au/scanJob/delete?id=3"
            count++
        }

        assertEquals wmsScannerService.callDelete(3), "Job deleted."
        assertEquals count, 1
    }

    void testRegister(){
        def server = [
                id: 1,
                scanFrequency: 120,
                password: "somePassword",
                uri: "http://geoserver.blah.com",
                type: "GEO-1.1.1"
        ]  as Server

        mockDomain(Server, [server])

        wmsScannerService.metaClass.saveOrUpdateCallbackUrl = {
            return "http://localhost/filter/updateFilter"
        }

        wmsScannerService.metaClass.scanJobUrl = {
            return "http://scannerHost.com/scanJob/"
        }

        def count = 0

        wmsScannerService.metaClass.callService = { address ->
            assertEquals address, "http://scannerHost.com/scanJob/register?serverUrl=http://geoserver.blah.com&layerName=abc&callbackUrl=http://localhost/filter/updateFilter&password=somePassword&scanFrequency=120"
            count++
        }

        wmsScannerService.callRegister(1, "abc", "somePassword")

        assertEquals count, 1
    }


    void testUpdate(){

        wmsScannerService.metaClass.scanJobUrl = {
            return "http://scannerHost.com/scanJob/"
        }

        def count = 0

        wmsScannerService.metaClass.callService = { address ->
            assertEquals address, "http://scannerHost.com/scanJob/updateNow?id=100"
            count++
        }

        wmsScannerService.callUpdate(100)

        assertEquals count, 1
    }
}
