package au.org.emii.portal

import org.apache.shiro.SecurityUtils

class UserTagLib {

    static namespace = "user"
    
    def loggedInUser = { attrs, body ->
        
        def subj = SecurityUtils.subject
        
        if ( !subj ) return // No-one logged-in
        
        def principal = subj.principal
        
        log.debug "Found principal: $principal"
        
        if ( !principal ) return // No-one logged-in
        
        def user = User.findByEmailAddress( principal )
        
        if ( !user ) return
        
        log.debug "Found user: $user"

        def prop = user[attrs.property]
        
        if ( prop ) out << prop
    }
}