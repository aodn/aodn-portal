
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

class MotdController {

    static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

    def index = {
        redirect(action: "list", params: params)
    }

    def list = {
        params.max = Math.min(params.max ? params.int('max') : 10, 100)
        [motdInstanceList: Motd.list(params), motdInstanceTotal: Motd.count()]
    }

    def create = {
        def motdInstance = new Motd()
        motdInstance.properties = params
        return [motdInstance: motdInstance]
    }

    def save = {
        def motdInstance = new Motd(params)
        // escape the html
        motdInstance.motd = params.motd.encodeAsHTML()

        if (motdInstance.save(flush: true)) {
            flash.message = "${message(code: 'default.created.message', args: [message(code: 'motd.label', default: 'Motd'), motdInstance.id])}"
            redirect(action: "show", id: motdInstance.id)
        }
        else {
            render(view: "create", model: [motdInstance: motdInstance])
        }
    }

    def show = {
        def motdInstance = Motd.get(params.id)
        if (!motdInstance) {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'motd.label', default: 'Motd'), params.id])}"
            redirect(action: "list")
        }
        else {
            [motdInstance: motdInstance]
        }
    }

    def edit = {
        def motdInstance = Motd.get(params.id)
        if (!motdInstance) {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'motd.label', default: 'Motd'), params.id])}"
            redirect(action: "list")
        }
        else {
            return [motdInstance: motdInstance]
        }
    }

    def update = {
        def motdInstance = Motd.get(params.id)
        if (motdInstance) {
            if (params.version) {
                def version = params.version.toLong()
                if (motdInstance.version > version) {

                    motdInstance.errors.rejectValue("version", "default.optimistic.locking.failure", [message(code: 'motd.label', default: 'Motd')] as Object[], "Another user has updated this Motd while you were editing")
                    render(view: "edit", model: [motdInstance: motdInstance])
                    return
                }
            }
            motdInstance.properties = params
            if (!motdInstance.hasErrors() && motdInstance.save(flush: true)) {
                flash.message = "${message(code: 'default.updated.message', args: [message(code: 'motd.label', default: 'Motd'), motdInstance.id])}"
                redirect(action: "show", id: motdInstance.id)
            }
            else {
                render(view: "edit", model: [motdInstance: motdInstance])
            }
        }
        else {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'motd.label', default: 'Motd'), params.id])}"
            redirect(action: "list")
        }
    }

    def delete = {
        def motdInstance = Motd.get(params.id)
        if (motdInstance) {
            try {
                motdInstance.delete(flush: true)
                flash.message = "${message(code: 'default.deleted.message', args: [message(code: 'motd.label', default: 'Motd'), params.id])}"
                redirect(action: "list")
            }
            catch (org.springframework.dao.DataIntegrityViolationException e) {
                flash.message = "${message(code: 'default.not.deletedFromConfig.message', args: [message(code: 'motd.label', default: 'Motd'), params.id])}"
                redirect(action: "show", id: params.id)
            }
        }
        else {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'motd.label', default: 'Motd'), params.id])}"
            redirect(action: "list")
        }
    }
}
