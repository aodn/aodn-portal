package au.org.emii.portal

import grails.test.*

class UserTests extends GrailsUnitTestCase {
    
    def user
    
    protected void setUp() {
        super.setUp()
        
        mockForConstraintsTests(User)
        
        user = new User(emailAddress: "admin@utas.edu.au",
                        firstName: "Joe",
                        lastName: "Bloggs",
                        passwordHash: "some value (not actually Sha256 hashed though...)")
    }

    protected void tearDown() {
        super.tearDown()
    }
    
    void testValidUser() {
        assertTrue "Validation should have succeeded (unchanged, valid instance)", user.validate()
    }
    
    void testEmailAddressNullable() {
        
        // EmailAddress is null
        user.emailAddress = null
        assertFalse "Validation should have failed for null emailAddress", user.validate()
        assertEquals "nullable", user.errors.emailAddress
    }
    
    void testEmailAddressFieldBlank() {
                       
        // EmailAddress is blank
        user.emailAddress = ""        
        assertFalse "Validation should have failed for empty emailAddress", user.validate()
        assertEquals "blank", user.errors.emailAddress
    }
    
    void testEmailAddressEmail() {
        
        // EmailAddress is invalid
        user.emailAddress = "admin[at]utas.edu.au"        
        assertFalse "Validation should have failed for invalid emailAddress", user.validate()
        assertEquals "email", user.errors.emailAddress
    }
    
    void testEmailAddressUnique() {
        
        def user2 = new User(emailAddress: "admin@utas.edu.au", firstName: "Fred", lastName: "Nurk", passwordHash: "Not null, Not Blank")
        def user3 = new User(emailAddress: "jorge@utas.edu.au", firstName: "Jorge", lastName: "McTavish", passwordHash: "Not null, Not Blank")
        mockForConstraintsTests(User, [user])
        
        // EmailAddress is unique
        assertFalse "Validation should have failed for duplicate emailAddress", user2.validate()
        assertEquals "unique", user2.errors.emailAddress
        
        // EmailAddress is unique
        assertTrue "Validation should have succeeded for unique emailAddress", user3.validate()
    }
    
    void testFirstNameNullable() {
        
        // FirstName is null
        user.firstName = null
        assertFalse "Validation should have failed for null firstName", user.validate()
        assertEquals "nullable", user.errors.firstName
    }
    
    void testFirstNameBlank() {
        
        // FirstName is blank
        user.firstName = ""        
        assertFalse "Validation should have failed for empty firstName", user.validate()
        assertEquals "blank", user.errors.firstName
    }
    
    void testLastNameNullable() {
       
        // LastName is null
        user.lastName = null
        assertFalse "Validation should have failed for null lastName", user.validate()
        assertEquals "nullable", user.errors.lastName
    }
    
    void testLastNameBlank() {
       
        // LastName is blank
        user.lastName = ""
        assertFalse "Validation should have failed for empty lastName", user.validate()
        assertEquals "blank", user.errors.lastName
    }
    
    void testPasswordHashNullable() {
        
        // PasswordHash is null
        user.passwordHash = null
        assertFalse "Validation should have failed for null passwordHash", user.validate()
        assertEquals "nullable", user.errors.passwordHash
    }
    
    void testPasswordHashBlank() {
        
        // PasswordHash is blank
        user.passwordHash = ""
        assertFalse "Validation should have failed for empty passwordHash", user.validate()
        assertEquals "blank", user.errors.passwordHash
    }
    
    void testToString() {
        
        assertEquals "Joe Bloggs (admin@utas.edu.au)", user.toString()
    }
}