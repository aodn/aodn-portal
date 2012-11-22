
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import org.apache.shiro.authc.AccountException
import org.apache.shiro.authc.SimpleAccount
import org.apache.shiro.authc.UnknownAccountException

class OpenIdDbRealm {

    static authTokenClass = au.org.emii.portal.OpenIdAuthenticationToken

    def credentialMatcher
    def shiroPermissionResolver

    def authenticate( authToken ) {

        log.info "Attempting to authenticate ${authToken.userId}..."
        def userId = authToken.userId
        
        // Null username is invalid
        if ( !userId ) throw new AccountException( "Cannot authenticate User will null userId." )

        // Get the user with the given username. If the user is not
        // found, then they don't have an account and we throw an
        // exception.
        def user = User.findById( userId )
        if ( !user ) throw new UnknownAccountException( "No account found for user with id ${ userId }" )

        log.info "Found user '${user.openIdUrl}' in DB"

        // Now check the user's password against the hashed value stored
        // in the database.
        def account = new SimpleAccount( userId, user.openIdUrl, "OpenIdDbRealm" )
//        if ( !credentialMatcher.doCredentialsMatch( authToken, account ) ) {
//            log.info "Invalid openIdUrl"
//            throw new IncorrectCredentialsException("Invalid openIdUrl for user '${userId}'")
//        }

        return account
    }

    def hasRole(principal, roleName) {

        log.debug "Checking hasRole($principal, $roleName)"

        def roles = User.withCriteria {
            roles {
                eq( "name", roleName )
            }
            eq( "id", principal )
        }

        return roles.size() > 0
    }

    def hasAllRoles(principal, roles) {

        log.debug "Checking hasAllRoles($principal, $roles)"

        def r = User.withCriteria {
            roles {
                'in'( "name", roles )
            }
            eq( "id", principal )
        }

        return r.size() == roles.size()
    }

    def isPermitted(principal, requiredPermission) {

        // Does the user have the given permission directly associated
        // with himself?
        //
        // First find all the permissions that the user has that match
        // the required permission's type and project code.
        def user = User.get( principal )

        log.debug "Calling isPermitted($principal, $requiredPermission); Found user: $user"

        if ( !user ) {

            log.error "Called isPermitted() but could not find User for principal: '$principal'; requiredPermission: '$requiredPermission'"
            return false
        }

        def permissions = user.permissions

        // Try each of the permissions found and see whether any of
        // them confer the required permission.
        def retval = permissions?.find { permString ->
            // Create a real permission instance from the database
            // permission.
            def perm = shiroPermissionResolver.resolvePermission(permString)

            // Now check whether this permission implies the required
            // one.
            return perm.implies( requiredPermission )
        }

        if ( retval ) {
            // Found a matching permission!
            return true
        }

        // If not, does he gain it through a role?
        //
        // Get the permissions from the roles that the user does have.
        def results = User.executeQuery("select distinct p from User as user join user.roles as role join role.permissions as p where user.id = '$principal'")

        // There may be some duplicate entries in the results, but
        // at this stage it is not worth trying to remove them. Now,
        // create a real permission from each result and check it
        // against the required one.
        retval = results.find { permString ->
            // Create a real permission instance from the database
            // permission.
            def perm = shiroPermissionResolver.resolvePermission(permString)

            // Now check whether this permission implies the required
            // one.
            return perm.implies( requiredPermission )
        }

        return retval != null
    }
}
