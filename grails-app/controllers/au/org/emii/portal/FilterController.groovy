package au.org.emii.portal

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
        filterInstance.values = params.values

        filterInstance.layer = layerInstance

        filterInstance.save(flush: true)

        redirect(controller:  "layer", action: "edit", id: layerInstance.id)
    }

    def edit = {
        def filterInstance = Filter.get(params.id)
        if (!filterInstance) {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'filter.label', default: 'Filter'), params.id])}"
            redirect(action: "list")
        }
        else {
            return [filterInstance: filterInstance, filterTypes: FilterTypes.values()]
        }
    }

    def update = {
        def filterInstance = Filter.get(params.id)

        println "updating"
        println filterInstance.version
        println params.version
        
        if(filterInstance){
            
            if (params.version) {
                def version = params.version.toLong()
                if (filterInstance.version > version) {

                    filterInstance.errors.rejectValue("version", "default.optimistic.locking.failure", [message(code: 'filter.label', default: 'Filter')] as Object[], "Another user has updated this Filter while you were editing")
                    render(view: "edit", model: [filterInstance: filterInstance])
                }
            }

            filterInstance.properties = params
            if (!filterInstance.hasErrors() && filterInstance.save(flush: true)) {
                flash.message = "${message(code: 'default.updated.message', args: [message(code: 'filter.label', default: 'Filter'), filterInstance.id])}"
                redirect(controller:  "layer", action: "edit", id: filterInstance.layer.id)
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
                redirect(controller: "layer", action: "edit", id: ownerLayer.id)
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
}
