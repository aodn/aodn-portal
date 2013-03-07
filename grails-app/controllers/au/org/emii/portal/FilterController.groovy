
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
        def filterInstance = new Filter()

        def layerInstance = Layer.get( Long.valueOf(params.layerId) )
        filterInstance.name = params.name

        filterInstance.type = params.type
        filterInstance.label = params.label

        if(params.possibleValues.length() > 0)
            filterInstance.possibleValues = params.possibleValues.split(",")
        else
            filterInstance.possibleValues = []

        filterInstance.layer = layerInstance

        filterInstance.save(flush: true)

        redirect(controller:  "layer", action: "editFilters", id: layerInstance.id)
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

            return [filterInstance: filterInstance, filterTypes: FilterTypes.values(), concatValues: concatValues]
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

            if(params.possibleValues.length() > 0)
                filterInstance.possibleValues = params.possibleValues.split(",")
            else
                filterInstance.possibleValues = []

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
        if(_validateCredential(postData.password)){

            def layerName = postData.layerName
            def hostPattern = "%" + postData.serverHost + "%"
            def namespace = null

            if(postData.layerName.indexOf(":") > -1){
                namespace = layerName.substring(0, layerName.indexOf(":"))
                layerName = layerName.substring(layerName.indexOf(":") + 1)
            }

            log.debug("finding layer using: " + "from Layer as l where l.server.uri like '$hostPattern' and l.name = '$layerName'")
            def layer  = null

            if(namespace == null)
                layer = Layer.find("from Layer as l where l.server.uri like '$hostPattern' and l.name = '$layerName'")
            else{
                layer = Layer.find("from Layer as l where l.server.uri like '$hostPattern' and l.name = '$layerName' and l.namespace = '$namespace'")
            }

            def newFilters = postData.filters

            if(layer){
                newFilters.each(){ name, theFilter ->
                    def filter = Filter.findByLayerAndName(layer, name)

                    if(!filter){
                        filter = new Filter(name: theFilter.name, type: theFilter.type, layer: layer, label: theFilter.name)
                    }

                    filter.possibleValues = theFilter.possibleValues

                    try{
                        if (!filter.hasErrors() && filter.save(flush: true)) {
                            render status: 200, text: "Complete (saved)"
                        }
                    }
                    catch(Exception e){
                        log.debug("Error while trying to save filter: $e.message")
                        e.printStackTrace()
                        render(status: 500, text: "Error saving or updating filter: $e")
                    }
                }
            }
            else{
                log.debug("Error while trying to save filter :(")
                render(status: 500, text: "Layer does not exist")
            }
        }
    }

    def boolean _validateCredential(password){
        def configuredPassword = Config.activeInstance().wfsScannerCallbackPassword

        if(configuredPassword){
            if(password.equals(configuredPassword)){
                return true
            }
            else{
                log.debug("Authentication failed")
                return false
            }
        }

        log.debug("No WFS Scanner password configured for portal")
        return false
    }

}
