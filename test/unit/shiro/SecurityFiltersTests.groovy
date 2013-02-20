
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package shiro

import grails.test.FiltersUnitTestCase
import grails.test.MockUtils
import org.codehaus.groovy.grails.plugins.web.filters.FilterConfig
import au.org.emii.portal.User
import au.org.emii.portal.Server
import au.org.emii.portal.Layer
import org.apache.shiro.subject.Subject
import org.apache.shiro.util.ThreadContext
import org.apache.shiro.SecurityUtils
import au.org.emii.portal.Filter
import au.org.emii.portal.UserRole

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

    void testEditFiltersAccess() {
        def user = new User(openIdUrl : "aaaaaaaa@afaaa.com", emailAddress : "aaaaaaaa@afaaa.com",
                fullName : "aaaaaaaa@afaaa.com")
        mockDomain(User, [user])

        Server.constraints = {}
        def server = new Server(uri : "http://uri1.com", shortAcron : "A1", name : "name1", owners: [user])
        mockDomain(Server, [server])

        def layer = new Layer(name : "layer1", abstractTrimmed : "description", server: server);
        mockDomain(Layer, [layer])


        def filter = new Filter(name:"la",layer:layer,label:"lala")
        mockDomain(Filter, [filter])

        def subject = [ getPrincipal: { user.id },
                isAuthenticated: { true }
        ] as Subject

        ThreadContext.put( ThreadContext.SECURITY_MANAGER_KEY,
                [ getSubject: { subject } ] as SecurityManager )

        SecurityUtils.metaClass.static.getSubject = { subject }

        checkFilter "editFiltersAccess", [id:layer.id]
    }

    void testFilterSaveAccess() {
        def user = new User(openIdUrl : "aaaaaaaa@afaaa.com", emailAddress : "aaaaaaaa@afaaa.com",
                fullName : "aaaaaaaa@afaaa.com")
        mockDomain(User, [user])

        Server.constraints = {}
        def server = new Server(uri : "http://uri1.com", shortAcron : "A1", name : "name1", owners: [user])
        mockDomain(Server, [server])

        def layer = new Layer(name : "layer1", abstractTrimmed : "description", server: server);
        mockDomain(Layer, [layer])


        def filter = new Filter(name:"la",layer:layer,label:"lala")
        mockDomain(Filter, [filter])

        def subject = [ getPrincipal: { user.id },
                isAuthenticated: { true }
        ] as Subject

        ThreadContext.put( ThreadContext.SECURITY_MANAGER_KEY,
                [ getSubject: { subject } ] as SecurityManager )

        SecurityUtils.metaClass.static.getSubject = { subject }

        checkFilter "filterSaveAccess", [layerId:layer.id]
    }

    void testFilterAccess() {
        def user = new User(openIdUrl : "aaaaaaaa@afaaa.com", emailAddress : "aaaaaaaa@afaaa.com",
                fullName : "aaaaaaaa@afaaa.com")
        mockDomain(User, [user])

        Server.constraints = {}
        def server = new Server(uri : "http://uri1.com", shortAcron : "A1", name : "name1", owners: [user])
        mockDomain(Server, [server])

        def layer = new Layer(name : "layer1", abstractTrimmed : "description", server: server);
        mockDomain(Layer, [layer])


        def filter = new Filter(name:"la",layer:layer,label:"lala")
        mockDomain(Filter, [filter])

        def subject = [ getPrincipal: { user.id },
                isAuthenticated: { true }
        ] as Subject

        ThreadContext.put( ThreadContext.SECURITY_MANAGER_KEY,
                [ getSubject: { subject } ] as SecurityManager )

        SecurityUtils.metaClass.static.getSubject = { subject }

        checkFilter "filterAccess", [id:filter.id]
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
        checkFilter filterName, null
    }
    
    void checkFilter(String filterName, def params) {
        
        setControllerName "ControllerNameInTest"
        setActionName "ActionNameInTest"
        
        FilterConfig filter = initFilter( filterName )
        assertNotNull filterName + " filter should exist", filter
        assertExistsBefore filterName
        
        assertEquals "accessAllowed should be null to start with", null, filter.request.accessAllowed
        
        // Run filter
        if (params) {
            filter.params.putAll(params)
        }
        filter.before()

        assertEquals "accessAllowed should be true now", true, filter.request.accessAllowed
    }
}
