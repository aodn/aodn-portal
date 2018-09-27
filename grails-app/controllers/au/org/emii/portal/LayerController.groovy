package au.org.emii.portal

import au.org.emii.portal.wms.*

import grails.converters.JSON

import static au.org.emii.portal.HttpUtils.Status.*

class LayerController {

    def grailsApplication
    def groovyPageRenderer
    def hostVerifier

    def configuredLayers = {

        def baseLayerConfig = grailsApplication.config.baselayers
        baseLayerConfig.each {
            it.isBaseLayer = true
            it.queryable = false
        }

        def dataLayerConfig = grailsApplication.config.datalayers
        dataLayerConfig.each {
            it.isDataLayer = true
            it.displayInLayerSwitcher = true
            it.queryable = false
            it.visibility = false
        }

        def layerConfig = [baseLayerConfig, dataLayerConfig].flatten().findAll{it}

        render layerConfig as JSON
    }


    def _getServerClass(serverType) {
        if (serverType == 'ncwms') {
            return new NcwmsServer()
        }
        else if (serverType == 'ala') {
            return new AlaServer()
        }
        else if (serverType == 'geoservercore') {
            return new CoreGeoserverServer(groovyPageRenderer)
        }
        else {
            return new ImosGeoserverServer(grailsApplication.config.filtering.filePath)
        }
    }

    def getStyles = {
        def (server, layer, serverType) = parseParams(params)

        if (hostVerifier.allowedHost(server)) {
            def serverObject = _getServerClass(serverType)

            render serverObject.getStyles(server, layer) as JSON
        }
        else {
            render text: "Host '$params.server' not allowed", status: HTTP_502_BAD_GATEWAY
        }
    }

    def getFilterValues = {
        def (server, layer, serverType, filter) = parseParams(params)

        if (hostVerifier.allowedHost(server)) {
            def serverObject = _getServerClass(serverType)

            render serverObject.getFilterValues(server, layer, filter) as JSON
        }
        else {
            render text: "Host '$params.server' not allowed", status: HTTP_502_BAD_GATEWAY
        }
    }

    def getFilters = {
        def (server, layer, serverType) = parseParams(params)

        if (hostVerifier.allowedHost(server)) {
            def serverObject = _getServerClass(serverType)

            render serverObject.getFilters(server, layer) as JSON
        }
        else {
            render text: "Host '$params.server' not allowed", status: HTTP_502_BAD_GATEWAY
        }
    }

    def parseParams(params) {
        [params.server, params.layer, params.serverType, params.filter]
    }
}
