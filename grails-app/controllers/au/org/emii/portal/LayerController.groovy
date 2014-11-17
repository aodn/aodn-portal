/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import au.org.emii.portal.wms.NcwmsServer
import au.org.emii.portal.wms.GeoserverServer
import grails.converters.JSON
import groovy.time.TimeCategory
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

    def listBaseLayersAsJson = {
        def layerInstanceList = Layer.findAllByIsBaseLayerNotEqual(false)
        JSON.use("deep") {
            render layerInstanceList as JSON
        }
    }

    def configuredBaselayers = {
        render grailsApplication.config.baselayers as JSON
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

    def _getMetadataUrl(uuid) {
        return grailsApplication.config.geonetwork.url +
            "/srv/eng/xml_iso19139.mcp?styleSheet=xml_iso19139.mcp.xsl&uuid=" + uuid
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

    def _isXmlContent(contentType) {
        return contentType.find(/(text|application)\/xml/)
    }
}
