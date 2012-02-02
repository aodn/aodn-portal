package au.org.emii.portal

import org.codehaus.groovy.grails.web.json.JSONObject;

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
            def owner = User.get(params.owner.id)
			snapshotList = Snapshot.findAllByOwner(owner)
		}
		else
		{
			snapshotList = Snapshot.list(params)
		}
		
		if (params.type == 'JSON')
		{
            def result = [ success: true, data: snapshotList, count: snapshotList.count() ]
            render text: result as JSON, contentType:"application/json"
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
        def snapshotInstance
        
        if (request.contentType == "application/json") {
            snapshotInstance = new Snapshot()
            bindJSONSnapshotData(snapshotInstance, request.JSON)
        } else {
            snapshotInstance = new Snapshot(params)
        }
        
        if (snapshotInstance.save(flush: true)) {
            withFormat {
                html {
                    flash.message = "${message(code: 'default.created.message', args: [message(code: 'snapshot.label', default: 'Snapshot'), snapshotInstance.id])}"
                    redirect(action: "show", id: snapshotInstance.id)
                } 
                json {
                    render snapshotInstance as JSON
                }
            }
        } else {
            def errors = snapshotInstance.errors
            withFormat {
                html {
                    render(view: "create", model: [snapshotInstance: snapshotInstance])
                }
                json {
                    render text: snapshotInstance.errors as JSON, status: 400, contentType: "application/json", encoding: "UTF-8" 
                }
            }
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
                //TODO: only need down to snapshot layers level
                JSON.use("deep") {
                    render(snapshotInstance as JSON)
                }
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
				
				if (params.type == 'JSON')
				{
					render text: flash.message, status: 200	
				}
				else
				{
					redirect(action: "list")
				}
            }
            catch (org.springframework.dao.DataIntegrityViolationException e) {
                flash.message = "${message(code: 'default.not.deleted.message', args: [message(code: 'snapshot.label', default: 'Snapshot'), params.id])}"
				if (params.type == 'JSON')
				{
					render text: flash.message, status: 500	
				}
				else
				{
					redirect(action: "show", id: params.id)
				}
            }
        }
        else {
            
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
    }
    
    private void bindJSONSnapshotData(Snapshot snapshotInstance, JSONObject jsonSnapshotInstance) {
        bindData(snapshotInstance, jsonSnapshotInstance, [exclude: ['owner','layers']])
        snapshotInstance.owner = User.get(jsonSnapshotInstance?.owner)
                
        jsonSnapshotInstance.layers.each {
            def snapshotLayerInstance = new SnapshotLayer()
            bindData(snapshotLayerInstance, it, [exclude: ['layer']])
            snapshotLayerInstance.layer = Layer.get(it?.layer)
            snapshotInstance.addToLayers(snapshotLayerInstance)
        }
    }

}
