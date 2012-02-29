package au.org.emii.portal

import org.apache.shiro.authc.UsernamePasswordToken

class SaltedUsernamePasswordToken extends UsernamePasswordToken {

    def authService

    def username
    def password
    def salt

    SaltedUsernamePasswordToken( authService ) {

        this.authService = authService

        setRememberMe true
    }

    SaltedUsernamePasswordToken( authService, username, password ) {

        this.authService = authService
        this.username = username
        this.password = password

        setRememberMe true
    }

    @Override
    def getCredentials() {

        return authService.combineForHash( salt, password )
    }
}