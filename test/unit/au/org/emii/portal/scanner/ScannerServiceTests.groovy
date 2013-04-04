package au.org.emii.portal.scanner

import grails.test.GrailsUnitTestCase

/**
 * Created with IntelliJ IDEA.
 * User: pmak
 * Date: 28/03/13
 * Time: 11:36 AM
 * To change this template use File | Settings | File Templates.
 */
class ScannerServiceTests extends GrailsUnitTestCase{

    def scannerService

    protected void setUp() {
        super.setUp()
        scannerService = new ScannerService()
    }

    void testCallService(){
        URL.metaClass.openConnection = {
            def conn = []
            conn.metaClass.connect = {
                return true
            }
            return conn
        }

        scannerService.metaClass.executeCommand = {
            return "executeCommand called!!"
        }

        assertEquals scannerService.callService("http://blah.com"), "executeCommand called!!"
    }


    void testScanJobUrl(){
        scannerService.scannerBaseUrl = "http://blah.au"

        assertEquals scannerService.scanJobUrl(), "http://blah.au/scanJob/"
    }


    void testGetStatus(){
        scannerService.scannerBaseUrl = "http://blah.au"

        scannerService.metaClass.saveOrUpdateCallbackUrl = {
            return "http://localhost/scanJob"
        }

        scannerService.metaClass.callService = { address ->
            assertEquals address, "http://blah.au/scanJob/list?callbackUrl=http://localhost/scanJob"
            count++
        }

    }

    void testPortalBaseURL(){
        scannerService.grailsApplication = [
            config: [
                grails: [
                        serverURL: "http://blah.com"
                ]
            ]
        ]

        assertEquals scannerService.portalBaseURL(), "http://blah.com/"
    }

    /**
     *
     * conn
     * def response = conn.content.text // Executes command

     if ( response.toLowerCase().contains( "<html" ) ) {

     response = "HTML response (Code: ${ conn.responseCode })"
     }

     return response
     */
    void testExecuteCommand(){
        def conn = [
            content: [
                text:   "<html> blasdfhasdfkadgf;khasdf lkh asd flkhasdf lhkafs df</html>",
            ],
            responseCode: 200
        ]

        def result = scannerService.executeCommand(conn)

        assertEquals result, "HTML response (Code: 200)"

        conn.content.text = "asdfkljasdfljhasdflkjhasfkljhasdjhkladfs"

        result = scannerService.executeCommand(conn)

        assertEquals result, "asdfkljasdfljhasdflkjhasfkljhasdjhkladfs"
    }
}


