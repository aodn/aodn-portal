class SecRole {
    String name

    static hasMany = [ users: SecUser, permissions: String ]
    static belongsTo = SecUser

    static constraints = {
        name(nullable: false, blank: false, unique: true)
    }
}
