package au.org.emii.portal

import grails.converters.*
import grails.converters.deep.JSON
//import org.codehaus.groovy.grails.web.json.*;
import groovyx.net.http.*
//import org.codehaus.groovy.grails.web.converters.marshaller.json.GroovyBeanMarshaller
//import org.codehaus.groovy.grails.web.converters.marshaller.ClosureOjectMarshaller

//import grails.json.ConfigClassJSONMarshaller


    
class ConfigController {

    
    static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

    def index = {
        redirect(action: "edit")
    }
    
    
    private getConfigAsJSON = {
        return (Config.activeInstance() as JSON).toString()
    }
    
    def list = {
        
        // expect only one Config instance to exist
        def configInstance = Config.activeInstance();
        
        configInstance = massageConfigInstance(configInstance);
        //def baselayerList = new Object()         
        def baselayerList = []
        
        if(params.type == 'JSON') {
            
            // expand the baselayers menu into baselayers
            def baselayerJson =  JSON.parse(configInstance.baselayerMenu.json)
            baselayerJson.each() {
                def res = (Layer.get(it.grailsLayerId) as JSON).toString()
                baselayerList.add(JSON.parse(res))
            }            
            
            def instanceAsGenericObj = JSON.parse(getConfigAsJSON())
            instanceAsGenericObj['baselayerList'] = baselayerList
            
            
            render(contentType: "application/json", text:  instanceAsGenericObj)
        }
        else {
            render(view: "show", model: [configInstance: configInstance])
        }
    }

    def create = {
        // only one instance allowed
        def configInstance;        
        if (Config.list().size() > 0) {
           configInstance = Config.activeInstance()
           flash.message = "ERROR: New Config cannot be created. There can only be one instance of the configuration"
           redirect(action: "edit")     
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
        // dont get params get the only instance
        def configInstance = Config.activeInstance()
        //def configInstance = Config.get(params.id)
        if (!configInstance) {
            flash.message = message(code: 'default.not.found.message', args: [message(code: 'config.label', default: 'Config'), 'existing config'])
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

            if (!configInstance.hasErrors() && configInstance.save(flush: true) && (flash.message == null)) {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'config.label', default: 'Config'), configInstance.id])
                
            }
            render(view: "edit", model: [configInstance: configInstance])
           
         
            
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
    
    // Proccess the Motd 
    // Process the defaultMenu - TODO
    private Config massageConfigInstance(configInstance) {
        
        def now = new Date()

        // test motd dates if enabled
        if (configInstance.enableMOTD) {
            // it is so check the dates
            if (configInstance.motdStart.after(now) || configInstance.motdEnd.before(now)) {
                configInstance.enableMOTD = false // value not for persisting
            }
        }
        return configInstance
    }
}
