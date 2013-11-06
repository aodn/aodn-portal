
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

            if (concatValues.length() > 0)
                concatValues = concatValues.substring(1)

            return [filterInstance: filterInstance, filterTypes: FilterType.values(), concatValues: concatValues]
        }
    }

    def update = {
        log.debug "Updating Filter with params: ${params}"

        def filterInstance = Filter.get(params.id)

        if (filterInstance) {

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

            if (layer) {

                log.debug "Found layer: $layer"

                def results = _updateFiltersForLayer(layer, postData.filters)

                render results.join(" ")
            }
            else {

                log.debug "No layer found"

                render "Unable to find Layer on Server ${postData.serverHost} with name ${postData.layerName}"
            }
        }
        else {

            render text: "Credentials incorrect", status: 500
        }
    }

    def _validateCredential(password) {

        def configuredPassword = Config.activeInstance().wfsScannerCallbackPassword

        return configuredPassword && password.equals(configuredPassword)
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

        def matchingLayers = Layer.createCriteria().list {
            eq("name", layerName)
            eq("activeInLastScan", true)
            if (namespace) eq("namespace", namespace)

            server {
                like("uri", "%$serverHost%")
            }
        }

        matchingLayers ? matchingLayers.first() : null
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

    def _updateFiltersForLayer(layer, incomingFilterInfo) {

        def results = []

        incomingFilterInfo.each {
            name, newFilterData ->

            def filter = _updateFilterWithData(layer, name, newFilterData)

            if (!filter.hasErrors() && filter.save(flush: true)) {

                results << "Saved filter '$name'."
            }
            else {

                log.debug "Unable to save filter '$name' because of errors: ${filter.errors}"
                results << "Unable to save filter '$name'."
            }
        }

        return results
    }

    def _updateFilterWithData(layer, name, newFilterData) {

        // Try to find existing Filter
        def filter = Filter.findByLayerAndName(layer, name)

        if (!filter) {

            filter = new Filter(name: newFilterData.name, layer: layer, label: newFilterData.name)
            filter.type = FilterType.typeFromString(newFilterData.type)
        }

        // Update possibleValues
        filter.possibleValues = _trimFilterPossibleValues(newFilterData)

        return filter
    }
}
