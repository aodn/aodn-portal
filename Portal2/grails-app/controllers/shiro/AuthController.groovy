package shiro

import org.apache.shiro.SecurityUtils
import org.apache.shiro.authc.AuthenticationException
import org.apache.shiro.authc.UsernamePasswordToken
import org.apache.shiro.web.util.SavedRequest
import org.apache.shiro.web.util.WebUtils
import au.org.emii.portal.Config
import au.org.emii.portal.User
import au.org.emii.portal.UserRole
import au.org.emii.portal.UserAccountCommand
import org.apache.shiro.crypto.hash.Sha256Hash
import org.apache.shiro.subject.Subject
import org.apache.commons.lang.RandomStringUtils
import org.apache.commons.validator.EmailValidator

class AuthController {
    def shiroSecurityManager

    def index = {
        redirect(action: "login", params: params)
    }

    def login = {
        return [ username: params.username, targetUri: params.targetUri, configInstance: Config.activeInstance() ]
    }

    def signIn = {
        def authToken = new UsernamePasswordToken(params.username?.toLowerCase(), params.password as String)
        
        authToken.rememberMe = true // Always remember user
        
        // If a controller redirected to this page, redirect back
        // to it. Otherwise redirect to the root URI.
        def targetUri = params.targetUri ?: "/"
               
        try{
            // Perform the actual login. An AuthenticationException
            // will be thrown if the username is unrecognised or the
            // password is incorrect.
            SecurityUtils.subject.login(authToken)

            log.info "Redirecting to '${targetUri}'."
            redirect(uri: targetUri)
        }
        catch (AuthenticationException ex){
            // Authentication failed, so display the appropriate message
            // on the login page.
            log.info "Authentication failure for user '${params.username}'."
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
    
    def register = {
        def configInstance = Config.activeInstance()
        def userAccountCmd = UserAccountCommand.from(new User())
        
        return [configInstance: configInstance, userAccountCmd: userAccountCmd]
    }
    
    def createUser = { UserAccountCommand userAccountCmd ->
          
        // Validate form
        if (!userAccountCmd.validate()) {
            render(view: "register", model: [userAccountCmd:userAccountCmd, configInstance: Config.activeInstance()])
            return
        }
        
        // Get user from form
        def userInstance = userAccountCmd.createUser()
        
        // Add user to "SelfRegisteredUser" role
        userInstance.addToRoles(UserRole.findByName("SelfRegisteredUser"))
        
        // Validate and save user
        if (!userInstance.hasErrors() && userInstance.save(flush: true)) {
            
            // Log in newly-created user
            Subject currentUser = SecurityUtils.getSubject()
            currentUser.login(new UsernamePasswordToken(userInstance.emailAddress, userAccountCmd.password))
            
            // Email newly-created user
            sendRegistrationNotifcationEmail(userInstance)
        
            redirect(controller: "home")
        }
        else {
            log.error "Could not save User instance during self-registration. params: '${params}'."
            flash.message = "${message(code: 'auth.account.registerFailed', default: 'Could not register. Please try again.')}"
            render(view: "register", model: [userAccountCmd: UserAccountCommand.from(userInstance), configInstance: Config.activeInstance()])
        }
    }
    
    def forgotPassword = {
        def configInstance = Config.activeInstance()
        return [configInstance: configInstance]
    }
    
    def resetPassword = {
        
        UserResetPasswordCommand userResetPasswordCommand ->
       
        if (userResetPasswordCommand.validate()) {
            
            def resetResult = userResetPasswordCommand.resetPassword()
            
            if (resetResult.user) {
                
                if (resetResult.user.hasErrors()) {
                    log.error "User has errors when trying to reset password"
                    resetResult.user.errors.allErrors.each{ log.error it }
                    
                    redirect(action: "forgotPassword")
                }
                
                sendPasswordResetAdviceEmail(resetResult.user, resetResult.newPassword)

                flash.message = "${message(code: 'auth.account.passwordReset', default: 'Password reset. New password has been emailed to {0}', args: [resetResult.user.emailAddress])}"
                redirect action: "login", params: [ username: userResetPasswordCommand.emailAddress ]
            }
            else {
                flash.message = "${message(code: 'auth.account.cantFindUser', default: 'Cannot find account with email address {0}', args: [resetResult.user.emailAddress])}"
            }                
        }
        else {

            render(view: "forgotPassword", model: [userResetPasswordCommand:userResetPasswordCommand, configInstance: Config.activeInstance()])
        }
    }
    
    // Email notifications
    def sendRegistrationNotifcationEmail(user) {
        
        sendMail  {  
            to user?.emailAddress
            from grailsApplication.config.grails.mail.authenticationFromEmailAddress
            subject message(code: 'mail.request.user.register.subject')
            body message(code: 'mail.request.user.register.body',
                         args: [user.firstName,
                                createLink(controller:'home', baseUrl: Config.activeInstance().applicationBaseUrl, absolute: true),
                                createLink(controller: 'auth', action: 'forgotPassword', baseUrl: Config.activeInstance().applicationBaseUrl, absolute: true)])
        }
    }
    
    def sendPasswordResetAdviceEmail(user, newPassword) {
        
        sendMail {  
            to user?.emailAddress
            from grailsApplication.config.grails.mail.authenticationFromEmailAddress
            subject message(code: 'mail.request.user.passwordReset.subject',
                            args: [user.firstName, user.lastName])
            body message(code: 'mail.request.user.passwordReset.body',
                         args: [user.firstName,
                                newPassword,
                                createLink(controller: 'user', action:'updateAccount', baseUrl: Config.activeInstance().applicationBaseUrl, absolute: true)])
        }
    }
}

class UserResetPasswordCommand {
    
    def emailAddress
    
    static constraints = {
        emailAddress(email: true, nullable: false, blank: false,
            validator: {val ->
            
                if (!EmailValidator.getInstance().isValid(val)) {
                    return "userResetPasswordCommand.emailAddress.invalid"
                }

                if (!User.findByEmailAddress(val.toLowerCase()))
                {
                    return "userResetPasswordCommand.emailAddress.doesntExist"
                }
            })
    }

    def resetPassword() {
          
        def user = User.findByEmailAddress(emailAddress.toLowerCase())
        
        if (user == null) {
            return null
        }
        
        String newPassword = newRandomPassword()
        user.setPasswordHash(new Sha256Hash(newPassword).toHex())
        
        // Save (errors will be checked-for in controller
        user.save(flush:true)
        
        return [user:user, newPassword: newPassword]
    }
    
    static String newRandomPassword() {
        return RandomStringUtils.randomAlphanumeric(10) // 10 charcter random password
    }
}