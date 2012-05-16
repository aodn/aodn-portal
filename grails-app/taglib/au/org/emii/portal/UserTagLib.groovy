package au.org.emii.portal

import org.apache.shiro.SecurityUtils

class UserTagLib {

    static namespace = "user"
    
    def loggedInUser = { attrs, body ->
        
        def principal = SecurityUtils.subject?.principal

        if ( !principal ) return // No-one logged-in

        def user = User.get( principal )

        log.debug "Found user: $user"

        if ( !user ) return

        def prop = user[attrs.property]

        if ( prop ) out << prop.encodeAsHTML()
    }
}