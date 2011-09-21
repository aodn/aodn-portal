package au.org.emii.portal

import grails.test.*

class OrganisationTypeTests extends GrailsUnitTestCase {
    
    def orgType
    
    protected void setUp() {
        super.setUp()
        
        mockForConstraintsTests(OrganisationType)
        
        orgType = new OrganisationType(description: "NGO")
    }

    protected void tearDown() {
        super.tearDown()
    }

    void testValidOrganisationType() {
        assertTrue "Validation should have succeeded (unchanged, valid instance)", orgType.validate()
    }
    
    void testDescriptionNullable() {
        
        // Description is null
        orgType.description = null
        assertFalse "Validation should have failed for null description", orgType.validate()
        assertEquals "nullable", orgType.errors.description
    }
    
    void testDescriptionBlank() {
        
        // Description is an empty String
        orgType.description = ""
        assertFalse "Validation should have failed for empty description", orgType.validate()
        assertEquals "blank", orgType.errors.description
    }
            
    void testToString() {
        
        assertEquals "NGO", orgType.toString()
    }
}