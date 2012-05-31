package au.org.emii.portal

class User {

    String openIdUrl
    String emailAddress
    String fullName
    
    // Relationships
    static hasMany = [ roles: UserRole, permissions: String, aodaacJobs: AodaacJob ]
    
    static constraints = {

        openIdUrl unique: true, blank: false
        emailAddress blank: false
        fullName blank: false
    }

    User() {

        emailAddress = "<Not set>"
        fullName = "<Not set>"
    }

    // db mapping
    static mapping = {
        table 'portal_user'
    }
    
    @Override
    public String toString() {

        return "${fullName} (${openIdUrl})"
    }
}