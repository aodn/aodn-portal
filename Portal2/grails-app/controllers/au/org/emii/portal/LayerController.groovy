package au.org.emii.portal

import grails.converters.JSON
import org.apache.shiro.SecurityUtils
import org.hibernate.criterion.MatchMode
import org.hibernate.criterion.Restrictions

class LayerController {

    static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

    def layerService
	def dataSource
    def authService

    def index = {
        redirect(action: "list", params: params)
    }

    def list = {

        def query = {

            and {
                if ( params.keyword ) {

                    or {
                        ilike( "name", "%${params.keyword}%" )
                        ilike( "title", "%${params.keyword}%" )
                        ilike( "namespace", "%${params.keyword}%" )
                    }
                }

                if ( params.serverId ) {

                    eq( "server.id", params.long( "serverId" ) )
                }
            }

            if ( params.sort ) {
                order( params.sort, params.order )
            }
            else {
                order( "server", "asc" )
                order( "title", "asc" )
            }
        }
        
        params.max = Math.min( params.max ? params.int( "max" ) : 50, 250 )
        if ( !params.offset ) params.offset = 0

        def criteria = Layer.createCriteria()
        def layers = criteria.list( query, max: params.max, offset: params.offset )
        def filters = [keyword: params.keyword, serverId: params.serverId]
        
        def model = [
            layerInstanceList: layers,
            layersShownCount: layers.size(),
            filteredLayersCount: layers.totalCount,
            filters: filters
        ]

        if ( request.xhr ) {

            // This is an ajax request
            render template: "listBody", model: model
        }
        else {

            return model
        }
    }

    def listBaseLayersAsJson = {
        def layerInstanceList = Layer.findAllByIsBaseLayerNotEqual(false)
		JSON.use("deep") {
			render layerInstanceList as JSON
        }
    }
    
	def listForMenuEdit = {
		def max = params.limit?.toInteger() ?: 50
		def offset = params.start?.toInteger() ?: 0
		
		def criteria = Layer.createCriteria()
		def layers = criteria.list(max: max, offset: offset) {
			if (params.phrase?.size() > 1) {
				add(Restrictions.ilike("title", "${params.phrase}", MatchMode.ANYWHERE))
			}
			add(Restrictions.isEmpty("layers"))
			eq 'blacklisted', false
			eq 'activeInLastScan', true
			server {
				eq 'disable', false
			}
			order("server.id")
			order("title")
		}
		
		def combinedList = _collectLayersAndServers(layers)
		render _toResponseMap(combinedList, layers.totalCount) as JSON
	}
	
    def showLayerByItsId = {

        def layerInstance = null
        // unencode layerId as per 'listAllLayers' to get just the id
        if (params.layerId != null) {
            def layerIdArr = params.layerId.split("_")
            layerInstance = Layer.get( layerIdArr[ layerIdArr.size() - 1 ])
        }
        if (layerInstance) {
			JSON.use("deep") {
				render layerInstance as JSON
			}
        }
        else {
            log.error "Layer: The layerId does not exist"
            render text: "The layerId '${params.layerId}' does not exist", contentType: "text/html", encoding: "UTF-8", status: 500
        }
    }

    def create = {
        def layerInstance = new Layer()

        layerInstance.properties = params
        layerInstance.dataSource = "Manual"

        return [layerInstance: layerInstance]
    }

    def save = {
        def layerInstance = new Layer(params)
        if (layerInstance.save(flush: true)) {
            flash.message = "${message(code: 'default.created.message', args: [message(code: 'layer.label', default: 'Layer'), layerInstance.id])}"
            redirect(action: "list")
        }
        else {
            render(view: "create", model: [layerInstance: layerInstance])
        }
    }

    def edit = {
        def layerInstance = Layer.get(params.id)
        if (!layerInstance) {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'layer.label', default: 'Layer'), params.id])}"
            redirect(action: "list")
        }
        else {
            return [layerInstance: layerInstance]
        }
    }

    def update = {
        def layerInstance = Layer.get(params.id)
        if (layerInstance) {
            if (params.version) {
                def version = params.version.toLong()
                if (layerInstance.version > version) {
                    
                    layerInstance.errors.rejectValue("version", "default.optimistic.locking.failure", [message(code: 'layer.label', default: 'Layer')] as Object[], "Another user has updated this Layer while you were editing")
                    render(view: "edit", model: [layerInstance: layerInstance])
                    return
                }
            }
            layerInstance.properties = params
            if (!layerInstance.hasErrors() && layerInstance.save(flush: true)) {
                flash.message = "${message(code: 'default.updated.message', args: [message(code: 'layer.label', default: 'Layer'), layerInstance.id])}"
                redirect(action: "list", id: layerInstance.id)
            }
            else {
                render(view: "edit", model: [layerInstance: layerInstance])
            }
        }
        else {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'layer.label', default: 'Layer'), params.id])}"
            redirect(action: "list")
        }
    }

    def delete = {
        def layerInstance = Layer.get(params.id)
        if (layerInstance) {
            try {
				//layerInstance.onDelete()
                layerInstance.delete()
                flash.message = "${message(code: 'default.deleted.message', args: [message(code: 'layer.label', default: 'Layer'), params.id])}"
                redirect(action: "list")
            }
            catch (org.springframework.dao.DataIntegrityViolationException e) {
                flash.message = "${message(code: 'default.not.deleted.message', args: [message(code: 'layer.label', default: 'Layer'), params.id])}"
                redirect(action: "edit", id: params.id)
            }
        }
        else {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'layer.label', default: 'Layer'), params.id])}"
            redirect(action: "list")
        }
    }

    def saveOrUpdate = {

        try {
            // Logging output
            def passwordPrint = "*" * params.password?.length()
            def layerDataPrint = JSON.parse( params.layerData )
            layerDataPrint.children = "[...]"
            layerDataPrint.supportedProjections = "[...]"
            
            log.debug "username: ${params.username}"
            log.debug "password: $passwordPrint"
            log.debug "metadata: ${params.metadata}"
            log.debug "layerData: $layerDataPrint"
            
            // Check credentials
            try {
                _validateCredentialsAndAuthenticate params
            }
            catch(Exception e) {

                log.info "Problem validating credentials", e

                render status: 401, text: "Credentials missing or incorrect"
                return
            }
            
            // Should control be handed-off to layerService as soon as the credentials are checked?
            
            // Check metadata
            def metadata = JSON.parse( params.metadata )
            _validateMetadata metadata

            // Check layer data
            def layerData = params.layerData
            _validateLayerData layerData

            // Get server w/ metdata
            def server = Server.findByUri( metadata.serverUri )

            if ( !server ) throw new IllegalStateException( "Unable to find server for uri: ${metadata.serverUri}" )
            
            layerService.updateWithNewData JSON.parse( layerData ), server, metadata.dataSource
            
            server.lastScanDate = new Date()
            server.save( failOnError: true )
            
            render status: 200, text: "Complete (saved)"
        }
        catch (Exception e) {

            log.info "Error processing layer/saveOrUpdate request", e
            
            render status: 500, text: "Error processing request: $e"
        }
    }
    
    void _validateCredentialsAndAuthenticate(def params) {
        
        def un = params.username
        def pwd = params.password
        
        if ( !un ) throw new IllegalArgumentException( "Value for username is invalid. username: '$un'" )
        if ( !pwd ) throw new IllegalArgumentException( "Value for password is invalid." )
        
        def authToken = new SaltedUsernamePasswordToken( authService, un.toLowerCase(), pwd )

        SecurityUtils.subject.login authToken
        
        def permissionString = "${controllerName}:${actionName}"
        log.debug "Checking permissions: $permissionString"
        
        if ( !SecurityUtils.subject.isPermitted( permissionString ) ) throw new Exception( "User $un does not have correct permissions" )
    }
    
    void _validateMetadata(def metadata) {
        
        if ( !metadata ) throw new IllegalArgumentException( "Metadata must be present" )
        if ( !metadata.serverUri ) throw new IllegalArgumentException( "serverUri must be specified in the metadata" )
        if ( !metadata.dataSource ) throw new IllegalArgumentException( "dataSource must be specified in the metadata" )
    }
    
    void _validateLayerData(def layerData) {
        
        if ( !layerData ) throw new IllegalArgumentException( "LayerData must be present" )
    }

    def server = {
        def layerDescriptors = []
        def server = _getServer(params)
        if (server) {
            def criteria = Layer.createCriteria()
            layerDescriptors = criteria.list() {
                    isNull 'parent'
					eq 'blacklisted', false
					eq 'activeInLastScan', true
                    eq 'server.id', server.id
            }
        }

        def result = [layerDescriptors: layerDescriptors]
		JSON.use("deep") {
			render result as JSON
        }
    }
	
	def configuredbaselayers = {
		def layerIds = Config.activeInstance().baselayerMenu.menuItems.collect { it.layerId } 
		def defaultBaseLayers = Layer.findAllByIdInList(layerIds)
		JSON.use("deep") {
			render defaultBaseLayers as JSON
		}
	}
	
	def defaultlayers = {
		JSON.use("deep") {
			render Config.activeInstance().defaultLayers as JSON
		}
	}

    def _getServer(params) {
        if (params.server) {
            return Server.get(params.server)
        }
        return null
    }
	
	def _collectLayersAndServers(layers) {
		def items = []
		def server
		layers.each { layer ->
			server = _collectServer(server, layer.server, items)
			items.add(layer)
		}
		return items
	}
	
	def _collectServer(previous, current, items) {
		def result = previous
		if (_isServerCollectable(result, current)) {
			result = current
			items.add(result)
		}
		return result
	}
	
	def _isServerCollectable(server1, server2) {
		return server2 && (!server1 || server1 != server2)
	}
	
	def _toResponseMap(data, total) {
		return [data: data, total: total]
	}
}