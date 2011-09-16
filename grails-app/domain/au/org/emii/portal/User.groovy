package au.org.emii.portal

class User {
    
    // Fields
    String emailAddress
    String firstName
    String lastName
    String passwordHash
    
    String address
    String state
    String postcode
    String country
    
    String organisation
    OrganisationType orgType
    
    // Relationships
    static hasMany = [ roles: UserRole, permissions: String ]
    
    // Field constraints
    static constraints = {
        emailAddress(unique: true, email: true, blank: false)
        firstName(nullable: false, blank: false)
        lastName(nullable: false, blank: false)
        passwordHash(nullable: false, blank: false)
        
        address(nullable: true)
        state(nullable: true)
        postcode(nullable: true)
        country(nullable: true)

        organisation(nullable: true)
        orgType(nullable: true)
    }
    
    // db mapping
    static mapping = {
        table 'portal_user'
    }
    
    @Override
    public String toString() {
        
        return String.format("%s %s (%s)", firstName, lastName, emailAddress)
    }
}
