package shiro

import au.org.emii.portal.*
import org.apache.shiro.SecurityUtils
import org.apache.shiro.authc.AuthenticationException

class AuthController {

    def shiroSecurityManager
    def authService

    def index = {
        redirect(action: "login", params: params)
    }

    def login = {
        return [ username: params.username, targetUri: params.targetUri, configInstance: Config.activeInstance() ]
    }

    def signIn = {
        def authToken = new SaltedUsernamePasswordToken( authService, params.username?.toLowerCase(), params.password )

        // If a controller redirected to this page, redirect back
        // to it. Otherwise redirect to the root URI.
        def targetUri = params.targetUri ?: "/"
               
        try {
            // Perform the actual login. An AuthenticationException
            // will be thrown if the username is unrecognised or the
            // password is incorrect.
            SecurityUtils.subject.login authToken

            log.info "Redirecting to '${targetUri}'."
            redirect(uri: targetUri)
        }
        catch ( AuthenticationException ex ) {
            // Authentication failed, so display the appropriate message
            // on the login page.
            log.debug "Authentication failure for user '${params.username}'."
            flash.message = message(code: "login.failed")

            // Keep the username so the user doesn't have to enter it again
            def m = [ username: params.username ]

            // Remember the target URI too.
            if (params.targetUri) {
                m["targetUri"] = params.targetUri
            }

            // Now redirect back to the login page.
            redirect(action: "login", params: m, configInstance: Config.activeInstance())
        }
    }

    def signOut = {
        // Log the user out of the application.
        SecurityUtils.subject?.logout()

        // For now, redirect back to the home page.
        redirect(uri: "/")
    }

    def unauthorized = {
        render "You do not have permission to access this page."
    }
}