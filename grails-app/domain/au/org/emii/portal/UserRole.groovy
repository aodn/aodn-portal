package au.org.emii.portal

class UserRole {
    String name

    static hasMany = [ users: User, permissions: String ]
    static belongsTo = User

    static constraints = {
        name(nullable: false, blank: false, unique: true)
    }
    
    @Override
    public String toString() {
        
        return name
    }
}
