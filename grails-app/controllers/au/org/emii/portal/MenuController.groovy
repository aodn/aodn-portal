
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import au.org.emii.portal.config.JsonMarshallingRegistrar
import au.org.emii.portal.display.MenuJsonCache
import au.org.emii.portal.display.MenuPresenter
import grails.converters.JSON

class MenuController {

    static allowedMethods = [save: "POST", update: "POST", delete: "POST", setActive: "POST"]

    def index = {
        redirect(action: "list", params: params)
    }


    def list = {
        [menuInstanceList: Menu.list(params), menuInstanceTotal: Menu.count()]

    }

    def create = {
        def menuInstance = new Menu()
        menuInstance.properties = params
        return [menuInstance: menuInstance]

    }

    def save = {
        def menuInstance = new Menu()
		menuInstance.parseJson(params.json)
		menuInstance.edited()
		menuInstance.active = true

        if (menuInstance.save(flush: true)) {
            flash.message = "${message(code: 'default.created.message', args: [message(code: 'menu.label', default: 'Menu'), menuInstance.id])}"
            redirect(action: "list", id: menuInstance.id)
        }
        else {
            render(view: "create", model: [menuInstance: menuInstance])
        }
    }

    def edit = {
        def menuInstance = Menu.get(params.id)
        if (!menuInstance) {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'menu.label', default: 'Menu'), params.id])}"
            redirect(action: "list")
        }
        else {
            def menuInstanceJson = JSON.use(JsonMarshallingRegistrar.MENU_PRESENTER_MARSHALLING_CONFIG) {
				new au.org.emii.portal.display.MenuPresenter(menuInstance) as JSON
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
			menuInstance.parseJson(params.json)
			menuInstance.edited()
            if (!menuInstance.hasErrors() && menuInstance.save(flush: true, failOnError: true)) {
                flash.message = "${message(code: 'default.updated.message', args: [message(code: 'menu.label', default: 'Menu'), menuInstance.id])}"
                redirect(action: "list", id: menuInstance.id)
				_recache(menuInstance)
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
                redirect(action: "edit", id: params.id)
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

    def json = {

        def result

        if ( params.id?.isNumber() ) {

            // Use cached version if possible
            def dummy = new MenuPresenter()
            dummy.id = params.id
            result = MenuJsonCache.instance().get(dummy)

            // If not in cache, load menu and cache it
            if ( !result ) {
                def menu = Menu.get( params.id )

                // Menu will be null if params.id is not a menu id
                if ( menu ) {

                    def displayable = menu.toDisplayableMenu()
                    result = (displayable as JSON).toString()
                    MenuJsonCache.instance().add(displayable, result)
                }
                else {

                    // If nothing else has worked so far
                    result = "{}"
                }
            }
        }

        render result
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

	def _recache(menu) {
		MenuJsonCache.instance().recache(menu)
	}
}
