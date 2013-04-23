
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
	    filterInstance.possibleValues = params.possibleValues?.tokenize(",") ?: []

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

    /**
     * Note that values will be truncated to 256 characters, to fit the database schema.
     */
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

            def query = "from Layer as l where l.server.uri like '$hostPattern' and l.name = '$layerName'"

            if(namespace){
                query += " and l.namespace = '$namespace'"
            }

            def layer = Layer.find(query)

            log.debug("found layer: " + layer)

            def newFilters = postData.filters

            if(layer){
                newFilters.each(){ name, theFilter ->
                    def filter = Filter.findByLayerAndName(layer, name)

                    log.debug(theFilter.type)
                    def type = FilterType.typeFromString(theFilter.type)

                    if(!filter){
                        filter = new Filter(name: theFilter.name, type: type, layer: layer, label: theFilter.name)
                    }

                    /**
                     * Currently restricting string values to 256 characters (as per database setting).  These
                     * values should usually be something small, but there's been cases where a value contains
                     * a long description.
                     */
                    filter.possibleValues = theFilter.possibleValues.collect{
                        if(it.length() > 255){
                            log.info("filter length longer than 255.  Value was trucated from this: " + it)
                            it[0..251] + "..."
                        }
                        else{
                            it
                        }
                    }

                    try{
                        if (!filter.hasErrors() && filter.save(flush: true)) {
                            render text: "Complete (saved)"
                        }
                        else{
                            log.debug("Unable to save filter: " + filter.errors)
                        }
                    }
                    catch(Exception e){
                        log.warn("Error while trying to save filter: $e.message")
                        render(status: 500, text: "Error saving or updating filter: $e")
                    }
                }
            }
            else{
                log.debug("Unable to find layer on server $hostPattern with name $layerName")
                render text: "Unable to find layer on server $hostPattern with name $layerName"
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

        log.info("No WFS Scanner password configured for portal")
        return false
    }
}
