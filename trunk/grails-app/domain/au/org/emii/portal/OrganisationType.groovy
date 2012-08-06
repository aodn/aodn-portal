package au.org.emii.portal

class OrganisationType {

    String description
    
    static constraints = {
        description(blank: false, nullable: false)
    }
    
    String toString() {
        return description
    }
}
