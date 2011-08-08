package au.org.emii.portal

import grails.converters.JSON
import grails.converters.deep.*
import groovyx.net.http.*

class ConfigController {

    static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

    def index = {
        redirect(action: "list", params: params)
    }

	def list = {
        if(params.type == 'JSON')
            render Config.list(params) as JSON
	else
            params.max = Math.min(params.max ? params.int('max') : 10, 100)
            [configInstanceList: Config.list(params), configInstanceTotal: Config.count()]
	}

    def create = {
        def configInstance = new Config()
        configInstance.properties = params
        return [configInstance: configInstance]
    }

    def save = {
        def configInstance = new Config(params)
        if (configInstance.save(flush: true)) {
            flash.message = message(code: 'default.created.message', args: [message(code: 'config.label', default: 'Config'), configInstance.id])
            redirect(action: "show", id: configInstance.id)
        }
        else {
            render(view: "create", model: [configInstance: configInstance])
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
            return [configInstance: configInstance]
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
            if (!configInstance.hasErrors() && configInstance.save(flush: true)) {
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
