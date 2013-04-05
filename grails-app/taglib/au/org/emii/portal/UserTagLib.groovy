
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import org.apache.shiro.SecurityUtils

class UserTagLib {

    static namespace = "user"

    def loggedInUser = { attrs, body ->

		def user = _currentUser()
        if ( !user ) return

        def prop = user[attrs.property]

        if ( prop ) out << prop.encodeAsHTML()
    }

    def loggedInUserInRole = { attrs, body ->

		def user = _currentUser()
        if ( !user ) return

        def targetRoles = UserRole.findAll("from UserRole as b where b.name in (:roleNames)", [roleNames:attrs.roles?.split(",")])

        def found = false
        targetRoles?.each(){

			found = found || (user.roles.contains(it))
        }

        if (found) {
            out << body()
        }
    }

	def _currentUser() {

		def principal = SecurityUtils.subject?.principal

		if ( !principal ) return // No-one logged-in

		def user = User.get( principal )

		log.debug "Found user: $user"

		return user
	}
}
