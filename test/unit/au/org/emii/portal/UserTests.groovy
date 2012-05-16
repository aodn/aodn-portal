package au.org.emii.portal

import grails.test.*

class UserTests extends GrailsUnitTestCase {
    
    def user
    
    protected void setUp() {

        super.setUp()
        
        mockForConstraintsTests User
        
        user = new User( openIdUrl: "http://www.example.com/openId",
                         emailAddress: "admin@utas.edu.au",
                         fullName: "Joe Bloggs")
    }

    protected void tearDown() {

        super.tearDown()
    }
    
    void testValidUser() {

        assertTrue "Validation should have succeeded (unchanged, valid instance)", user.validate()
    }

    void testToString() {
        
        assertEquals "Joe Bloggs (http://www.example.com/openId)", user.toString()
    }
}