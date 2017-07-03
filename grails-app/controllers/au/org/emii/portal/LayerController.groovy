package au.org.emii.portal

import au.org.emii.portal.wms.NcwmsServer
import au.org.emii.portal.wms.GeoserverServer

import grails.converters.JSON

import static au.org.emii.portal.HttpUtils.Status.*

class LayerController {

    def grailsApplication
    def hostVerifier

    def configuredBaselayers = {
        def baseLayerConfig = grailsApplication.config.baselayers

        baseLayerConfig.each {
            it.isBaseLayer = true
            it.queryable = false
        }

        render baseLayerConfig as JSON
    }

    def _getServerClass(serverType) {
        if (serverType == 'ncwms') {
            return new NcwmsServer()
        }
        else {
            return new GeoserverServer(grailsApplication.config.filtering.filePath)
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

        server = proxyRedirect(server)

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

        server = proxyRedirect(server)

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

    def proxyRedirect (server) {

        def proxyRedirects = grailsApplication.config.proxyRedirects
        proxyRedirects.each {
            if(server.contains(it.uri)) {
                server = it.redirectUri;
            }
        }

        return server;
    }
}
