package au.org.emii.portal

import grails.test.*

class UserRoleTests extends GrailsUnitTestCase {
    
    def userRole
    
    protected void setUp() {
        super.setUp()
        
        mockForConstraintsTests(UserRole)
        
        userRole = new UserRole(name: "TheRole")
    }

    protected void tearDown() {
        super.tearDown()
    }

    void testValidUserRole() {
        assertTrue "Validation should have succeeded (unchanged, valid instance)", userRole.validate()
    }
    
    void testNameNullable() {
        userRole.name = null
        assertFalse "Validation should have failed for null name", userRole.validate()
        assertEquals "nullable", userRole.errors.name
    }
    
    void testNameBlank() {
        userRole.name = ""
        assertFalse "Validation should have failed for blank name", userRole.validate()
        assertEquals "blank", userRole.errors.name
    }
    
    void testNameUnique() {
        def userRole2 = new UserRole(name: "TheRole")
        mockForConstraintsTests(UserRole, [userRole])
        
        assertFalse "Validation should have failed", userRole2.validate()
        assertEquals "unique", userRole2.errors.name
    }
    
    void testToString() {
        
        assertEquals "TheRole", userRole.toString()
    }
}
