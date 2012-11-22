
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

class OrganisationTypeController {

    static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

    def index = {
        redirect(action: "list", params: params)
    }

    def list = {
        params.max = Math.min(params.max ? params.int('max') : 10, 100)
        [organisationTypeInstanceList: OrganisationType.list(params), organisationTypeInstanceTotal: OrganisationType.count()]
    }

    def create = {
        def organisationTypeInstance = new OrganisationType()
        organisationTypeInstance.properties = params
        return [organisationTypeInstance: organisationTypeInstance]
    }

    def save = {
        def organisationTypeInstance = new OrganisationType(params)
        if (organisationTypeInstance.save(flush: true)) {
            flash.message = "${message(code: 'default.created.message', args: [message(code: 'organisationType.label', default: 'OrganisationType'), organisationTypeInstance.id])}"
            redirect(action: "show", id: organisationTypeInstance.id)
        }
        else {
            render(view: "create", model: [organisationTypeInstance: organisationTypeInstance])
        }
    }

    def show = {
        def organisationTypeInstance = OrganisationType.get(params.id)
        if (!organisationTypeInstance) {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'organisationType.label', default: 'OrganisationType'), params.id])}"
            redirect(action: "list")
        }
        else {
            [organisationTypeInstance: organisationTypeInstance]
        }
    }

    def edit = {
        def organisationTypeInstance = OrganisationType.get(params.id)
        if (!organisationTypeInstance) {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'organisationType.label', default: 'OrganisationType'), params.id])}"
            redirect(action: "list")
        }
        else {
            return [organisationTypeInstance: organisationTypeInstance]
        }
    }

    def update = {
        def organisationTypeInstance = OrganisationType.get(params.id)
        if (organisationTypeInstance) {
            if (params.version) {
                def version = params.version.toLong()
                if (organisationTypeInstance.version > version) {
                    
                    organisationTypeInstance.errors.rejectValue("version", "default.optimistic.locking.failure", [message(code: 'organisationType.label', default: 'OrganisationType')] as Object[], "Another user has updated this OrganisationType while you were editing")
                    render(view: "edit", model: [organisationTypeInstance: organisationTypeInstance])
                    return
                }
            }
            organisationTypeInstance.properties = params
            if (!organisationTypeInstance.hasErrors() && organisationTypeInstance.save(flush: true)) {
                flash.message = "${message(code: 'default.updated.message', args: [message(code: 'organisationType.label', default: 'OrganisationType'), organisationTypeInstance.id])}"
                redirect(action: "show", id: organisationTypeInstance.id)
            }
            else {
                render(view: "edit", model: [organisationTypeInstance: organisationTypeInstance])
            }
        }
        else {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'organisationType.label', default: 'OrganisationType'), params.id])}"
            redirect(action: "list")
        }
    }

    def delete = {
        def organisationTypeInstance = OrganisationType.get(params.id)
        if (organisationTypeInstance) {
            try {
                organisationTypeInstance.delete(flush: true)
                flash.message = "${message(code: 'default.deleted.message', args: [message(code: 'organisationType.label', default: 'OrganisationType'), params.id])}"
                redirect(action: "list")
            }
            catch (org.springframework.dao.DataIntegrityViolationException e) {
                flash.message = "${message(code: 'default.not.deleted.message', args: [message(code: 'organisationType.label', default: 'OrganisationType'), params.id])}"
                redirect(action: "show", id: params.id)
            }
        }
        else {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'organisationType.label', default: 'OrganisationType'), params.id])}"
            redirect(action: "list")
        }
    }
}
