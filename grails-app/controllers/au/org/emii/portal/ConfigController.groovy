package au.org.emii.portal

import grails.converters.deep.JSON
import grails.converters.deep.*
import groovyx.net.http.*


    
class ConfigController {

    
    static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

    def index = {
        redirect(action: "list", params: params)
    }
    
    def list = {
        
        // expect only one Config instance to exist
        def configInstance = Config.list()[0];
        
        if(params.type == 'JSON') {
            render configInstance as JSON
        }
        else {
            render(view: "show", model: [configInstance: configInstance])
        }
    }

    def create = {
        // only one instance allowed
        def configInstance;        
        if (Config.list().size() > 0) {
           configInstance = Config.list()[0]
           flash.message = "ERROR: New Config cannot be created. There can only be one instance of the configuration"
           redirect(action: "show", id: configInstance.id)     
        }
        else {
            configInstance = new Config()
        }        
        configInstance.properties = params
        return [configInstance: configInstance]
    }

    def save = {
        def configInstance = new Config(params)
        // test that this is the first 
        if (Config.list().size() != 0) {
            flash.message = "ERROR: New Config not created. There can only be one instance of the configuration"
        }
        // test motd dates
        if (configInstance.enableMOTD) {
            if (configInstance.motdStart.after(configInstance.motdEnd)) {
                flash.message = "ERROR: The Message of the day Start Time is after the End Time"
            }
        }
        
        if (flash.message == "") {
            if (configInstance.save(flush: true)) {
                flash.message = message(code: 'default.created.message', args: [message(code: 'config.label', default: 'Config'), configInstance.id])
                redirect(action: "show", id: configInstance.id)
            }
            else {
                render(view: "create", model: [configInstance: configInstance])
            }
        }
        else{
            redirect(action: "list")
        }
    }

    def show = {
        def configInstance = Config.get(params.id)
        if (!configInstance) {
            flash.message = message(code: 'default.not.found.message', args: [message(code: 'config.label', default: 'Config'), params.id])
            redirect(action: "list")
        }
        else {
            [configInstance: configInstance]
        }
    }

    def edit = {
        def configInstance = Config.get(params.id)
        if (!configInstance) {
            flash.message = message(code: 'default.not.found.message', args: [message(code: 'config.label', default: 'Config'), params.id])
            redirect(action: "list")
        }
        else {
            [configInstance: configInstance]
        }
    }

    def update = {
        def configInstance = Config.get(params.id)
        if (configInstance) {
            if (params.version) {
                def version = params.version.toLong()
                if (configInstance.version > version) {
                    
                    configInstance.errors.rejectValue("version", "default.optimistic.locking.failure", [message(code: 'config.label', default: 'Config')] as Object[], "Another user has updated this Config while you were editing")
                    render(view: "edit", model: [configInstance: configInstance])
                    return
                }
            }
            configInstance.properties = params
            
            // test motd dates if enabled
            if (configInstance.enableMOTD) {
                // insist that end is after the start
                if (configInstance.motdStart.after(configInstance.motdEnd)) {
                    flash.message = "ERROR: The Message of the day Start Time is after the End Time"
                }
            }

            if (!configInstance.hasErrors() && configInstance.save(flush: true) && flash.message == "") {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'config.label', default: 'Config'), configInstance.id])
                redirect(action: "show", id: configInstance.id)
            }
            else {
                render(view: "edit", model: [configInstance: configInstance])
            }
         
            
        }
        else {
            flash.message = message(code: 'default.not.found.message', args: [message(code: 'config.label', default: 'Config'), params.id])
            redirect(action: "list")
        }
    }

    def delete = {
        // why should this happen. only one config should exist
        // well if there is more than one let it happen
        if (Config.list().size() > 1) {
            def configInstance = Config.get(params.id)
            if (configInstance) {
                try {
                    configInstance.delete(flush: true)
                    flash.message = message(code: 'default.deleted.message', args: [message(code: 'config.label', default: 'Config'), params.id])
                    redirect(action: "list")
                }
                catch (org.springframework.dao.DataIntegrityViolationException e) {
                    flash.message = message(code: 'default.not.deleted.message', args: [message(code: 'config.label', default: 'Config'), params.id])
                    redirect(action: "show", id: params.id)
                }
            }
            else {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'config.label', default: 'Config'), params.id])
                redirect(action: "list")
            }
        }
    }
}
