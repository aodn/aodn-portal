package au.org.emii.portal

class AodaacProductLinkController {

    static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

    def index = {
        redirect(action: "list", params: params)
    }

    def list = {
        params.max = Math.min(params.max ? params.int('max') : 10, 100)
        [aodaacProductLinkInstanceList: AodaacProductLink.list(params), aodaacProductLinkInstanceTotal: AodaacProductLink.count()]
    }

    def create = {
        def aodaacProductLinkInstance = new AodaacProductLink()
        aodaacProductLinkInstance.properties = params
        return [aodaacProductLinkInstance: aodaacProductLinkInstance]
    }

    def save = {
        def aodaacProductLinkInstance = new AodaacProductLink(params)
        if (aodaacProductLinkInstance.save(flush: true)) {
            flash.message = "${message(code: 'default.created.message', args: [message(code: 'aodaacProductLink.label', default: 'AodaacProductLink'), aodaacProductLinkInstance.id])}"
            redirect(action: "list", id: aodaacProductLinkInstance.id)
        }
        else {
            render(view: "create", model: [aodaacProductLinkInstance: aodaacProductLinkInstance])
        }
    }

    def edit = {
        def aodaacProductLinkInstance = AodaacProductLink.get(params.id)
        if (!aodaacProductLinkInstance) {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'aodaacProductLink.label', default: 'AodaacProductLink'), params.id])}"
            redirect(action: "list")
        }
        else {
            return [aodaacProductLinkInstance: aodaacProductLinkInstance]
        }
    }

    def update = {
        def aodaacProductLinkInstance = AodaacProductLink.get(params.id)
        if (aodaacProductLinkInstance) {
            if (params.version) {
                def version = params.version.toLong()
                if (aodaacProductLinkInstance.version > version) {

                    aodaacProductLinkInstance.errors.rejectValue("version", "default.optimistic.locking.failure", [message(code: 'aodaacProductLink.label', default: 'AodaacProductLink')] as Object[], "Another user has updated this AodaacProductLink while you were editing")
                    render(view: "edit", model: [aodaacProductLinkInstance: aodaacProductLinkInstance])
                    return
                }
            }
            aodaacProductLinkInstance.properties = params
            if (!aodaacProductLinkInstance.hasErrors() && aodaacProductLinkInstance.save(flush: true)) {
                flash.message = "${message(code: 'default.updated.message', args: [message(code: 'aodaacProductLink.label', default: 'AodaacProductLink'), aodaacProductLinkInstance.id])}"
                redirect(action: "list", id: aodaacProductLinkInstance.id)
            }
            else {
                render(view: "edit", model: [aodaacProductLinkInstance: aodaacProductLinkInstance])
            }
        }
        else {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'aodaacProductLink.label', default: 'AodaacProductLink'), params.id])}"
            redirect(action: "list")
        }
    }

    def delete = {
        def aodaacProductLinkInstance = AodaacProductLink.get(params.id)
        if (aodaacProductLinkInstance) {
            try {
                aodaacProductLinkInstance.delete(flush: true)
                flash.message = "${message(code: 'default.deleted.message', args: [message(code: 'aodaacProductLink.label', default: 'AodaacProductLink'), params.id])}"
                redirect(action: "list")
            }
            catch (org.springframework.dao.DataIntegrityViolationException e) {
                flash.message = "${message(code: 'default.not.deleted.message', args: [message(code: 'aodaacProductLink.label', default: 'AodaacProductLink'), params.id])}"
                redirect(action: "list", id: params.id)
            }
        }
        else {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'aodaacProductLink.label', default: 'AodaacProductLink'), params.id])}"
            redirect(action: "list")
        }
    }
}
