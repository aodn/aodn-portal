package au.org.emii.portal

import org.apache.shiro.SecurityUtils
import org.apache.shiro.subject.Subject
import org.apache.shiro.authc.UsernamePasswordToken

class UserController {

    static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

    def index = {
        redirect(action: "list", params: params)
    }

    def list = {
        [userInstanceList: User.list(params), userInstanceTotal: User.count()]
    }

    def create = {
        def userInstance = new User()
        userInstance.properties = params
        return [userInstance: userInstance]
    }

    def save = {
        def userInstance = new User(params)
        if (userInstance.save(flush: true)) {
            flash.message = "${message(code: 'default.created.message', args: [message(code: 'user.label', default: 'User'), userInstance.id])}"
            redirect(action: "show", id: userInstance.id)
        }
        else {
            render(view: "create", model: [userInstance: userInstance])
        }
    }

    def show = {
        def userInstance = User.get(params.id)
        if (!userInstance) {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'user.label', default: 'User'), params.id])}"
            redirect(action: "list")
        }
        else {
            [userInstance: userInstance]
        }
    }

    def edit = {
        def userInstance = User.get(params.id)
        if (!userInstance) {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'user.label', default: 'User'), params.id])}"
            redirect(action: "list")
        }
        else {
            return [userInstance: userInstance]
        }
    }

    def update = {
        def userInstance = User.get(params.id)
        if (userInstance) {
            if (params.version) {
                def version = params.version.toLong()
                if (userInstance.version > version) {
                    
                    userInstance.errors.rejectValue("version", "default.optimistic.locking.failure", [message(code: 'user.label', default: 'User')] as Object[], "Another user has updated this User while you were editing")
                    render(view: "edit", model: [userInstance: userInstance])
                    return
                }
            }
            userInstance.properties = params
            if (!userInstance.hasErrors() && userInstance.save(flush: true)) {
                flash.message = "${message(code: 'default.updated.message', args: [message(code: 'user.label', default: 'User'), userInstance.id])}"
                redirect(action: "show", id: userInstance.id)
            }
            else {
                render(view: "edit", model: [userInstance: userInstance])
            }
        }
        else {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'user.label', default: 'User'), params.id])}"
            redirect(action: "list")
        }
    }

    def delete = {
        def userInstance = User.get(params.id)
        if (userInstance) {
            try {
                userInstance.delete(flush: true)
                flash.message = "${message(code: 'default.deleted.message', args: [message(code: 'user.label', default: 'User'), params.id])}"
                redirect(action: "list")
            }
            catch (org.springframework.dao.DataIntegrityViolationException e) {
                flash.message = "${message(code: 'default.not.deleted.message', args: [message(code: 'user.label', default: 'User'), params.id])}"
                redirect(action: "show", id: params.id)
            }
        }
        else {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'user.label', default: 'User'), params.id])}"
            redirect(action: "list")
        }
    }
    
    def updateAccount = {
    
        def userEmailAddress = SecurityUtils.getSubject().getPrincipal()
        def currentUser = User.findByEmailAddress(userEmailAddress.toLowerCase())
        def userAccountCmd = UserAccountCommand.from(currentUser)
        userAccountCmd.passwordRequired = false
        
        log.debug "Sending to updateAccount page for currentUser: " + currentUser
        log.debug "userAccountCmd: " + userAccountCmd
        
        return [userAccountCmd: userAccountCmd]
    }
    
    def userUpdateAccount = { UserAccountCommand userAccountCmd ->

        log.debug "userAccountCmd: " + userAccountCmd

        if (!userAccountCmd.validate()) {
            render(view: "updateAccount", model: [userAccountCmd:userAccountCmd])
            return
        }
        
        def userInstance = userAccountCmd.updateUser()

        log.debug "userInstance: " + userInstance

        if (userInstance) {
            if (params.version) {
                def version = params.version.toLong()
                if (userInstance.version > version) {

                    userInstance.errors.rejectValue("version", "default.optimistic.locking.failure", [message(code: 'user.label', default: 'User')] as Object[], "Another user has updated your account while you were editing it")
                    render(view: "updateAccount", model: [userAccountCmd: userAccountCmd])
                    return
                }
            }
            
            // Validate and save
            if (!userInstance.hasErrors() && userInstance.save(flush: true)) {

                log.debug "userAccountCmd.orgType: " + userAccountCmd.orgType
                log.debug "userInstance.orgType: " + userInstance.orgType
                
                flash.message = "${message(code: 'default.updated.message', args: [message(code: 'user.label', default: 'User'), userAccountCmd.emailAddress])}"
                
                // Log in again if password has changed (new principle)
                if (userAccountCmd.emailAddress != userAccountCmd.previousEmailAddress) {
                    
                    Subject currentUser = SecurityUtils.getSubject()
                    currentUser.logout()
                    
                    flash.message = "You account (including email address) has been updated. Please log-in with new email address and password." // Todo - DN: Use message key
                }
                
                redirect(controller: 'home')
            }
            else {
                render(view: "updateAccount", model: [userAccountCmd: userAccountCmd])
            }
        }
        else {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'user.label', default: 'User'), params.id])}"
            redirect(controller:'home')
        }
    }
}