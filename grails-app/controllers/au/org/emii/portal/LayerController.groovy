/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import au.org.emii.portal.display.MenuJsonCache
import au.org.emii.portal.wms.NcwmsServer
import au.org.emii.portal.wms.GeoserverServer
import grails.converters.JSON
import groovy.time.TimeCategory
import org.hibernate.criterion.MatchMode
import org.hibernate.criterion.Restrictions
import org.springframework.beans.BeanUtils
import org.springframework.web.util.HtmlUtils
import org.xml.sax.SAXException

import java.beans.PropertyDescriptor
import java.lang.reflect.Method
import grails.converters.JSON

class LayerController {

    static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

    def aodaacAggregatorService
    def layerService
    def dataSource
    def hostVerifier

    def index = {
        redirect(action: "list", params: params)
    }

    def list = {

        params.max = Math.min(params.max ? params.int("max") : 50, 250)

        if (!params.offset) {
            params.offset = 0
        }

        if (params.isActive == null) {
            params.isActive = true
        }

        if (params.isRoot == null) {
            params.isRoot = ''
        }

        def criteria = Layer.createCriteria()
        def layers = criteria.list(_queryFromParams(params), max: params.max, offset: params.offset)
        def filters = [keyword: params.keyword, serverId: params.serverId, isActive: params.isActive, isRoot: params.isRoot]

        def model = [
            layerInstanceList: layers,
            layersShownCount: layers.size(),
            filteredLayersCount: layers.totalCount,
            filters: filters
        ]

        if (request.xhr) {

            // This is an ajax request
            render template: "listBody", model: model
        }
        else {

            return model
        }
    }

    def _queryFromParams(params) {

        return {

            and {
                if (params.keyword) {

                    or {
                        ilike("name", "%${params.keyword}%")
                        ilike("title", "%${params.keyword}%")
                        ilike("namespace", "%${params.keyword}%")
                    }
                }

                if (params.serverId) {

                    eq("server.id", params.long("serverId"))
                }

                if (params.isActive) {

                    eq("activeInLastScan", params.isActive.toBoolean())
                }

                if (params.isRoot) {

                    if (params.isRoot.toBoolean()) {

                        isNull("parent")
                    }
                    else {

                        isNotNull("parent")
                    }
                }
            }

            if (params.sort) {
                order(params.sort, params.order)
            }
            else {
                order("server", "asc")
                order("name", "asc")
                order("title", "asc")
            }
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

        def layerInstance = Layer.get(params.layerId)

        if (layerInstance) {
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
        }
        else {
            namespace = null
            localName = params.name
        }

        // due to WMS issues there may be more than one. Using list then taking the first one
        def layerInstances = criteria.list {
            server {
                or {
                    // Supplied uri matches server uri used by the WMS Scanner to retrieve the GetCapabilities document
                    like("uri", (params.serverUri).replaceFirst(namespace + "/wms", "wms") + "%")
                    // Supplied uri matches published GetMap endpoint (link used by GeoNetwork WMS harvester)
                    // Note that different GetCapabilites versions may have different request endpoints.
                    // So, make sure GeoNetwork and the WMS Scanner harvest the same GetCapabilities version!)
                    operations {
                        eq("name", "GetMap")
                        eq("getUrl", params.serverUri)
                    }
                }
            }
            if (namespace) {
                eq("namespace", namespace)
            }
            else {
                isNull("namespace")
            }
            eq("name", localName)
            isNull("cql")      // don't include filtered layers!
            eq("activeInLastScan", true)
        }

        if (layerInstances) {
            _renderLayer(layerInstances[0])
        }
        else {
            response.status = 404
            render text: "Layer '${namespace}:${localName}' does not exist"
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

            _updateViewParams(layerInstance, params)

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

    def _updateViewParams(layer, params) {

        layer.viewParams?.delete()

        def newVals = params.viewParams
        def allValuePresent = newVals?.centreLat && newVals?.centreLon && newVals?.openLayersZoomLevel

        if (allValuePresent) {

            layer.viewParams = new LayerViewParameters([layer: layer] + newVals)
        }
        else {

            layer.viewParams = null
        }

        params.remove('viewParams')
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

        log.debug "Capabilities data length: ${params.capabilitiesData?.length()}"
        log.debug "metadata: ${params.metadata}"

        // Check credentials
        try {
            _validateCredentialsAndAuthenticate params
        }
        catch (Exception e) {

            log.info "Problem validating credentials", e

            log.debug "Possible problem with '${ params.password }'"

            render status: 401, text: "Credentials missing or incorrect"
            return
        }

        try {
            def startTime = new Date()

            // Check metadata
            def metadata = JSON.parse(params.metadata as String)
            _validateMetadata metadata

            // Check capabilities data
            def capabilitiesData = params.capabilitiesData
            _validateCapabilitiesData capabilitiesData

            log.info "saveOrUpdate Layer. Finding server with uri: ${metadata.serverUri}"

            // Get server w/ metdata
            def server = Server.findByUri(metadata.serverUri)

            if (!server) {
                throw new IllegalStateException("Unable to find server for uri: ${metadata.serverUri}")
            }

            def serverCapabilities = JSON.parse(capabilitiesData as String)

            layerService.updateWithNewData serverCapabilities.rootLayer, server, metadata.dataSource

            server.updateOperations serverCapabilities.operations

            server.lastScanDate = new Date()
            server.save(failOnError: true)

            use(TimeCategory) {

                log.debug "saveOrUpdate() on '$server' took ${new Date() - startTime}"
            }

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

        if (params.uuid != null) {

            try {
                def con = new URL(_getMetadataUrl(params.uuid)).openConnection()
                def metadataText = con.content.text

                if (_isXmlContent(con.contentType)) {

                    def xml = new XmlSlurper().parseText(metadataText)
                    //TODO: Validate schema before proceeding

                    //Extract Abstract and resource links
                    def abstractText = HtmlUtils.htmlEscape(xml.identificationInfo.MD_DataIdentification.abstract.CharacterString.text())
                    def onlineResourcesList = xml.distributionInfo.MD_Distribution.transferOptions.MD_DigitalTransferOptions.onLine.list()

                    def html = "<!DOCTYPE html>\n"
                    html += "<h4>Abstract</h4>${abstractText}<BR><h4>Online Resources</h4>\n"

                    html += "<ul>\n"
                    onlineResourcesList.each {
                        if (!it.CI_OnlineResource.protocol.text().startsWith("OGC:WMS")) {
                            def linkText = HtmlUtils.htmlEscape(it.CI_OnlineResource.description.CharacterString.text())
                            def linkProtocol = HtmlUtils.htmlEscape(it.CI_OnlineResource.protocol.CharacterString.text())
                            def linkUrl = it.CI_OnlineResource.linkage.URL.text()
                            def linkExternal = ""
                            if (linkUrl && linkUrl[0] != "/") {
                                linkExternal = "class=\"external\""
                            }
                            // Overcome the case where the URL is valid but has no description
                            if (!linkText) {
                                linkText = "<i>Unnamed Resource</i>"
                            }

                            if (!linkProtocol.startsWith("IMOS:AGGREGATION")) {
                                html += """<li><a ${linkExternal} href="${linkUrl}" target="_blank">${linkText}</a></li>\n"""
                            }
                        }
                    }
                    html += "</ul>"

                    responseText = html
                }
            }
            catch (SAXException e) {
                log.warn("Error getting formatted metadata, params: ${params}", e)
                responseText = "<BR>The metadata record is not available at this time."
            }
            catch (FileNotFoundException e) {
                log.warn("Error getting formatted metadata, params: ${params}", e)
                responseText = "<BR>The metadata record is not available at this time."
            }
        }

        if (!responseText) {
            responseText = "<br>This data collection has no link to a metadata record"
        }

        render text: responseText, contentType: "text/html", encoding: "UTF-8"
    }

    void _validateCredentialsAndAuthenticate(def params) {

        def suppliedPassword = params.password

        if (!suppliedPassword) {
            throw new IllegalArgumentException("Supplied value for password is invalid.")
        }

        def configuredPassword = Config.activeInstance().wmsScannerCallbackPassword

        if (!configuredPassword) {
            throw new IllegalStateException("WMS Scanner password not configured in Portal app.")
        }

        if (configuredPassword != suppliedPassword) {
            throw new IllegalArgumentException("Supplied password does not match configured password.")
        }
    }

    void _validateMetadata(def metadata) {

        if (!metadata) {
            throw new IllegalArgumentException("Metadata must be present")
        }

        if (!metadata.serverUri) {
            throw new IllegalArgumentException("serverUri must be specified in the metadata")
        }

        if (!metadata.dataSource) {
            throw new IllegalArgumentException("dataSource must be specified in the metadata")
        }
    }

    void _validateCapabilitiesData(def capabilitiesData) {

        if (!capabilitiesData) {
            throw new IllegalArgumentException("CapabilitiesData must be present")
        }
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

    def configuredBaselayers = {
        render grailsApplication.config.baselayers as JSON
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

        return layers.collect { _getLayerDefaultData(it) }
    }

    def _renderLayer(layerInstance) {
        def excludes = [
            "class",
            "metaClass",
            "hasMany",
            "handler",
            "belongsTo",
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

                if (!excludes.contains(name)) {
                    if ("layers".equals(name)) {
                        layerData[name] = _convertLayersToListOfMaps(value)
                    }
                    else {
                        layerData[name] = value
                    }
                }
            }
        }

        return layerData
    }

    def _getMetadataUrl(uuid) {
        return grailsApplication.config.geonetwork.url +
            "/srv/eng/xml_iso19139.mcp?styleSheet=xml_iso19139.mcp.xsl&uuid=" + uuid
    }

    def _getLayerDefaultData(layer) {
        def excludes = [
            "class",
            "metaClass",
            "dimensions",
            "hasMany",
            "handler",
            "belongsTo",
            "parent",
            "hibernateLazyInitializer"
        ]

        return _getLayerData(layer, excludes)
    }

    def _recache(server) {

        server.recache(MenuJsonCache.instance())
    }

    def _getServerClass(serverType) {
        if (serverType == 'ncwms') {
            return new NcwmsServer()
        }
        else {
            return new GeoserverServer()
        }
    }

    def getStylesAsJSON = {
        if (hostVerifier.allowedHost(request, params.server)) {
            def server = params.server
            def layer = params.layer
            def serverObject = _getServerClass(params.serverType)

            render text: serverObject.getStyles(server, layer) as JSON
        }
        else (!hostVerifier.allowedHost(request, params.server)) {
            render text: "Host '$params.server' not allowed"
        }
    }

    def getFilterValuesAsJSON = {
        if (hostVerifier.allowedHost(request, params.server)) {
            def server = params.server
            def layer = params.layer
            def filter = params.filter
            def serverObject = _getServerClass(params.serverType)

            render text: serverObject.getFilterValues(server, layer, filter) as JSON
        }
        else {
            render text: "Host '$params.server' not allowed"
        }
    }

    def getFiltersAsJSON = {
        if (hostVerifier.allowedHost(request, params.server)) {
            def server = params.server
            def layer = params.layer
            def serverObject = _getServerClass(params.serverType)

            render text: serverObject.getFilters(server, layer) as JSON
        }
        else {
            render text: "Host '$params.server' not allowed"
        }
    }

    def editFilters = {
        def layerInstance = Layer.get(params.id)

        if (layerInstance) {
            render(view: "editFilters", model: [layerInstance: layerInstance])
        }
    }    

    def _isXmlContent(contentType) {
        return contentType.find(/(text|application)\/xml/)
    }
}
