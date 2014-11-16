/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import au.org.emii.portal.wms.NcwmsServer
import au.org.emii.portal.wms.GeoserverServer
import org.springframework.web.util.HtmlUtils
import org.xml.sax.SAXException

import grails.converters.JSON

import static au.org.emii.portal.HttpUtils.Status.*

class LayerController {

    static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

    def grailsApplication
    def hostVerifier

    def configuredBaselayers = {
        render grailsApplication.config.baselayers as JSON
    }

    def getMetadataAbstract = {

        def response = "Error processing request"
        def status

        if (params.uuid != null) {

            try {
                def con = new URL(_getMetadataUrl(params.uuid)).openConnection()
                def metadataText = con.content.text

                if (_isXmlContent(con.contentType)) {

                    def xml = new XmlSlurper().parseText(metadataText)
                    //TODO: Validate schema before proceeding

                    def abstractText = HtmlUtils.htmlEscape(xml.identificationInfo.MD_DataIdentification.abstract.CharacterString.text())

                    response = abstractText
                    status = 200
                }
            }
            catch (SAXException e) {
                //Generic server error
                status = 500
            }
            catch (FileNotFoundException e) {
                //File not found error
                status = 404
            }
        }

        render status: status, text: response
    }

    def _getMetadataUrl(uuid) {
        return grailsApplication.config.geonetwork.url +
            "/srv/eng/xml_iso19139.mcp?styleSheet=xml_iso19139.mcp.xsl&uuid=" + uuid
    }

    def _getServerClass(serverType) {
        if (serverType == 'ncwms') {
            return new NcwmsServer()
        }
        else {
            return new GeoserverServer(grailsApplication.config.featureToggles.dynamicFilters)
        }
    }

    def getStylesAsJSON = {
        def (server, layer, serverType) = parseParams(params)

        if (hostVerifier.allowedHost(server)) {
            def serverObject = _getServerClass(serverType)

            render serverObject.getStyles(server, layer) as JSON
        }

        else {
            render text: "Host '$params.server' not allowed", status: HTTP_502_BAD_GATEWAY
        }
    }

    def getFilterValuesAsJSON = {
        def (server, layer, serverType, filter) = parseParams(params)

        if (hostVerifier.allowedHost(server)) {
            def serverObject = _getServerClass(serverType)

            render serverObject.getFilterValues(server, layer, filter) as JSON
        }
        else {
            render text: "Host '$params.server' not allowed", status: HTTP_502_BAD_GATEWAY
        }
    }

    def getFiltersAsJSON = {
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

    def _isXmlContent(contentType) {
        return contentType.find(/(text|application)\/xml/)
    }
}
