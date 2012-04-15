package shiro

import grails.test.FiltersUnitTestCase
import grails.test.MockUtils
import org.codehaus.groovy.grails.plugins.web.filters.FilterConfig

class SecurityFiltersTests extends FiltersUnitTestCase {
    
    protected void setUp() {
        
        super.setUp()
        
        MockUtils.mockLogging SecurityFilters, true
    }

    protected void tearDown() {
        
        super.tearDown()
        
        FilterConfig.metaClass = null
    }

    // Todo - DN: Automate test for all Controllers and test that required ones have filter? (tests will be more meaningful)

    void testHomeControllerFilter() {

        checkFilter "homeAccess"
    }
    
    void testSplashControllerFilter() {
        
        checkFilter "splashAccess"
    }
    
    void testConfigControllerFilter() {
        
        checkFilter "configAccess"
    }

    void testDepthControllerFilter() {

        checkFilter "depthAccess"
    }

    void testServerControllerFilter() {
        
        checkFilter "serverAccess"
    }
    
    void testLayerControllerFilter() {
        
        checkFilter "layerAccess" 
    }

    void testMenuControllerFilter() {

        checkFilter "menuAccess"
    }

    void testProxyControllerFilter() {
        
        checkFilter "proxyAccess"
    }
    
    void testDownloadCartControllerFilter() {
        
        checkFilter "downloadCartAccess"
    }

    void testAllFilter() {
        
        FilterConfig filter = initFilter( "all" )
        setActionName "ActionNameInTest"
        FilterConfig.metaClass.accessControl = { args -> return false }

        // Check filter
        assertNotNull "'all' filter should exist", filter
        assertExistsBefore "all"
        
        def filterResult
        
        // Test access allowed for null controller name
        setControllerName null
        
        filterResult = filter.before()
        
        assertTrue "Filter result should be true (for no controller name)", filterResult
        
        // Test access allowed for accessAllowed = true
        setControllerName "ControllerNameInTest"
        filter.request.accessAllowed = true
        
        filterResult = filter.before()
        
        assertTrue "Filter result should be true (for request.accessAllowed = true)", filterResult
        
        // Test access allowed for accessAllowed = false and controllerName != null
        filter.request.accessAllowed = false
        
        filterResult = filter.before()
        
        assertFalse "Filter result should be false", filterResult
    }
    
    void checkFilter(String filterName) {
        
        setControllerName "ControllerNameInTest"
        setActionName "ActionNameInTest"
        
        FilterConfig filter = initFilter( filterName )
        assertNotNull filterName + " filter should exist", filter
        assertExistsBefore filterName
        
        assertEquals "accessAllowed should be null to start with", null, filter.request.accessAllowed
        
        // Run filter
        filter.before() 
        
        assertEquals "accessAllowed should be true now", true, filter.request.accessAllowed
    }
}