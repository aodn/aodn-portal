package au.org.emii.portal

import grails.test.*

class UserAccountCommandTests extends GrailsUnitTestCase {
    
    UserAccountCommand createUserCmd
    UserAccountCommand updateUserCmd
    
    protected void setUp() {
        super.setUp()
        
        def user = new User(emailAddress: "admin@utas.edu.au", firstName: "Fred", lastName: "Nurk", passwordHash: "Not null, Not Blank")
        
        mockForConstraintsTests UserAccountCommand
        mockDomain User, [user]
        
        createUserCmd = new UserAccountCommand(emailAddress: "admin@utas.edu.au",
                                               previousEmailAddress: "admin@utas.edu.au",
                                               firstName: "Bob",
                                               lastName: "Brown",
                                               passwordRequired: true,
                                               password: "password",
                                               passwordConfirmation: "password")
                                           
        updateUserCmd = new UserAccountCommand(emailAddress: "admin@utas.edu.au",
                                               previousEmailAddress: "admin@utas.edu.au",
                                               firstName: "Bob",
                                               lastName: "Brown",
                                               passwordRequired: false)
    }

    protected void tearDown() {
        super.tearDown()
    }

    void testValidUserAccountCommandForCreate() {
        assertTrue "Validation should have succeeded (unchanged, valid instance)", createUserCmd.validate()
    }

    void testValidUserAccountCommandForUpdate() {
        assertTrue "Validation should have succeeded (unchanged, valid instance)", updateUserCmd.validate()
    }
    
    void testFirstNameNullable() {
        
        // FirstName is null
        updateUserCmd.firstName = null
        assertFalse "Validation should have failed for null firstName", updateUserCmd.validate()
        assertEquals "nullable", updateUserCmd.errors.firstName
    }
    
    void testFirstNameBlank() {
        
        // FirstName is blank
        updateUserCmd.firstName = ""        
        assertFalse "Validation should have failed for empty firstName", updateUserCmd.validate()
        assertEquals "blank", updateUserCmd.errors.firstName
    }
    
    void testLastNameNullable() {
       
        // LastName is null
        updateUserCmd.lastName = null
        assertFalse "Validation should have failed for null lastName", updateUserCmd.validate()
        assertEquals "nullable", updateUserCmd.errors.lastName
    }
    
    void testLastNameBlank() {
       
        // LastName is blank
        updateUserCmd.lastName = ""
        assertFalse "Validation should have failed for empty lastName", updateUserCmd.validate()
        assertEquals "blank", updateUserCmd.errors.lastName
    }
    
    void testEmailAddressNullable() {
        
        // EmailAddress is null
        updateUserCmd.emailAddress = null
        assertFalse "Validation should have failed for null emailAddress", updateUserCmd.validate()
        assertEquals "nullable", updateUserCmd.errors.emailAddress
    }
    
    void testEmailAddressBlank() {
                       
        // EmailAddress is blank
        updateUserCmd.emailAddress = ""        
        assertFalse "Validation should have failed for empty emailAddress", updateUserCmd.validate()
        assertEquals "blank", updateUserCmd.errors.emailAddress
    }
    
    void testEmailAddressEmail() {
        
        // EmailAddress is invalid
        updateUserCmd.emailAddress = "admin[at]utas.edu.au"        
        assertFalse "Validation should have failed for invalid emailAddress", updateUserCmd.validate()
        assertEquals "email", updateUserCmd.errors.emailAddress
    }
    
    void testEmailAddressUnique() {
        
        def userAcctCmd2 = new UserAccountCommand(emailAddress: "admin@utas.edu.au",
                                                  firstName: "Bob",
                                                  lastName: "Brown",
                                                  passwordRequired: false)
        
        def userAcctCmd3 = new UserAccountCommand(emailAddress: "b-man@utas.edu.au",
                                                  previousEmailAddress: "brian@utas.edu.au",
                                                  firstName: "Brian",
                                                  lastName: "Griffin",
                                                  passwordRequired: false)
        
        // EmailAddress is unique
        assertFalse "Validation should have failed for duplicate emailAddress", userAcctCmd2.validate()
        assertEquals "userAccountCommand.emailAddress.conflict", userAcctCmd2.errors.emailAddress
        
        // EmailAddress is unique
        assertTrue "Validation should have succeeded for unique emailAddress", userAcctCmd3.validate()
    }
    
    void testPasswordNullable() {
        
        createUserCmd.password = null
        updateUserCmd.password = null
        
        assertFalse "Validation should have failed for null password on createUserCmd", createUserCmd.validate()
        assertEquals "userAccountCommand.password.required", createUserCmd.errors.password
        
        assertTrue "Validation should have succeeded for null password on updateUserCmd", updateUserCmd.validate()
    }
    
    void testPasswordConfirmationNullable() {
        createUserCmd.passwordConfirmation = null
        
        assertFalse "Validation should have failed for null passwordConfirmation on createUserCmd", createUserCmd.validate()
        assertEquals "userAccountCommand.passwordConfirmation.required", createUserCmd.errors.passwordConfirmation
    }
    
    void testPasswordConfirmationMatch() {
        
        updateUserCmd.passwordConfirmation = "notPassword"
        
        assertFalse "Validation should have failed for mismatched password on updateUserCmd", updateUserCmd.validate()
        assertEquals "userAccountCommand.passwordConfirmation.mismatch", updateUserCmd.errors.passwordConfirmation
    }
}