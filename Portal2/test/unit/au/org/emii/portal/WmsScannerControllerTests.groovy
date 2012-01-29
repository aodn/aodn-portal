package au.org.emii.portal

import grails.test.*
import java.net.URLConnection

class WmsScannerControllerTests extends ControllerUnitTestCase {
 
    def sampleScanJobList = ["Scan Job 1", "Scan Job 2"]
    
    def server1 = new Server( id: 1, name: "Server 1", uri: "svr1uri" )
    def server2 = new Server( id: 2, name: "Server 2", uri: "svr2uri", type: "WMS-1.1.1", scanFrequency: 45 )
    def server3 = new Server( id: 3, name: "Server 3", uri: "svr3uri", type: "NCWMS-1.3.0", scanFrequency: 120 )
    
    def validConfig = new Config( applicationBaseUrl: "appBaseUrl/", wmsScannerBaseUrl: "scannerBaseUrl/", wmsScannerCallbackUsername: "un", wmsScannerCallbackPassword: "pwd" )
    def invalidConfig = new Config()
    
    protected void setUp() {
        
        super.setUp()
        
        mockDomain Server, [server1, server2, server3]
    }

    protected void tearDown() {
        
        super.tearDown()
        
        String.metaClass.toURL = { -> return null }
    }

    void testControls_NoProblems_ScanJobListReturned() {
        
        mockDomain Config, [validConfig]
        
        // Prepare for calls
        Server.metaClass.static.findAllByTypeInList = {
            serverTypes, sort ->
            
            assertEquals "Server type list should match", "[WMS-1.1.1, WMS-1.3.0, NCWMS-1.1.1, NCWMS-1.3.0]", serverTypes.toString()
            assertEquals "Sort map should match", "[sort:name]", sort.toString()
            
            return [] // Test with empty server list
        }
        
        def expectedQueryString = """\
?callbackUrl=appBaseUrl%2Flayer%2FsaveOrUpdate\
"""
        
        setUpToUrlForResponse "scannerBaseUrl/scanJob/list$expectedQueryString", "[Scan Job 1, Scan Job 2]"
        
        def returnParams = controller.controls() // Make the call
         
        assertEquals "Active Config instance should be returned", validConfig, returnParams.configInstance
        assertEquals "Matching scan Job list should be returned", sampleScanJobList, returnParams.scanJobList
        assertEquals "Status text should match", "[0:Running, -1:Running<br>(with&nbsp;errors), -2:Stopped<br>(too&nbsp;many&nbsp;errors)]", returnParams.statusText.toString()
        assertEquals "Servders to list should match", [], returnParams.serversToList
    }
    
    void testControls_ExceptionThrown_EmptyListReturned() {
        
        mockDomain Config, [validConfig]
        
        // Prepare for calls
        Server.metaClass.static.findAllByTypeInList = {
            serverTypes, sort ->
            
            assertEquals "Server type list should match", "[WMS-1.1.1, WMS-1.3.0, NCWMS-1.1.1, NCWMS-1.3.0]", serverTypes.toString()
            assertEquals "Sort map should match", "[sort:name]", sort.toString()
            
            return [server1, server3]
        }
        
        def expectedQueryString = """\
?callbackUrl=appBaseUrl%2Flayer%2FsaveOrUpdate\
"""
        setUpToUrlForException "scannerBaseUrl/scanJob/list$expectedQueryString", "Error Line 1\nError Line 2"
        
        def returnParams = controller.controls() // Make the call
        
        assertEquals "Active Config instance should be returned", validConfig, returnParams.configInstance
        assertEquals "Matching scan Job list should be returned", [], returnParams.scanJobList
        assertEquals "Status text should match", "[0:Running, -1:Running<br>(with&nbsp;errors), -2:Stopped<br>(too&nbsp;many&nbsp;errors)]", returnParams.statusText.toString()
        assertEquals "Servers to list should match", [server1, server3], returnParams.serversToList
        assertEquals "Flash message should contain exception message", "Exception: java.lang.Exception: Test Exception<br />Response: <br /><b>Error Line 1</b><br /><b>Error Line 2</b>", controller.flash.message
    }
    
//    void testControls_InvalidConfig_EmptyListReturned() {
//        
//        mockDomain Config, [invalidConfig]
//        
//        def returnParams = controller.controls() // Make the call
//         
//        assertEquals "Active Config instance should be returned", invalidConfig, returnParams.configInstance
//        assertEquals "Empty scan Job list should be returned", [], returnParams.scanJobList
//        assertEquals "Status text should match", "[0:Running, -1:Running<br>(with&nbsp;errors), -2:Stopped<br>(too&nbsp;many&nbsp;errors)]", returnParams.statusText.toString()
//        assertEquals "Empty list should be returned", [], returnParams.serversToList
//        assertEquals "Flash message should indicate errors", "Response: Registered", controller.flash.message
//    }
    
    void testCallRegister_NoProblem_RedirectedWithMessage() {
       
        mockDomain Config, [validConfig]
        
        def expectedQueryString = """\
?jobName=Server+scan+for+%27Server+2%27\
&jobDescription=Created+by+Portal%2C+${ URLEncoder.encode( new Date().format( "dd/MM/yyyy hh:mm" ) ) }\
&jobType=WMS\
&wmsVersion=1.1.1\
&uri=svr2uri\
&callbackUrl=appBaseUrl%2Flayer%2FsaveOrUpdate\
&callbackUsername=un\
&callbackPassword=pwd\
&scanFrequency=45\
"""

        setUpToUrlForResponse "scannerBaseUrl/scanJob/register$expectedQueryString", "Registered"
        
        Server.metaClass.static.get = { map -> return server2 }
        
        controller.callRegister() // Make the call
        
        assertEquals "Should redirect to 'controls'", "controls", redirectArgs.action
        assertEquals "Flash message should contain response", "Response: Registered", controller.flash.message
    }
    
    void testCallRegister_ExceptionThrown_RedirectedWithMessage() {
       
        mockDomain Config, [validConfig]
        
        def expectedQueryString = """\
?jobName=Server+scan+for+%27Server+2%27\
&jobDescription=Created+by+Portal%2C+${ URLEncoder.encode( new Date().format( "dd/MM/yyyy hh:mm" ) ) }\
&jobType=WMS\
&wmsVersion=1.1.1\
&uri=svr2uri\
&callbackUrl=appBaseUrl%2Flayer%2FsaveOrUpdate\
&callbackUsername=un\
&callbackPassword=pwd\
&scanFrequency=45\
"""
        
        setUpToUrlForException "scannerBaseUrl/scanJob/register$expectedQueryString", "Error Text"
        
        Server.metaClass.static.get = { map -> return server2 }
        
        controller.callRegister() // Make the call
        
        assertEquals "Should redirect to 'controls'", "controls", redirectArgs.action
        assertEquals "Flash message should contain exception message", "Exception: java.lang.Exception: Test Exception<br />Response: <br /><b>Error Text</b>", controller.flash.message
    }
    
    void testCallUpdate_NoProblem_RedirectedWithMessage() {
            
        mockDomain Config, [validConfig]
        
        def expectedQueryString = """\
?id=1\
&callbackUrl=appBaseUrl%2Flayer%2FsaveOrUpdate\
&callbackUsername=un\
&callbackPassword=pwd\
&jobType=WMS\
&wmsVersion=1.3.0\
&uri=svr3uri\
&scanFrequency=120\
"""

        setUpToUrlForResponse "scannerBaseUrl/scanJob/update$expectedQueryString", "Updated"
        
        Server.metaClass.static.findWhere = { map -> return server3 }
        
        mockParams.scanJobId = 1
        controller.callUpdate() // Make the call
     
        assertEquals "Should redirect to 'controls'", "controls", redirectArgs.action
        assertEquals "Flash message should show response", "Response: Updated", controller.flash.message
    }
    
    void testCallUpdate_ExceptionThrown_RedirectedWithMessage() {
             
        mockDomain Config, [validConfig]
        
        def expectedQueryString = """\
?id=1\
&callbackUrl=appBaseUrl%2Flayer%2FsaveOrUpdate\
&callbackUsername=un\
&callbackPassword=pwd\
&jobType=WMS\
&wmsVersion=1.1.1\
&uri=svr2uri\
&scanFrequency=45\
"""

        setUpToUrlForException "scannerBaseUrl/scanJob/update$expectedQueryString", "Update Problem"
        
        Server.metaClass.static.findWhere = { map -> return server2 }
        
        mockParams.scanJobId = 1
        controller.callUpdate() // Make the call
     
        assertEquals "Should redirect to 'controls'", "controls", redirectArgs.action
        assertEquals "Flash message should contain exception message", "Exception: java.lang.Exception: Test Exception<br />Response: <br /><b>Update Problem</b>", controller.flash.message
    }
    
 void testCallDelete_NoProblem_Redirected() {
         
        mockDomain Config, [validConfig]
        
        def expectedQueryString = "?id=4&callbackUrl=appBaseUrl%2Flayer%2FsaveOrUpdate"
        setUpToUrlForResponse "scannerBaseUrl/scanJob/delete$expectedQueryString", "Deleted"
         
        mockParams.scanJobId = 4
        controller.callDelete() // Make the call
     
        assertEquals "Should redirect to 'controls'", "controls", redirectArgs.action
        assertEquals "Flash message should show response", "Response: Deleted", controller.flash.message
    }
    
    void testCallDelete_ExceptionThrownWithExistingMessage_RedirectedWithNewAndExistingMessage() {
                        
        mockDomain Config, [validConfig]
        
        def expectedQueryString = "?id=5&callbackUrl=appBaseUrl%2Flayer%2FsaveOrUpdate"
        setUpToUrlForException "scannerBaseUrl/scanJob/delete$expectedQueryString", null
        
        controller.flash.message = "Existing<br />Message" // Existing message
        mockParams.scanJobId = 5
        controller.callDelete() // Make the call
     
        assertEquals "Should redirect to 'controls'", "controls", redirectArgs.action
        assertEquals "Flash message should contain exception message", "Existing<br />Message<hr>Exception: java.lang.Exception: Test Exception", controller.flash.message
    }
    
    void setUpToUrlForResponse( expectedUrl, responseText ) {
        
        String.metaClass.toURL = {
            
            assertEquals "String toURL() is being called on should match expected Url", expectedUrl, delegate
            
            return [ openConnection: {
                        return [ connect: {},
                                 content: [ text: responseText ] ]
                     } ]
        }
    }
    
    void setUpToUrlForException( expectedUrl, errorText ) {
        
        String.metaClass.toURL = {
            
            assertEquals "String toURL() is being called on should match expected Url", expectedUrl, delegate
            
            def errorStream = errorText ? new ByteArrayInputStream( errorText.getBytes() ) : null
            
            return [ openConnection: {
                    return [ connect: {  throw new Exception( "Test Exception" ) },
                             errorStream: errorStream ]
                    }
                  ]
        }
    }
}
