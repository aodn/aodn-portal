package au.org.emii.portal

import grails.test.*
import org.apache.shiro.subject.*
import org.apache.shiro.SecurityUtils

class UserTagLibTests extends TagLibUnitTestCase {
    
    // Subjects
    def authdSubjectPrincipal = "sys.admin@emii.org.au"
    def authdSubject = [ getPrincipal: { authdSubjectPrincipal },
                         isAuthenticated: { true },
                         hasRole: { true } ,
                         toString: { return "authdSubject" },
                         logout: { authdSubjectPrincipal = null }
                       ] as Subject
    
    // Users
    def user1FirstName = "Stan"
    def user1 = new User(emailAddress: authdSubjectPrincipal, firstName: user1FirstName)
    
    def user2 = new User(emailAddress: "billg@microsoft.com", firstName: "William")
    
    protected void setUp() {
        super.setUp()
        
        mockDomain User, [user1, user2]
        mockLogging UserTagLib
    }

    protected void tearDown() {
        
        super.tearDown()
    }

    void testLoggedInUser_NoUserLoggedIn_EmptyOutput() {

        // Esnure no-one is logged-in
        SecurityUtils.metaClass.static.getSubject = { null }
        
        tagLib.loggedInUser(property: 'firstName') {}
        
        assertEquals "No logged-in User should return empty String", "", tagLib.out.toString()
    }
    
    void testLoggedInUser_ExistingPropertyRequested_RequestedPropertyOutput() {

        SecurityUtils.metaClass.static.getSubject = { authdSubject }
        
        tagLib.loggedInUser(property: 'firstName') {}
        
        assertEquals "Should return name of logged-in user", user1FirstName, tagLib.out.toString()
    }
    
    void testLoggedInUser_NonExistingPropertyRequested_EmptyOutput() {

        SecurityUtils.metaClass.static.getSubject = { authdSubject }
        
        tagLib.loggedInUser(property: 'lastName') {}
        
        assertEquals "Value of property lastName is blank in User. Tag should return empty String.", "", tagLib.out.toString()
    }
}
