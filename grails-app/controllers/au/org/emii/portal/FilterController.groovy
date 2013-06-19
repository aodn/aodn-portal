
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.converters.JSON

class FilterController {

    def index = {
        redirect(action: "list", params: params)
    }

    def list = {
        params.max = Math.min(params.max ? params.int('max') : 20, 100)
        [filterInstanceList: Filter.list(params), filterInstanceTotal: Filter.count()]
    }

    def create = {
        def layerInstance = Layer.get( params.layerId )
        return [layerInstance: layerInstance]
    }

    def save = {

	    def filterInstance = new Filter(params)
	    filterInstance.layer = Layer.get(params.layerId)

	    // Split possible values on comma.
	    filterInstance.possibleValues = params.possibleValues?.tokenize(",") ?: [] // Todo: separate (possibly into a 'before' filter?

	    if (filterInstance.save()) {

		    redirect(controller: "layer", action: "editFilters", id: filterInstance.layerId)
	    }
	    else {

		    redirect(action: 'edit', params: params)
	    }
    }

    def edit = {
        def filterInstance = Filter.get(params.id)
        if (!filterInstance) {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'filter.label', default: 'Filter'), params.id])}"
            redirect(action: "list")
        }
        else {
            def concatValues = filterInstance?.possibleValues.inject('') { str, item -> str + ',' + item }

            if(concatValues.length() > 0)
                concatValues = concatValues.substring(1)

            return [filterInstance: filterInstance, filterTypes: FilterType.values(), concatValues: concatValues]
        }
    }

    def update = {
        def filterInstance = Filter.get(params.id)

        if(filterInstance){

            if (params.version) {
                def version = params.version.toLong()
                if (filterInstance.version > version) {

                    filterInstance.errors.rejectValue("version", "default.optimistic.locking.failure", [message(code: 'filter.label', default: 'Filter')] as Object[], "Another user has updated this Filter while you were editing")
                    render(view: "edit", model: [filterInstance: filterInstance])
                }
            }

            filterInstance.properties = params
	        filterInstance.possibleValues = params.possibleValues?.tokenize(",") ?: []

            if (!filterInstance.hasErrors() && filterInstance.save(flush: true)) {
                flash.message = "${message(code: 'default.updated.message', args: [message(code: 'filter.label', default: 'Filter'), filterInstance.id])}"
                redirect(controller:  "layer", action: "editFilters", id: filterInstance.layer.id)
            }
            else {
                render(view: "edit", model: [filterInstance: filterInstance])
            }
        }
        else {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'filter.label', default: 'Filter'), params.id])}"
            redirect(action: "list")
        }


    }

    def delete = {

        def filterInstance = Filter.get(params.id)

        if (filterInstance) {
            try {
                def ownerLayer = filterInstance.layer
                filterInstance.delete(flush: true)
                flash.message = "${message(code: 'default.deleted.message', args: [message(code: 'filter.label', default: 'Filter'), params.id])}"
                redirect(controller: "layer", action: "editFilters", id: ownerLayer.id)
            }
            catch (org.springframework.dao.DataIntegrityViolationException e) {
                flash.message = "${message(code: 'default.not.deleted.message', args: [message(code: 'filter.label', default: 'Filter'), params.id])}"
                redirect(action: "edit", id: params.id)
            }
        }
        else {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'filter.label', default: 'Filter'), params.id])}"
            redirect(action: "list")
        }
    }

    def updateFilter = {

        def postData = JSON.parse(params.filterData)

        if (_validateCredential(postData.password)) {

            def layer = _findLayerWith(postData.serverHost, postData.layerName)

	        if (!layer) {

		        log.debug "No layer found"
		        render text: "Unable to find Layer on Server ${postData.serverHost} with name ${postData.layerName}"
		        return
	        }

            log.debug "Found layer: $layer"

            postData.filters.each {
	            name, incomingData ->

	            // Try to find existing Filter
	            def filter = Filter.findByLayerAndName(layer, name)

	            if (!filter) {

		            filter = new Filter(name: incomingData.name, layer: layer, label: incomingData.name)
		            filter.type = FilterType.typeFromString(incomingData.type)
	            }

                // Update possibleValues
                filter.possibleValues = _trimFilterPossibleValues(incomingData)

                if (!filter.hasErrors() && filter.save(flush: true)) {

                    render text: "[Saved filter '$name']"
                }
                else {

                    log.debug "Unable to save filter '$name' because of errors: ${filter.errors}"
                    render text: "Unable to save '$name'", status: 500
                }
            }
        }
    }

	def _validateCredential(password) {

		def configuredPassword = Config.activeInstance().wfsScannerCallbackPassword

		if (configuredPassword) {
			if (password.equals(configuredPassword)) {
				return true
			}
			else{
				log.debug("Authentication failed")
				return false
			}
		}

		log.info("No WFS Scanner password configured for portal")
		return false
	}

	def _trimFilterPossibleValues(filter) {

		filter.possibleValues.collect{

			if (it.length() > 255) {

				log.debug "Filter length longer than 255. Value was trucated from this: '$it'"
				it[0..251] + "..."
			}
			else {

				it
			}
		}
	}

	def _findLayerWith(serverHost, fullLayerName) {

		def (namespace, layerName) = _deconstructLayerName(fullLayerName)

		def query = "from Layer as l where l.server.uri like '%$serverHost%' and l.name = '$layerName' and l.activeInLastScan = true"

		if (namespace) {

			query += " and l.namespace = '$namespace'"
		}

		log.debug "Finding Layer using query: '$query'"

		Layer.find(query)
	}

	def _deconstructLayerName(layerName) {

		def separatorIndex = layerName.indexOf(":")

		// Has namespace
		if (separatorIndex > -1) {

			return [
				layerName.substring(0, separatorIndex),
				layerName.substring(separatorIndex + 1)
			]
		}

		// No namespace
		return [null, layerName]
	}
}
