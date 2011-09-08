class SecRoleController {

    static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

    def index = {
        redirect(action: "list", params: params)
    }

    def list = {
        params.max = Math.min(params.max ? params.int('max') : 10, 100)
        [secRoleInstanceList: SecRole.list(params), secRoleInstanceTotal: SecRole.count()]
    }

    def create = {
        def secRoleInstance = new SecRole()
        secRoleInstance.properties = params
        return [secRoleInstance: secRoleInstance]
    }

    def save = {
        def secRoleInstance = new SecRole(params)
        if (secRoleInstance.save(flush: true)) {
            flash.message = "${message(code: 'default.created.message', args: [message(code: 'secRole.label', default: 'SecRole'), secRoleInstance.id])}"
            redirect(action: "show", id: secRoleInstance.id)
        }
        else {
            render(view: "create", model: [secRoleInstance: secRoleInstance])
        }
    }

    def show = {
        def secRoleInstance = SecRole.get(params.id)
        if (!secRoleInstance) {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'secRole.label', default: 'SecRole'), params.id])}"
            redirect(action: "list")
        }
        else {
            [secRoleInstance: secRoleInstance]
        }
    }

    def edit = {
        def secRoleInstance = SecRole.get(params.id)
        if (!secRoleInstance) {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'secRole.label', default: 'SecRole'), params.id])}"
            redirect(action: "list")
        }
        else {
            return [secRoleInstance: secRoleInstance]
        }
    }

    def update = {
        def secRoleInstance = SecRole.get(params.id)
        if (secRoleInstance) {
            if (params.version) {
                def version = params.version.toLong()
                if (secRoleInstance.version > version) {
                    
                    secRoleInstance.errors.rejectValue("version", "default.optimistic.locking.failure", [message(code: 'secRole.label', default: 'SecRole')] as Object[], "Another user has updated this SecRole while you were editing")
                    render(view: "edit", model: [secRoleInstance: secRoleInstance])
                    return
                }
            }
            secRoleInstance.properties = params
            if (!secRoleInstance.hasErrors() && secRoleInstance.save(flush: true)) {
                flash.message = "${message(code: 'default.updated.message', args: [message(code: 'secRole.label', default: 'SecRole'), secRoleInstance.id])}"
                redirect(action: "show", id: secRoleInstance.id)
            }
            else {
                render(view: "edit", model: [secRoleInstance: secRoleInstance])
            }
        }
        else {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'secRole.label', default: 'SecRole'), params.id])}"
            redirect(action: "list")
        }
    }

    def delete = {
        def secRoleInstance = SecRole.get(params.id)
        if (secRoleInstance) {
            try {
                secRoleInstance.delete(flush: true)
                flash.message = "${message(code: 'default.deleted.message', args: [message(code: 'secRole.label', default: 'SecRole'), params.id])}"
                redirect(action: "list")
            }
            catch (org.springframework.dao.DataIntegrityViolationException e) {
                flash.message = "${message(code: 'default.not.deleted.message', args: [message(code: 'secRole.label', default: 'SecRole'), params.id])}"
                redirect(action: "show", id: params.id)
            }
        }
        else {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'secRole.label', default: 'SecRole'), params.id])}"
            redirect(action: "list")
        }
    }
}
