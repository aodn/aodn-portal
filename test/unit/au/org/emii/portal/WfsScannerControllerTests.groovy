package au.org.emii.portal

import grails.test.ControllerUnitTestCase

class WfsScannerControllerTests extends ControllerUnitTestCase {
    def sampleScanJobList = ["Scan Job 1", "Scan Job 2"]

    def server1 = new Server( id: 1, name: "Server 1", uri: "svr1uri", allowDiscoveries: true )
    def server2 = new Server( id: 2, name: "Server 2", uri: "svr2uri", type: "WMS-1.1.1", scanFrequency: 45, allowDiscoveries: false )
    def server3 = new Server( id: 3, name: "Server 3", uri: "svr3uri", type: "NCWMS-1.3.0", scanFrequency: 120, allowDiscoveries: true, username: "u n", password: "p/w/d" )

    def validConfig = new Config( wmsScannerCallbackPassword: "pwd" )
    def invalidConfig = new Config()

    def expectedScannerBaseUrl = "scannerBaseUrl/"

    protected void setUp() {
        super.setUp()
        mockDomain Server, [server1, server2, server3]

        controller.grailsApplication = [config: new ConfigSlurper().parse("""
                grails.serverURL = "appBaseUrl/"
                wfsScanner.url = "$expectedScannerBaseUrl"
                """)]
    }

    protected void tearDown() {

		super.tearDown()

		String.metaClass = null
    }

    void testControls_NoProblems_ScanJobListReturned() {

        mockDomain Config, [validConfig]

        // Prepare for calls
        Server.metaClass.static.findAllByTypeInListAndAllowDiscoveries = {
            serverTypes, allowDiscoveries, sort ->

            assertEquals "Server type list should match", "[WMS-1.1.1, WMS-1.3.0, NCWMS-1.1.1, NCWMS-1.3.0, GEO-1.1.1, GEO-1.3.0]", serverTypes.toString()
            assertEquals "Sort map should match", "[sort:name]", sort.toString()

            return [] // Test with empty server list
        }

        def expectedQueryString = """\
                ?callbackUrl=appBaseUrl%2Flayer%2FsaveOrUpdate\
            """
        setUpToUrlForResponse "scannerBaseUrl/scanJob/list$expectedQueryString", "[Scan Job 1, Scan Job 2]"

        /*def returnParams = controller.getStatus() // Make the call

        assertEquals expectedScannerBaseUrl, returnParams.wfsScannerBaseUrl
        assertEquals "Matching scan Job list should be returned", sampleScanJobList, returnParams.scanJobList
        assertEquals "Status text should match", expectedStatusText, returnParams.statusText.toString()
        assertEquals "Servers to list should match", [], returnParams.serversToList                 */
    }

    void setUpToUrlForResponse( expectedUrl, responseText ) {

        String.metaClass.toURL = {

            assertEquals "String toURL() is being called on should match expected Url", expectedUrl, delegate

            return [ openConnection: {
                return [ connect: {},
                        content: [ text: responseText ],
                        responseCode: 200
                ]
            } ]
        }
    }

    void setUpToUrlForException( expectedUrl, errorText ) {

        String.metaClass.toURL = {

            assertEquals "String toURL() is being called on should match expected Url", expectedUrl, delegate

            def errorStream = errorText ? new ByteArrayInputStream( errorText.getBytes() ) : null

            return [ openConnection: {
                return [ connect: {  throw new Exception( "Test Exception" ) },
                        errorStream: errorStream,
                        responseCode: 500
                ]
            }
            ]
        }
    }
}
