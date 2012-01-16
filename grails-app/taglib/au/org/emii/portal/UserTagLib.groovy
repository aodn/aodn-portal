package au.org.emii.portal

import org.apache.shiro.SecurityUtils

class UserTagLib {

    static namespace = "user"
    
    def loggedInUser = { attrs, body ->
        
        def subj = SecurityUtils.subject
        
        if ( !subj ) return // No-one logged-in
        
        def principal = subj.principal
        
        log.debug "Found principal: $principal"
        
        def user = User.findByEmailAddress( principal )
        
        if ( !user ) return
        
        log.debug "Found user: $user"
        
        def s

        if ( attrs?.property ) {
            
            s = user[attrs.property] 
        }
        
        out << s ? s : user.toString()
    }
}