package au.org.emii.portal

import grails.converters.deep.*
import groovyx.net.http.*

class LayerController {

    static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

    def index = {
        redirect(action: "list", params: params)
    }


    def list = {
        params.max = Math.min(params.max ? params.int('max') : 500, 500)
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
    
    def listLayersAsJson = {
        
        def combinedList = []    
        def layerInstanceList = []
        if (params.phrase?.size() > 1) {
            layerInstanceList = Layer.findByNameIlike('%'+params.phrase+'%') 
        }
        else {
            layerInstanceList = Layer.list(params)
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
            log.error "Layer: The layerId does not exist"
            render text: "The layerId '${params.layerId}' does not exist", contentType: "text/html", encoding: "UTF-8", status: 500
        }
    }

    def create = {
        def layerInstance = new Layer()

        layerInstance.properties = params
        layerInstance.source = "Manual"

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
    
    def saveOrUpdate = {
        
        println "\n" * 15
        
        /*
         * -- Params --
         * 
         * PK:
         * layers
         * serverUrl
         * 
         * Required:
         * currentlyActive
         * description
         * 
         * Optional:
         * name
         * disabled
         * cache
         * keywords
         * style
         * opacity
         * bbox
         * imageFormat
         * queryable
         * isBaseLayer
         * 
         */
        
        params.with{
            if ( !layers?.trim() ) {
                
                render status: 400, test: "Parameter 'layers' must be present and not empty"
                return
            }
            
            if ( !serverUrl.trim() ) {
                
                render status: 400, test: "Parameter 'serverUrl' must be present and not empty"
                return
            }
            
            if ( currentlyActive == null ) {
                
                render status: 400, test: "Parameter 'currentlyActive' must be present"
                return
            }
        
            println "layers: ${layers}"
            println "serverUrl: ${serverUrl}"
            println "currentlyActive: $currentlyActive"
        }
                
        /*
         * Find target leyer(s) using layers and serverUrl
         * 
         * if doesn't exists, create new one
         * 
         * fill-in fields with params
         *  - might be some retrieving from db or creating records required?
         * 
         * save
         *
         * What to return?
         * 
         * [!] Write Unit Tests [!]
         *
         */

        def server = Server.findByUri( params.serverUrl )
                
        if ( !server ) {
            
            render status: 500, text: "No server found with url: ${params.serverUrl}"
            return
        }
                
        println "server: $server"
        
        // Find layer
        def layer = Layer.findByLayersAndServer( params.layers, server )
        
        // Create layer if it doesn't exist already
        if ( !layer ) {
            
            // Create new layer
            println "Creating new layer"
            layer = new Layer()
            layer.server = server
        }
        else {
            
            println "layer found: $layer"
        }
                
        // Copy values
        layer.properties = params
               
        if ( !layer.hasErrors() && layer.save( flush: true ) ) {
            
            println "Saved with new values"
            println "------------------------------"
            layer.properties.each{ println it }
            println "------------------------------"
        }
        else {
                       
            def message = "Layer had errors or could not save."
            layer.errors.each{ message += "$it\n" }
            
            render status: 500, text: message
            return
        }
        
        render status: 200, text: "Complete (saved)"
    }
}