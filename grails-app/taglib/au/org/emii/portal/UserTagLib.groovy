package au.org.emii.portal

import org.apache.shiro.SecurityUtils
import org.springframework.web.servlet.handler.UserRoleAuthorizationInterceptor

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
    
    def loggedInUserInRole = { attrs, body ->
        def principal = SecurityUtils.subject?.principal

        if ( !principal ) return // No-one logged-in

        def user = User.get( principal )

        log.debug "Found user: $user"

        if ( !user ) return

        def targetRoles = UserRole.findAll("from UserRole as b where b.name in (:roleNames)", [roleNames:attrs.roles?.split(",")])


        def found = false
        targetRoles?.each(){
            found = found || (user.roles.contains(it))
        }

        if(found){
            out << body()
        }
    }
}