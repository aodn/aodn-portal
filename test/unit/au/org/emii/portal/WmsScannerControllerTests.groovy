/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import au.org.emii.portal.scanner.WmsScannerService
import grails.test.ControllerUnitTestCase
import org.apache.shiro.SecurityUtils
import org.apache.shiro.subject.Subject
import org.apache.shiro.util.ThreadContext

class WmsScannerControllerTests extends ControllerUnitTestCase {

    def sampleScanJobList = ["Scan Job 1", "Scan Job 2"]

    def server1 = new Server(id: 1, name: "Server 1", uri: "svr1uri", allowDiscoveries: true)
    def server2 = new Server(id: 2, name: "Server 2", uri: "svr2uri", type: "WMS-1.1.1", scanFrequency: 45, allowDiscoveries: false)
    def server3 = new Server(id: 3, name: "Server 3", uri: "svr3uri", type: "NCWMS-1.3.0", scanFrequency: 120, allowDiscoveries: true, username: "u n", password: "p/w/d")

    def validConfig = new Config(wmsScannerCallbackPassword: "pwd")
    def invalidConfig = new Config()

    def expectedStatusText = "[0:Enabled, -1:Enabled<br />(errors&nbsp;occurred), -2:Stopped<br />(too&nbsp;many&nbsp;errors)]"
    def expectedScannerBaseUrl = "scannerBaseUrl/"

    protected void setUp() {

        super.setUp()

        mockDomain Server, [server1, server2, server3]

        def user = new User(openIdUrl: "aaaaaaaa@afaaa.com", emailAddress: "aaaaaaaa@afaaa.com",
            fullName: "aaaaaaaa@afaaa.com")
        mockDomain(User, [user])

        def subject = [getPrincipal: { user.id },
            isAuthenticated: { true },
            isPermitted: { true }
        ] as Subject

        ThreadContext.put(ThreadContext.SECURITY_MANAGER_KEY,
            [getSubject: { subject }] as SecurityManager)

        SecurityUtils.metaClass.static.getSubject = { subject }


        controller.grailsApplication = [config: new ConfigSlurper().parse("""
                grails.serverURL = "appBaseUrl/"
                wmsScanner.url = "$expectedScannerBaseUrl"
                """)]

        def mockWmsScannerService = mockFor(WmsScannerService)
        mockWmsScannerService.metaClass.scannerURL = {
            return "scannerBaseUrl/"
        }

        mockWmsScannerService.metaClass.scanJobUrl = {
            return "scannerBaseUrl/scanJob/"
        }

        mockWmsScannerService.metaClass.saveOrUpdateCallbackUrl = {
            return "appBaseUrl/layer/saveOrUpdate"
        }

        controller.wmsScannerService = mockWmsScannerService
    }

    protected void tearDown() {

        super.tearDown()

        String.metaClass = null
    }

    void testControls_NoProblems_ScanJobListReturned() {

        mockDomain Config, [validConfig]
        Config.reload()

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

        def returnParams = controller.controls() // Make the call

        assertEquals "Active Config instance should be returned", validConfig, returnParams.configInstance
        assertEquals expectedScannerBaseUrl, returnParams.wmsScannerBaseUrl
        assertEquals "Matching scan Job list should be returned", sampleScanJobList, returnParams.scanJobList
        assertEquals "Status text should match", expectedStatusText, returnParams.statusText.toString()
        assertEquals "Servers to list should match", [], returnParams.serversToList
    }

    void testControls_ExceptionThrown_EmptyListReturned() {

        mockDomain Config, [validConfig]
        Config.reload()

        // Prepare for calls
        Server.metaClass.static.findAllByTypeInListAndAllowDiscoveries = {
            serverTypes, allowDiscoveries, sort ->

                assertEquals "Server type list should match", "[WMS-1.1.1, WMS-1.3.0, NCWMS-1.1.1, NCWMS-1.3.0, GEO-1.1.1, GEO-1.3.0]", serverTypes.toString()
                assertEquals "Allow discoveries should be 'true'", true, allowDiscoveries
                assertEquals "Sort map should match", "[sort:name]", sort.toString()

                return [server3]
        }

        def expectedQueryString = """\
?callbackUrl=appBaseUrl%2Flayer%2FsaveOrUpdate\
"""
        setUpToUrlForException "scannerBaseUrl/scanJob/list$expectedQueryString", "Error Line 1\nError Line 2"

        println "config serverURL: ${controller.grailsApplication.config.grails.serverURL}"

        def returnParams = controller.controls() // Make the call

        assertEquals "Active Config instance should be returned", validConfig, returnParams.configInstance
        assertEquals expectedScannerBaseUrl, returnParams.wmsScannerBaseUrl
        assertEquals "Matching scan Job list should be returned", [], returnParams.scanJobList
        assertEquals "Status text should match", expectedStatusText, returnParams.statusText.toString()
        assertEquals "Servers to list should match", [server3], returnParams.serversToList
        assertEquals "Flash message should contain exception message", "java.lang.Exception: Test Exception<br />Response: <br /><b>Error Line 1</b><br /><b>Error Line 2</b>", controller.flash.message
    }

    void testControls_InvalidConfig_EmptyListReturned() {

        mockDomain Config, [invalidConfig]
        Config.reload()

        def returnParams = controller.controls() // Make the call

        assertEquals "Active Config instance should be returned", invalidConfig, returnParams.configInstance
        assertEquals expectedScannerBaseUrl, returnParams.wmsScannerBaseUrl
        assertEquals "Empty scan Job list should be returned", [], returnParams.scanJobList
        assertEquals "Status text should match", expectedStatusText, returnParams.statusText.toString()
        assertEquals "Empty list should be returned", [], returnParams.serversToList
        assertEquals "Flash message should indicate errors", "Both settings: 'WmsScannerBaseUrl' and 'WmsScannerCallbackPassword' must have values to use a WMS Scanner.", controller.flash.message
    }

    void testCallRegister_NoProblem_RedirectedWithMessage() {


        mockDomain Config, [validConfig]

        def count = 0

        controller.wmsScannerService.metaClass.callRegister = { a, b ->
            count++
        }

        controller.callRegister()

        assertEquals count, 1
    }

    void testCallRegister_ExceptionThrown_RedirectedWithMessage() {

        mockDomain Config, [validConfig]

        def expectedQueryString = """\
?jobName=Server+scan+for+%27Server+2%27\
&jobDescription=Created+by+Portal%2C+${ URLEncoder.encode(new Date().format("dd/MM/yyyy hh:mm")) }\
&jobType=WMS\
&wmsVersion=1.1.1\
&uri=svr2uri\
&callbackUrl=appBaseUrl%2Flayer%2FsaveOrUpdate\
&callbackPassword=pwd\
&scanFrequency=45\
"""

        Server.metaClass.static.get = { map -> return server2 }

        controller.wmsScannerService.metaClass.callRegister = { a, b ->
            throw new Exception("Error Text")
        }

        controller.callRegister() // Make the call

        assertEquals "Should redirect to 'list'", "list", redirectArgs.action
        assertEquals "Should redirect to server controller", "server", redirectArgs.controller
        assertEquals "Flash message should contain exception message", "Response: Error Text", controller.flash.message
    }

    void testCallUpdate_NoProblem_RedirectedWithMessage() {

        mockDomain Config, [validConfig]

        def expectedQueryString = """\
?id=1\
&callbackUrl=appBaseUrl%2Flayer%2FsaveOrUpdate\
&callbackPassword=pwd\
&jobType=WMS\
&wmsVersion=1.3.0\
&uri=svr3uri\
&scanFrequency=120\
&username=u+n\
&password=p%2Fw%2Fd\
"""

        setUpToUrlForResponse "scannerBaseUrl/scanJob/update$expectedQueryString", "Updated"

        Server.metaClass.static.findWhere = { map -> return server3 }

        mockParams.scanJobId = 1

        def count = 0
        controller.wmsScannerService.metaClass.callUpdate = { a, b, c ->
            count++
            return "Updated"
        }

        controller.callUpdate() // Make the call

        assertEquals "Should redirect to 'list'", "list", redirectArgs.action
        assertEquals "Should redirect to server controller", "server", redirectArgs.controller
        assertEquals 1, count
        assertEquals "Flash message should show response", "Response: Updated", controller.flash.message
    }

    void testCallUpdate_WithException() {

        mockDomain Config, [validConfig]

        Server.metaClass.static.findWhere = { map -> return null }

        def count = 0
        controller.wmsScannerService.metaClass.callUpdate = { a, b, c ->
            throw new Exception("Unable to find server with uri: 'TheUri'")
        }

        mockParams.scanJobUri = "TheUri"
        controller.callUpdate() // Make the call

        assertEquals "Should redirect to 'list'", "list", redirectArgs.action
        assertEquals "Should redirect to server controller", "server", redirectArgs.controller
        assertEquals "Flash message should contain exception message", "Response: Unable to find server with uri: 'TheUri'", controller.flash.message
    }

    void testCallDelete_WithoutException() {

        mockDomain Config, [validConfig]

        def expectedQueryString = "?id=4&callbackUrl=appBaseUrl%2Flayer%2FsaveOrUpdate"
        setUpToUrlForException "scannerBaseUrl/scanJob/delete$expectedQueryString", "<Doctype><hTMl>Blah blah blah..."

        mockParams.scanJobId = 4


        controller.wmsScannerService.metaClass.callDelete = {
            return "Deleted"
        }

        controller.callDelete() // Make the call

        assertEquals "Should redirect to 'list'", "list", redirectArgs.action
        assertEquals "Should redirect to server controller", "server", redirectArgs.controller
        assertEquals "Flash message should show response", "Response: Deleted", controller.flash.message
    }

    void testCallDelete_WithException() {

        mockDomain Config, [validConfig]

        def expectedQueryString = "?id=5&callbackUrl=appBaseUrl%2Flayer%2FsaveOrUpdate"
        setUpToUrlForException "scannerBaseUrl/scanJob/delete$expectedQueryString", null

        controller.flash.message = "Existing<br />Message" // Existing message
        mockParams.scanJobId = 5

        controller.wmsScannerService.metaClass.callDelete = {
            throw new Exception("Test Exception")
        }

        controller.callDelete() // Make the call

        assertEquals "Should redirect to 'list'", "list", redirectArgs.action
        assertEquals "Should redirect to server controller", "server", redirectArgs.controller
        assertEquals "Flash message should contain exception message", "Response: Test Exception", controller.flash.message
    }

    void setUpToUrlForResponse(expectedUrl, responseText) {

        String.metaClass.toURL = {

            assertEquals "String toURL() is being called on should match expected Url", expectedUrl, delegate

            return [openConnection: {
                return [connect: {},
                    content: [text: responseText],
                    responseCode: 200
                ]
            }]
        }
    }

    void setUpToUrlForException(expectedUrl, errorText) {

        String.metaClass.toURL = {

            assertEquals "String toURL() is being called on should match expected Url", expectedUrl, delegate

            def errorStream = errorText ? new ByteArrayInputStream(errorText.getBytes()) : null

            return [openConnection: {
                return [connect: { throw new Exception("Test Exception") },
                    errorStream: errorStream,
                    responseCode: 500
                ]
            }
            ]
        }
    }
}
