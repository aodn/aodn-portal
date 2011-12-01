package au.org.emii.portal

import grails.test.*

class ConfigTests extends GrailsUnitTestCase {
    protected void setUp() {
        super.setUp()
    }

    protected void tearDown() {
        super.tearDown()
    }
	
    void testConstraints() {
        def config1 = new Config(name : "config1");
        mockForConstraintsTests(Config, [config1])

        def testConfig = new Config()
        assertFalse testConfig.validate()
        assertEquals "nullable", testConfig.errors["name"]
        assertEquals "nullable", testConfig.errors["initialBbox"]
        assertEquals "nullable", testConfig.errors["defaultMenu"]
        assertEquals "nullable", testConfig.errors["contributorMenu"]
        assertEquals "nullable", testConfig.errors["regionMenu"]
        assertEquals "nullable", testConfig.errors["downloadCartFilename"]
        assertEquals "nullable", testConfig.errors["downloadCartMaxNumFiles"]
        assertEquals "nullable", testConfig.errors["downloadCartMaxFileSize"]
        assertEquals "nullable", testConfig.errors["downloadCartMimeTypeToExtensionMapping"]
        assertEquals "nullable", testConfig.errors["downloadCartDownloadableProtocols"]
        assertEquals "nullable", testConfig.errors["metadataLinkProtocols"]
        assertEquals "nullable", testConfig.errors["metadataLayerProtocols"]
        assertEquals "nullable", testConfig.errors["mapGetFeatureInfoBuffer"]
		
        testConfig = new Config(name : "config1")
        assertFalse testConfig.validate()
        assertEquals "unique", testConfig.errors["name"]

        testConfig = new Config(name : "1234")
        assertFalse testConfig.validate()
        assertEquals "size", testConfig.errors["name"]

        testConfig = new Config(name : "12345678901234567890123456")
        assertFalse testConfig.validate()
        assertEquals "size", testConfig.errors["name"]

        testConfig = new Config(initialBbox : "123456789")
        assertFalse testConfig.validate()
        assertEquals "size", testConfig.errors["initialBbox"]

        testConfig = new Config(initialBbox : "123456789012345678901234567890123456789012345678901")
        assertFalse testConfig.validate()
        assertEquals "size", testConfig.errors["initialBbox"]

        testConfig = new Config(downloadCartFilename : "")
        assertFalse testConfig.validate()
        assertEquals "blank", testConfig.errors["downloadCartFilename"]
        
        testConfig = new Config(downloadCartMaxNumFiles : "0")
        assertFalse testConfig.validate()
        assertEquals "min", testConfig.errors["downloadCartMaxNumFiles"]
        
        testConfig = new Config(downloadCartMaxFileSize : "0")
        assertFalse testConfig.validate()
        assertEquals "min", testConfig.errors["downloadCartMaxFileSize"]
        
        testConfig = new Config(downloadCartMimeTypeToExtensionMapping: "[")
        assertFalse testConfig.validate()
        assertEquals "size", testConfig.errors["downloadCartMimeTypeToExtensionMapping"]
        
        testConfig = new Config(downloadCartMimeTypeToExtensionMapping: "[" * 2001)
        assertFalse testConfig.validate()
        assertEquals "size", testConfig.errors["downloadCartMimeTypeToExtensionMapping"]
         
        testConfig = new Config(downloadCartDownloadableProtocols: "[" * 256)
        assertFalse testConfig.validate()
        assertEquals "size", testConfig.errors["downloadCartDownloadableProtocols"]

        testConfig = new Config(metadataLinkProtocols: "[" * 256)
        assertFalse testConfig.validate()
        assertEquals "size", testConfig.errors["metadataLinkProtocols"]

        testConfig = new Config(metadataLayerProtocols: "[" * 256)
        assertFalse testConfig.validate()
        assertEquals "size", testConfig.errors["metadataLayerProtocols"]
        
        testConfig = new Config(mapGetFeatureInfoBuffer: -1)
        assertFalse testConfig.validate()
        assertEquals "min", testConfig.errors["mapGetFeatureInfoBuffer"]
        
        testConfig = new Config(wmsScannerBaseUrl: "http://invalidUrl")
        assertFalse testConfig.validate()
        assertEquals "url", testConfig.errors["wmsScannerBaseUrl"]
    }

    void testActiveInstance() {
        def config1 = new Config(name: "config1");
        def config2 = new Config(name: "config2");
        mockDomain(Config, [config1, config2])
        
        assertEquals "Should return first config", config1, Config.activeInstance()
    }
}
