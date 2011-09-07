package au.org.emii.portal

import grails.converters.deep.*
import groovyx.net.http.*

class LayerController {

    static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

    def index = {
        redirect(action: "list", params: params)
    }


    def list = {
        params.max = Math.min(params.max ? params.int('max') : 10, 100)
        if(params.type == 'JSON') {
            render Layer.findAllByIsBaseLayerNotEqual(true) as JSON
        }
        else {
            [layerInstanceList: Layer.list(params), layerInstanceTotal: Layer.count()]    
        }        
    }

    def listBaseLayersAsJson = {
        def layerInstanceList = Layer.findAllByIsBaseLayerNotEqual(false)
        render layerInstanceList as JSON
    }
    
    def listNonBaseLayersAsJson = {
        
        def combinedList = []
        def layerInstanceList
        // rock and roll Groovy!
        if (params.phrase?.size() > 1) {
            layerInstanceList = Layer.findAllByIsBaseLayerNotEqualAndNameIlike(true, '%'+params.phrase+'%') 
        }
        else {            
           layerInstanceList = Layer.findAllByIsBaseLayerNotEqual(true)      
        }
        
        Server.list().each { 
            def l = layerInstanceList
            combinedList.add(it)
            def x = it     
            l.each {   
                if (it.server.id.equals(x.id)) {
                    combinedList.add(it)   
                }
            }             
        
        }

        render combinedList as JSON
        
    }

    def showLayerByItsId = {

        def layerInstance = null
        // unencode layerId as per 'listAllLayers' to get just the id
        if (params.layerId != null) {
            def layerIdArr = params.layerId.split("_")
            layerInstance = Layer.get( layerIdArr[ layerIdArr.size() - 1 ])
        }
        if (layerInstance) {
            render layerInstance as JSON
        }
        else {
            render  ""
        }
    }


    def create = {
        def layerInstance = new Layer()
        layerInstance.properties = params
        return [layerInstance: layerInstance]

    }

    def save = {
        def layerInstance = new Layer(params)
        if (layerInstance.save(flush: true)) {
            flash.message = "${message(code: 'default.created.message', args: [message(code: 'layer.label', default: 'Layer'), layerInstance.id])}"
            redirect(action: "show", id: layerInstance.id)
        }
        else {
            render(view: "create", model: [layerInstance: layerInstance])
        }
    }

    def show = {
        def layerInstance = Layer.get(params.id)
        if (!layerInstance) {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'layer.label', default: 'Layer'), params.id])}"
            redirect(action: "list")
        }
        else {
            [layerInstance: layerInstance]
        }
    }

    def edit = {
        def layerInstance = Layer.get(params.id)
        if (!layerInstance) {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'layer.label', default: 'Layer'), params.id])}"
            redirect(action: "list")
        }
        else {
            return [layerInstance: layerInstance]
        }
    }

    def update = {
        def layerInstance = Layer.get(params.id)
        if (layerInstance) {
            if (params.version) {
                def version = params.version.toLong()
                if (layerInstance.version > version) {
                    
                    layerInstance.errors.rejectValue("version", "default.optimistic.locking.failure", [message(code: 'layer.label', default: 'Layer')] as Object[], "Another user has updated this Layer while you were editing")
                    render(view: "edit", model: [layerInstance: layerInstance])
                    return
                }
            }
            layerInstance.properties = params
            if (!layerInstance.hasErrors() && layerInstance.save(flush: true)) {
                flash.message = "${message(code: 'default.updated.message', args: [message(code: 'layer.label', default: 'Layer'), layerInstance.id])}"
                redirect(action: "show", id: layerInstance.id)
            }
            else {
                render(view: "edit", model: [layerInstance: layerInstance])
            }
        }
        else {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'layer.label', default: 'Layer'), params.id])}"
            redirect(action: "list")
        }
    }

    def delete = {
        def layerInstance = Layer.get(params.id)
        if (layerInstance) {
            try {
                layerInstance.delete(flush: true)
                flash.message = "${message(code: 'default.deleted.message', args: [message(code: 'layer.label', default: 'Layer'), params.id])}"
                redirect(action: "list")
            }
            catch (org.springframework.dao.DataIntegrityViolationException e) {
                flash.message = "${message(code: 'default.not.deleted.message', args: [message(code: 'layer.label', default: 'Layer'), params.id])}"
                redirect(action: "show", id: params.id)
            }
        }
        else {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'layer.label', default: 'Layer'), params.id])}"
            redirect(action: "list")
        }
    }
}
