
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

class UserRole {
    public static String SERVEROWNER = "ServerOwner"
    public static String ADMINISTRATOR = "Administrator"
    public static String SELFREGISTERED = "SelfRegisteredUser"

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
