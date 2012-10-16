package au.org.emii.portal

import au.org.emii.portal.display.MenuJsonCache
import grails.converters.JSON
import org.hibernate.criterion.MatchMode
import org.hibernate.criterion.Restrictions
import org.springframework.beans.BeanUtils

import java.beans.PropertyDescriptor
import java.lang.reflect.Method

class LayerController {

    static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

    def layerService
	def dataSource

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

		def parentIds = Layer.findAllByParentIsNotNull().collect { it.parent.id }.unique()

		def criteria = Layer.createCriteria()
		def layers = criteria.list(max: max, offset: offset) {
			if (params.phrase?.size() > 1) {
				add(Restrictions.ilike("title", "${params.phrase}", MatchMode.ANYWHERE))
			}
			eq 'blacklisted', false
			eq 'activeInLastScan', true
			server {
				eq 'disable', false
			}
			order("server.id")
			order("title")
		}

		def combinedList = layers.grep { !parentIds.contains(it.id) }
		combinedList = _collectLayersAndServers(combinedList)
		render _toResponseMap(combinedList, layers.totalCount) as JSON
	}

    def showLayerByItsId = {

        def layerInstance = Layer.get( params.layerId )

        if ( layerInstance ) {
			_renderLayer(layerInstance)
        }
        else {

            def queryString = request.queryString ? "?$request.queryString" : ""
            def msg = "Layer with id '$params.layerId' does not exist. URL was: $request.forwardURI$queryString"
            log.info msg
            render text: msg, contentType: "text/html", encoding: "UTF-8", status: 500
        }
    }

    // Lookup a layer using the server uri and layer name
    // (used to find any portal layer corresponding to externally
	// entered layer details e.g. layers sourced from metadata records)

    def findLayerAsJson = {
        def criteria = Layer.createCriteria()

        // split name into namespace and local name components if applicable

        def parts = params.name.split(":")
        def namespace, localName

        if (parts.length == 2) {
            namespace = parts[0]
            localName = parts[1]
        } else {
            namespace = null
            localName = params.name
        }

        def layerInstance = criteria.get {
            server {
                or {
                    // Supplied uri matches server uri used by the WMS Scanner to retrieve the GetCapabilities document
                    like("uri", params.serverUri+"%")
                    // Supplied uri matches published GetMap endpoint (link used by GeoNetwork WMS harvester)
                    // Note that different GetCapabilites versions may have different request endpoints.
                    // So, make sure GeoNetwork and the WMS Scanner harvest the same GetCapabilities version!)
                    operations {
                        eq( "name", "GetMap" )
                        eq( "getUrl", params.serverUri)
                    }
                }
            }
            if (namespace) {
                eq( "namespace", namespace)
            } else {
                isNull ("namespace")
            }
            eq( "name", localName)
            isNull("cql")      // don't include filtered layers!
			eq("activeInLastScan", true)
        }

        if (layerInstance) {
			_renderLayer(layerInstance)
        } else {
            render text: "Layer '${params.namespace}:${params.name}' does not exist", status: 404
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
	            _recache(layerInstance.server)
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
                layerInstance.delete(flush: true)
                flash.message = "${message(code: 'default.deleted.message', args: [message(code: 'layer.label', default: 'Layer'), params.id])}"
                redirect(action: "list")
	            au.org.emii.portal.Config.recacheDefaultMenu()
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

        log.info "Capabilities data length: ${params.capabilitiesData?.length()}"
        log.debug "metadata: ${params.metadata}"

        // Check credentials
        try {
            _validateCredentialsAndAuthenticate params
        }
        catch(Exception e) {

            log.info "Problem validating credentials", e

            log.debug "Possible problem with '${ params.password }'"

            render status: 401, text: "Credentials missing or incorrect"
            return
        }

        try {
            // Check metadata
            def metadata = JSON.parse( params.metadata as String )
            _validateMetadata metadata

            // Check capabilities data
            def capabilitiesData = params.capabilitiesData
            _validateCapabilitiesData capabilitiesData

            // Get server w/ metdata
            def server = Server.findByUri( metadata.serverUri )

            if ( !server ) throw new IllegalStateException( "Unable to find server for uri: ${metadata.serverUri}" )

            def serverCapabilities = JSON.parse( capabilitiesData as String )

            layerService.updateWithNewData serverCapabilities.rootLayer, server, metadata.dataSource

            server.updateOperations serverCapabilities.operations

            server.lastScanDate = new Date()
            server.save( failOnError: true )

            render status: 200, text: "Complete (saved)"

			_recache(server)
        }
        catch (Exception e) {

            log.info "Error processing layer/saveOrUpdate request", e

            render status: 500, text: "Error processing request: $e"
        }
    }

	def getFormattedMetadata = {

        def responseText

		if (params.metaURL != null) {

			try {
				//Connect
				def con = new URL(params.metaURL).openConnection()
                def metadataText = con.content.text

                if (con.contentType.contains("text/xml")) {

                    def xml = new XmlSlurper().parseText(metadataText)
                    //TODO: Validate schema before proceeding

                    //Extract Abstract and resource links
                    def abstractText = xml.identificationInfo.MD_DataIdentification.abstract.CharacterString.text()
                    def onlineResourcesList = xml.distributionInfo.MD_Distribution.transferOptions.MD_DigitalTransferOptions.onLine.list()

                    //TODO: transform to html in a better way. e.g. xslt
                    def html = "<BR><b>Abstract</b><BR>${abstractText}<BR><BR><b>Online Resources</b><BR>"
                    onlineResourcesList.each {
                        if(!it.CI_OnlineResource.protocol.text().startsWith("OGC:WMS")){
                            def linkText = it.CI_OnlineResource.description.CharacterString.text()
                            def linkUrl = it.CI_OnlineResource.linkage.URL.text()
                            html += "<a href=${linkUrl} target=\"_blank\">${linkText}</a><BR>"
                        }
                    }

                    responseText = html
                }
			}
            catch(SAXException) {

                responseText = "<BR>The metadata record is not available at this time."
			}
            catch(FileNotFoundException) {

                responseText = "<BR>The metadata record is not available at this time."
			}
		}

        if ( !responseText ) responseText = "<BR>This layer has no link to a metadata record"

        render text: responseText, contentType: "text/html", encoding: "UTF-8"
	}


    void _validateCredentialsAndAuthenticate(def params) {

        def suppliedPassword = params.password

        if ( !suppliedPassword ) throw new IllegalArgumentException( "Supplied value for password is invalid." )

        def configuredPassword = Config.activeInstance().wmsScannerCallbackPassword

        if ( !configuredPassword ) throw new IllegalStateException( "WMS Scanner password not configured in Portal app." )

        if ( configuredPassword != suppliedPassword ) throw new IllegalArgumentException( "Supplied password does not match configured password." )
    }

    void _validateMetadata(def metadata) {

        if ( !metadata ) throw new IllegalArgumentException( "Metadata must be present" )
        if ( !metadata.serverUri ) throw new IllegalArgumentException( "serverUri must be specified in the metadata" )
        if ( !metadata.dataSource ) throw new IllegalArgumentException( "dataSource must be specified in the metadata" )
    }

    void _validateCapabilitiesData(def capabilitiesData) {

        if ( !capabilitiesData ) throw new IllegalArgumentException( "CapabilitiesData must be present" )
    }

    def server = {

        def server = _getServer(params)

        if (server) {
			def result = MenuJsonCache.instance().get(server)

            if (!result) {
				result = server.toServerLayerJson()
				MenuJsonCache.instance().add(server, result)
			}

            render result
        }
        else {

            render text: "Could not find Server with params: $params", status: 500
        }
    }

	def configuredbaselayers = {
		def layerIds = Config.activeInstance().baselayerMenu?.menuItems?.collect { it.layerId }
		def data = _convertLayersToListOfMaps(_findLayersAndServers(layerIds))
		render data as JSON
	}

	def defaultlayers = {
		def layerIds = Config.activeInstance().defaultLayers?.collect { it.id }
		def data = _convertLayersToListOfMaps(_findLayersAndServers(layerIds))
		render data as JSON
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

	def _convertLayersToListOfMaps(layers) {
		def data = []
		layers.each { layer ->
			data << _getLayerDefaultData(layer)
		}
		return data
	}

	def _findLayersAndServers(layerIds) {
		def layers = []
		if (layerIds) {
			def criteria = Layer.createCriteria()
			layers = criteria.list {
				'in'('id', layerIds)
				eq("activeInLastScan", true)
				eq("blacklisted", false)
				join 'server'
			}
		}

		layers = layers.sort {layer ->
			for(int i=0;i<layerIds.size(); i++) {
				if(layerIds.getAt(i) == layer.id) {
					return i;
				}
			}
		}

		return layers
	}

	def _renderLayer(layerInstance) {
        def excludes = [
                "class",
                "metaClass",
                "hasMany",
                "handler",
                "belongsTo",
                "layers",
                "parent",
                "hibernateLazyInitializer",
                "styles",
                "filters"
        ]

        def data = _getLayerData(layerInstance, excludes)
        render data as JSON
	}

	def _getLayerData(layer, excludes) {

        def layerData = [:]
		PropertyDescriptor[] properties = BeanUtils.getPropertyDescriptors(layer.getClass())
		for (PropertyDescriptor property : properties) {
			String name = property.getName()
			Method readMethod = property.getReadMethod()
			if (readMethod != null) {
				Object value = readMethod.invoke(layer, (Object[]) null)
				if ("layers".equals(name)) {
					layerData[name] = _convertLayersToListOfMaps(value)
				}
				else if (!excludes.contains(name)) {
					layerData[name] = value
				}
			}
		}
		return layerData
	}

    def _getLayerDefaultData(layer){
        def excludes = [
                "class",
                "metaClass",
                "dimensions",
                "metadataUrls",
                "hasMany",
                "handler",
                "belongsTo",
                "layers",
                "parent",
                "hibernateLazyInitializer"
        ]

        return _getLayerData(layer, excludes)
    }

	def _recache(server) {
        server.recache(MenuJsonCache.instance())
		Config.recacheDefaultMenu()
	}

    def getFiltersAsJSON = {
        def layerInstance = Layer.get( params.layerId )

        def results = []

        if ( layerInstance ) {

            layerInstance.filters?.each {
                results.add(it.toLayerData())
            }

            render results as JSON
        }
        else {
            def queryString = request.queryString ? "?$request.queryString" : ""
            def msg = "Layer with id '$params.layerId' does not exist. URL was: $request.forwardURI$queryString"
            log.info msg
            render text: msg, contentType: "text/html", encoding: "UTF-8", status: 500
        }
    }

    def editFilters = {
        def layerInstance = Layer.get(params.id)

        if (layerInstance) {
            render(view: "editFilters", model: [layerInstance: layerInstance])
        }
    }
}