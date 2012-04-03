package au.org.emii.portal

import org.apache.commons.validator.EmailValidator

class UserResetPasswordCommand {

    def emailAddress

    static constraints = {
        emailAddress(email: true, nullable: false, blank: false,
                validator: { val ->

                    if ( !EmailValidator.getInstance().isValid( val?.toString() ) ) {
                        return "userResetPasswordCommand.emailAddress.invalid"
                    }

                    if ( !User.findByEmailAddress( val.toLowerCase() ) ) {

                        return "userResetPasswordCommand.emailAddress.doesntExist"
                    }
                })
    }

    def resetPassword( authService ) {

        def user = User.findByEmailAddress( emailAddress.toLowerCase() )

        if ( !user ) return null

        def newPassword = authService.newRandomPassword()
        def newSalt = authService.newRandomSalt()

        user.passwordSalt = newSalt
        user.passwordHash = authService.generatePasswordHash( newSalt, newPassword )

        // Save (errors will be checked-for in controller)
        user.save( flush:true )

        return [user:user, newPassword: newPassword]
    }
}
