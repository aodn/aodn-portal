package shiro

import grails.test.*
import au.org.emii.portal.*
import org.codehaus.groovy.grails.plugins.web.filters.FilterConfig

class SecurityFiltersTests extends FiltersUnitTestCase {
    
    protected void setUp() {
        super.setUp()
        
        SecurityFilters.metaClass.logRequest = {String a, String b, String c -> }
    }

    protected void tearDown() {
        super.tearDown()
    }

    void testHomeControllerFilter() {

        checkFilter('homeAccess')
    }
    
    void testConfigControllerFilter() {
        
        checkFilter('configAccess')
    }
    
    void testServerControllerFilter() {
        
        checkFilter('serverAccess')
    }
    
    void testLayerControllerFilter() {
        
        checkFilter('layerAccess')
    }
    
    void testProxyControllerFilter() {
        
        checkFilter('proxyAccess')
    }
    
    void testAuthControllerFilter() {
        
        checkFilter('authAccess')
    }
    
    void testAllFilter() {
        
        FilterConfig filter = initFilter("all")
        setActionName("ActionNameInTest")
        FilterConfig.metaClass.accessControl = {args -> return false}

        // Check filter
        assertNotNull "'all' filter should exist", filter
        assertExistsBefore("all")
        
        def filterResult
        
        // Test access allowed for null controller name
        setControllerName(null)
        
        filterResult = filter.before()
        
        assertTrue "Filter result should be true (for no controller name)", filterResult
        
        // Test access allowed for accessAllowed = true
        setControllerName("ControllerNameInTest")
        filter.request.accessAllowed = true
        
        filterResult = filter.before()
        
        assertTrue "Filter result should be true (for request.accessAllowed = true)", filterResult
        
        // Test access allowed for accessAllowed = false and controllerName != null
        filter.request.accessAllowed = false
        
        filterResult = filter.before()
        
        assertFalse "Filter result should be false", filterResult
    }
    
    void checkFilter(String filterName) {
        
        setControllerName("ControllerNameInTest")
        setActionName("ActionNameInTest")
        
        FilterConfig filter = initFilter(filterName)
        assertNotNull filterName + " filter should exist", filter
        assertExistsBefore(filterName)
        
        assertEquals "accessAllowed should be null to start with", null, filter.request.accessAllowed
        
        // Run filter
        filter.before() 
        
        assertEquals "accessAllowed should be true now", true, filter.request.accessAllowed
    }
}