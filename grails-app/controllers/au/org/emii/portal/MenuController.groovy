package au.org.emii.portal

import grails.converters.deep.*
import groovyx.net.http.*

class MenuController {

    static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

    def index = {
        //redirect(action: "list", params: params)
    }


    def list = {
        params.max = Math.min(params.max ? params.int('max') : 10, 100)
        if(params.type == 'JSON')
            render Menu.list(params) as JSON
        else
            [menuInstanceList: Menu.list(params), menuInstanceTotal: Menu.count()]          
        
    }

    def showMenuByItsId = {

        def menuInstance = null
        // unencode menuId as per 'listAllMenus' to get just the id
        if (params.menuId != null) {
            def menuIdArr = params.menuId.split("_")
            menuInstance = Menu.get( menuIdArr[ menuIdArr.size() - 1 ])
        }
        if (menuInstance) {
            render menuInstance as JSON
        }
        else {
            render  ""
        }
    }


    def create = {
        def menuInstance = new Menu()
        menuInstance.properties = params
        return [menuInstance: menuInstance]

    }

    def save = {
        def menuInstance = new Menu(params)
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
            [menuInstance: menuInstance]
        }
    }

    def edit = {
        def menuInstance = Menu.get(params.id)
        if (!menuInstance) {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'menu.label', default: 'Menu'), params.id])}"
            redirect(action: "list")
        }
        else {
            return [menuInstance: menuInstance]
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
            menuInstance.properties = params
            if (!menuInstance.hasErrors() && menuInstance.save(flush: true)) {
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
                flash.message = "${message(code: 'default.not.deleted.message', args: [message(code: 'menu.label', default: 'Menu'), params.id])}"
                redirect(action: "show", id: params.id)
            }
        }
        else {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'menu.label', default: 'Menu'), params.id])}"
            redirect(action: "list")
        }
    }
}

