package au.org.emii.portal

import grails.converters.JSON;
import groovyx.net.http.*

class MenuController {

    static allowedMethods = [save: "POST", update: "POST", delete: "POST", setActive: "POST"]

    def index = {
        redirect(action: "list", params: params)
    }


    def list = {
        params.max = Math.min(params.max ? params.int('max') : 10, 100)
        [menuInstanceList: Menu.list(params), menuInstanceTotal: Menu.count()]         
        
    }    
    
    def create = {
        def menuInstance = new Menu()
        menuInstance.properties = params
        flash.message = "Drag layers onto the tree. <BR>The root element of the tree must be renamed. Right click on the tree to see options"
        return [menuInstance: menuInstance]

    }

    def save = {             
   
        params.active = true        
        def paramsCleaned = _cleanParams(params)
        
        def menuInstance = new Menu(paramsCleaned)
       
        if (menuInstance.save(flush: true)) {
            flash.message = "${message(code: 'default.created.message', args: [message(code: 'menu.label', default: 'Menu'), menuInstance.id])}"
            redirect(action: "show", id: menuInstance.id)
        }
        else {
            render(view: "create", model: [menuInstance: menuInstance])
        }
    }


    def show = {
        def menuInstance = Menu.get(params.id)
        if (!menuInstance) {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'menu.label', default: 'Menu'), params.id])}"
            redirect(action: "list")
        }
        else {
            def menuInstanceJson = JSON.use("deep") { 
				menuInstance as JSON
            } // can easily create javascript object from this
            [menuInstance: menuInstance, menuInstanceJson: menuInstanceJson]
        }
    }

    def edit = {
        def menuInstance = Menu.get(params.id)
        if (!menuInstance) {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'menu.label', default: 'Menu'), params.id])}"
            redirect(action: "list")
        }
        else {
            def menuInstanceJson = JSON.use("deep") { 
				menuInstance as JSON
            } // can easily create javascript object from this
            [menuInstance: menuInstance, menuInstanceJson: menuInstanceJson]
        }
    }

    def update = {
		
        def menuInstance = Menu.get(params.id)
        
        if (menuInstance) {
            if (params.version) {
                def version = params.version.toLong()
                if (menuInstance.version > version) {
                    
                    menuInstance.errors.rejectValue("version", "default.optimistic.locking.failure", [message(code: 'menu.label', default: 'Menu')] as Object[], "Another user has updated this Menu while you were editing")
                    render(view: "edit", model: [menuInstance: menuInstance])
                    return
                }
            }
            log.debug(params.json)
			menuInstance.parseJson(params.json)
			menuInstance.edited()
            if (!menuInstance.hasErrors() && menuInstance.save(flush: true, failOnError: true)) {
                flash.message = "${message(code: 'default.updated.message', args: [message(code: 'menu.label', default: 'Menu'), menuInstance.id])}"
                redirect(action: "show", id: menuInstance.id)
            }
            else {
                render(view: "edit", model: [menuInstance: menuInstance])
            }
			
        }
        else {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'menu.label', default: 'Menu'), params.id])}"
            redirect(action: "list")
        }
    }

    def delete = {
        def menuInstance = Menu.get(params.id)
        if (menuInstance) {
            try {
                menuInstance.delete(flush: true)
                flash.message = "${message(code: 'default.deleted.message', args: [message(code: 'menu.label', default: 'Menu'), params.id])}"
                redirect(action: "list")
            }
            catch (org.springframework.dao.DataIntegrityViolationException e) {
                flash.message = "${message(code: 'default.not.deletedFromConfig.message', args: [message(code: 'menu.label', default: 'Menu'), params.id])}"
                redirect(action: "show", id: params.id)
            }
        }
        else {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'menu.label', default: 'Menu'), params.id])}"
            redirect(action: "list")
        }
    }
    
    
    // this method is all about setting the 'active' attribute from the list page
    def setActive = {
        
        def menuInstance = Menu.get(params.id)
        menuInstance.properties = params
        if (menuInstance.save(flush: true)) {
            def state = (menuInstance.active) ? "active" : "inactive"
            render  "Menu " + menuInstance.id + "  '" + menuInstance.title + "' " + " saved as " + state              
        }
        else {
            render 'ERROR: Problem saving the new state!'
        }
        
    }

    
        
    private _cleanParams(params) {
        
         // strip out the root node and use it as the title
        def jsonArray = JSON.parse(params.json)    
        
        params.editDate = new Date()
        params.title = jsonArray.text       
        
        // the JSON string to save and use is the children of the root node
        params.json = jsonArray.children.toString()
        return params
    }
}

