package au.org.emii.portal

import grails.converters.JSON

class SnapshotController 
{
    static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

    def index = {
        redirect(action: "list", params: params)
    }

    def list = 
	{
		def snapshotList
		
		if (params.owner)
		{
			snapshotList = Snapshot.findAllByOwner(params.owner)
		}
		else
		{
			snapshotList = Snapshot.list(params)
		}
		
		if (params.type == 'JSON')
		{
			render(snapshotList as JSON)
		}
		else
		{
	        params.max = Math.min(params.max ? params.int('max') : 10, 100)
	        [snapshotInstanceList: snapshotList, snapshotInstanceTotal: Snapshot.count()]
		}
    }

    def create = {
        def snapshotInstance = new Snapshot()
        snapshotInstance.properties = params
        return [snapshotInstance: snapshotInstance]
    }

    def save = {
        def snapshotInstance = new Snapshot(params)
		
        if (snapshotInstance.save(flush: true)) {
            flash.message = "${message(code: 'default.created.message', args: [message(code: 'snapshot.label', default: 'Snapshot'), snapshotInstance.id])}"
            redirect(action: "show", id: snapshotInstance.id)
        }
        else {
            render(view: "create", model: [snapshotInstance: snapshotInstance])
        }
    }

    def show = {
        def snapshotInstance = Snapshot.get(params.id)
        if (!snapshotInstance) 
		{
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'snapshot.label', default: 'Snapshot'), params.id])}"
			
			if (params.type == 'JSON')
			{
				render text: flash.message, status: 404
			}
			else
			{
				redirect(action: "list")
			}
        }
        else 
		{
			if (params.type == 'JSON')
			{
				render(snapshotInstance as JSON)
			}
			else
			{
				[snapshotInstance: snapshotInstance]
			}
        }
    }

    def edit = {
        def snapshotInstance = Snapshot.get(params.id)
        if (!snapshotInstance) {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'snapshot.label', default: 'Snapshot'), params.id])}"
            redirect(action: "list")
        }
        else {
            return [snapshotInstance: snapshotInstance]
        }
    }

    def update = {
        def snapshotInstance = Snapshot.get(params.id)
        if (snapshotInstance) {
            if (params.version) {
                def version = params.version.toLong()
                if (snapshotInstance.version > version) {
                    
                    snapshotInstance.errors.rejectValue("version", "default.optimistic.locking.failure", [message(code: 'snapshot.label', default: 'Snapshot')] as Object[], "Another user has updated this Snapshot while you were editing")
                    render(view: "edit", model: [snapshotInstance: snapshotInstance])
                    return
                }
            }
            snapshotInstance.properties = params
            if (!snapshotInstance.hasErrors() && snapshotInstance.save(flush: true)) {
                flash.message = "${message(code: 'default.updated.message', args: [message(code: 'snapshot.label', default: 'Snapshot'), snapshotInstance.id])}"
                redirect(action: "show", id: snapshotInstance.id)
            }
            else {
                render(view: "edit", model: [snapshotInstance: snapshotInstance])
            }
        }
        else {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'snapshot.label', default: 'Snapshot'), params.id])}"
            redirect(action: "list")
        }
    }

    def delete = {
        def snapshotInstance = Snapshot.get(params.id)
        if (snapshotInstance) {
            try {
                snapshotInstance.delete(flush: true)
                flash.message = "${message(code: 'default.deleted.message', args: [message(code: 'snapshot.label', default: 'Snapshot'), params.id])}"
                redirect(action: "list")
            }
            catch (org.springframework.dao.DataIntegrityViolationException e) {
                flash.message = "${message(code: 'default.not.deleted.message', args: [message(code: 'snapshot.label', default: 'Snapshot'), params.id])}"
                redirect(action: "show", id: params.id)
            }
        }
        else {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'snapshot.label', default: 'Snapshot'), params.id])}"
            redirect(action: "list")
        }
    }
}
