package au.org.emii.portal

import grails.test.*

class AuthServiceTests extends GrailsUnitTestCase {
    
    def authService
        
    protected void setUp() {
        
        super.setUp()

        authService = new AuthService()
    }

    protected void tearDown() {
        
        super.tearDown()
    }

    void testNewRandomSalt() {

        def result = authService.newRandomSalt()
        
        assertNotNull result
        assertEquals 44, result.length()
        assertFalse authService.newRandomSalt().equals( authService.newRandomSalt() )
    }

    void testNewRandomPassword() {
        
        def result = authService.newRandomPassword()
        
        assertNotNull result
        assertEquals 10, result.length()
        assertFalse authService.newRandomPassword().equals( authService.newRandomPassword() )
    }

    void testGeneratePasswordHash() {

        def result = authService.generatePasswordHash( "salt", "password" )

        assertNotNull result
        assertEquals "13601bda4ea78e55a07b98866d2be6be0744e3866f13c00c811cab608a28f322", result
    }

    void testCombineForHash() {
        
        // Null salt
        try {
            authService.combineForHash null, "password"
            
            fail "Expected Exception to be thrown"
        }
        catch (IllegalArgumentException e) {
            
            assertEquals "Argument 'salt' may not be null", e.message
        }
        catch (Exception e) {
            
            fail "IllegalArgumentException expected but caught $e"
        }

        // Null password
        try {
            authService.combineForHash "salt", null

            fail "Expected Exception to be thrown"
        }
        catch (IllegalArgumentException e) {

            assertEquals "Argument 'password' may not be null", e.message
        }
        catch (Exception e) {

            fail "IllegalArgumentException expected but caught $e"
        }
        
        // Valid arguments
        def result = authService.combineForHash( "salt", "password" )

        assertNotNull result
        assertEquals "saltpassword", result
    }
}