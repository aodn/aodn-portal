
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.converters.JSON

class SearchController {

    static allowedMethods = [save: "POST", delete: "POST"]

    def index = {
        redirect(action: "list", params: params)
    }

    def list = 
	{
		def searchList
		
		if (params.owner?.id) 
		{
            def owner = User.get(params.owner.id)
            searchList = Search.findAllByOwner(owner)
		}
		else 
		{
            searchList = Search.list(params)
		}		

		render searchList as JSON
    }

    def save = 
	{
		def searchInstance = Search.fromJson(request.JSON)
		
        if (searchInstance.save(flush: true)) {
            render searchInstance as JSON
        }
        else {
            render text: searchInstance.errors as JSON, status: 400, contentType: "application/json", encoding: "UTF-8"
        }
    }

    def show = {
		
        def searchInstance = Search.get(params.id)
        if (!searchInstance) 
		{
			render text: "${message(code: 'default.not.found.message', args: [message(code: 'search.label', default: 'Search'), params.id])}" as JSON, status: 400
            redirect(action: "list")
        }
        else 
		{
			JSON.use("deep")
			{
				render searchInstance as JSON
			}
        }
    }

    def delete = {
        def searchInstance = Search.get(params.id)
        if (searchInstance) {
            try {
                searchInstance.delete(flush: true)
                flash.message = "${message(code: 'default.deleted.message', args: [message(code: 'search.label', default: 'Search'), params.id])}"
                redirect(action: "list")
            }
            catch (org.springframework.dao.DataIntegrityViolationException e) {
                flash.message = "${message(code: 'default.not.deleted.message', args: [message(code: 'search.label', default: 'Search'), params.id])}"
                redirect(action: "show", id: params.id)
            }
        }
        else {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'search.label', default: 'Search'), params.id])}"
            redirect(action: "list")
        }
    }
}
