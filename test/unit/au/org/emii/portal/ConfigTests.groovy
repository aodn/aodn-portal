package au.org.emii.portal

import grails.test.GrailsUnitTestCase

class ConfigTests extends GrailsUnitTestCase {
    
    
    
    
    protected void setUp() {
        
        super.setUp()        
        mockForConstraintsTests(Config)
    }

    protected void tearDown() {
        super.tearDown()
    }
	
    Config getValidInstance() {
                
   
        def menu1 = new Menu()
        
        mockDomain(Menu, [menu1])
        def validInstance = new Config(
            
            defaultMenu: menu1,
            initialBbox: "120,20,120,20", // character varying,  lat,lon might be shite? 
            name: "The aMazing Portal",
            contributorMenu: menu1,
            regionMenu: menu1,
            catalogUrl: "http://www.google.com/",
            footerHeight: 500,
            headerHeight: 600,
            westWidth: 250,
            downloadCartMaxFileSize: 200,
            downloadCartMaxNumFiles: 200,
            downloadCartFilename: "a super string",
            activeLayersHeight: 200,
            downloadCartMimeTypeToExtensionMapping: "really long string 2000 characters..",
            downloadCartDownloadableProtocols: "a super string",
            metadataLayerProtocols: "a super string",
            metadataLinkProtocols: "a super string",
            mapGetFeatureInfoBuffer: 200,
            baselayerMenu: menu1,
            popupHeight: 200,
            popupWidth: 200,
            autoZoom: true, // boolean
            wmsScannerBaseUrl: "http://www.google.com/"
        );
        
        
        return validInstance;    
        
        
    }
    
    void testConstraints() {
        
        def x
        
        // Test valid instance
        x = getValidInstance()
        assertTrue x.validate()
        
        // Test invalid instance
        def testConfig = new Config()
        assertFalse testConfig.validate()
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
		

        testConfig = getValidInstance()
        testConfig.name = "1234"
        assertFalse testConfig.validate()
        assertEquals "size", testConfig.errors["name"]

        testConfig = getValidInstance()
        testConfig.name = "seriouslythisshouldbelongenoughasthisstringapearsinthebrowsertitleanditwontbeabletoshowmorethanthis"
        assertTrue testConfig.validate()

        testConfig = getValidInstance()
        testConfig.name = "asdf" * 200 
        assertFalse testConfig.validate()
        assertEquals "name size is too small", "size", testConfig.errors["name"]

        testConfig = getValidInstance()
        testConfig.initialBbox = "123456789"
        assertFalse testConfig.validate()
        assertEquals "bbox size is too small", "size", testConfig.errors["initialBbox"]

        testConfig = getValidInstance()
        testConfig.initialBbox = "123456789012345678901234567890123456789012345678901"
        assertFalse testConfig.validate()
        assertEquals "bbox size is too large", "size", testConfig.errors["initialBbox"]

        testConfig = getValidInstance()
        testConfig.downloadCartFilename= ""
        assertFalse testConfig.validate()
        assertEquals "blank", testConfig.errors["downloadCartFilename"]


        testConfig = getValidInstance()
        testConfig.downloadCartMaxNumFiles= 0
        assertFalse testConfig.validate()
        assertEquals "min", testConfig.errors["downloadCartMaxNumFiles"]


        testConfig = getValidInstance()
        testConfig.downloadCartMaxFileSize=  0
        assertFalse testConfig.validate()
        assertEquals "min", testConfig.errors["downloadCartMaxFileSize"]

        testConfig = getValidInstance()
        testConfig.downloadCartMimeTypeToExtensionMapping =  "["
        assertFalse testConfig.validate()
        assertEquals "size", testConfig.errors["downloadCartMimeTypeToExtensionMapping"]

        testConfig = getValidInstance()
        testConfig.downloadCartMimeTypeToExtensionMapping = "[" * 2001
        assertFalse testConfig.validate()
        assertEquals "size", testConfig.errors["downloadCartMimeTypeToExtensionMapping"]

        testConfig = getValidInstance()
        testConfig.downloadCartDownloadableProtocols = "[" * 256
        assertFalse testConfig.validate()
        assertEquals "size", testConfig.errors["downloadCartDownloadableProtocols"]

        testConfig = getValidInstance()
        testConfig.metadataLinkProtocols = "[" * 256
        assertFalse testConfig.validate()
        assertEquals "size", testConfig.errors["metadataLinkProtocols"]

        testConfig = getValidInstance()
        testConfig.metadataLayerProtocols = "[" * 256
        assertFalse testConfig.validate()
        assertEquals "size", testConfig.errors["metadataLayerProtocols"]

        testConfig = getValidInstance()
        testConfig.mapGetFeatureInfoBuffer = -1
        assertFalse testConfig.validate()
        assertEquals "min", testConfig.errors["mapGetFeatureInfoBuffer"]

        //testConfig = getValidInstance()
        //testConfig.wmsScannerBaseUrl = "http://invalidUrl"
        //assertFalse testConfig.validate()
        //assertEquals "url", testConfig.errors["wmsScannerBaseUrl"]
    }


}
