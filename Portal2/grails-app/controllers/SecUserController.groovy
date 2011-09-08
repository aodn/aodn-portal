class SecUserController {

    static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

    def index = {
        redirect(action: "list", params: params)
    }

    def list = {
        params.max = Math.min(params.max ? params.int('max') : 10, 100)
        [secUserInstanceList: SecUser.list(params), secUserInstanceTotal: SecUser.count()]
    }

    def create = {
        def secUserInstance = new SecUser()
        secUserInstance.properties = params
        return [secUserInstance: secUserInstance]
    }

    def save = {
        def secUserInstance = new SecUser(params)
        if (secUserInstance.save(flush: true)) {
            flash.message = "${message(code: 'default.created.message', args: [message(code: 'secUser.label', default: 'SecUser'), secUserInstance.id])}"
            redirect(action: "show", id: secUserInstance.id)
        }
        else {
            render(view: "create", model: [secUserInstance: secUserInstance])
        }
    }

    def show = {
        def secUserInstance = SecUser.get(params.id)
        if (!secUserInstance) {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'secUser.label', default: 'SecUser'), params.id])}"
            redirect(action: "list")
        }
        else {
            [secUserInstance: secUserInstance]
        }
    }

    def edit = {
        def secUserInstance = SecUser.get(params.id)
        if (!secUserInstance) {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'secUser.label', default: 'SecUser'), params.id])}"
            redirect(action: "list")
        }
        else {
            return [secUserInstance: secUserInstance]
        }
    }

    def update = {
        def secUserInstance = SecUser.get(params.id)
        if (secUserInstance) {
            if (params.version) {
                def version = params.version.toLong()
                if (secUserInstance.version > version) {
                    
                    secUserInstance.errors.rejectValue("version", "default.optimistic.locking.failure", [message(code: 'secUser.label', default: 'SecUser')] as Object[], "Another user has updated this SecUser while you were editing")
                    render(view: "edit", model: [secUserInstance: secUserInstance])
                    return
                }
            }
            secUserInstance.properties = params
            if (!secUserInstance.hasErrors() && secUserInstance.save(flush: true)) {
                flash.message = "${message(code: 'default.updated.message', args: [message(code: 'secUser.label', default: 'SecUser'), secUserInstance.id])}"
                redirect(action: "show", id: secUserInstance.id)
            }
            else {
                render(view: "edit", model: [secUserInstance: secUserInstance])
            }
        }
        else {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'secUser.label', default: 'SecUser'), params.id])}"
            redirect(action: "list")
        }
    }

    def delete = {
        def secUserInstance = SecUser.get(params.id)
        if (secUserInstance) {
            try {
                secUserInstance.delete(flush: true)
                flash.message = "${message(code: 'default.deleted.message', args: [message(code: 'secUser.label', default: 'SecUser'), params.id])}"
                redirect(action: "list")
            }
            catch (org.springframework.dao.DataIntegrityViolationException e) {
                flash.message = "${message(code: 'default.not.deleted.message', args: [message(code: 'secUser.label', default: 'SecUser'), params.id])}"
                redirect(action: "show", id: params.id)
            }
        }
        else {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'secUser.label', default: 'SecUser'), params.id])}"
            redirect(action: "list")
        }
    }
}
