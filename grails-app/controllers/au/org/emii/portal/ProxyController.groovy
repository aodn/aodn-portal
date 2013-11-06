/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

class ProxyController {

    def grailsApplication
    def hostVerifier

    def index = {

        _performProxying()
    }

    def downloadGif = {

        def beforeAction = { ->

            def layersField = "LAYERS="
            def fieldIndex = params.url.indexOf(layersField)

            if (fieldIndex > -1) {
                def layerName = params.url.substring(fieldIndex + layersField.length())
                def timeStr = params.TIME
                    .replaceAll("[-:]", "")
                    .replaceAll("/", "_")

                params.downloadFilename = "${layerName}_${timeStr}.gif"
            }
        }

        _performProxying(beforeAction)
    }

    def uniqueList = {

        def streamProcessor = { inputStream, outputStream ->

            def writer = new OutputStreamWriter(outputStream as OutputStream)
            def includedUrls = [] as HashSet
            def makeUnique = { includedUrls.add it.trim() }

            inputStream.filterLine writer, makeUnique
        }

        _performProxying(null, streamProcessor)
    }

    def _performProxying(beforeAction = null, streamProcessor = null) {

        if (!params.url) {
            render text: "No URL supplied", contentType: "text/html", encoding: "UTF-8", status: 500
        }
        else if (!_isAllowedHost(params.url)) {
            log.info "Proxy: The url ${params.url} was not allowed"
            render text: "Host for address '${params.url}' not allowed", contentType: "text/html", encoding: "UTF-8", status: 500
        }
        else {

            if (beforeAction) {
                log.debug "Calling beforeAction"
                beforeAction()
            }

            // Make request
            def proxiedRequest = new ProxiedRequest(request, response, params)
            proxiedRequest.proxy(streamProcessor)
        }
    }

    // this action is intended to always be cached by squid
    // expects Open layers requests
    def cache = {

        def makeLowercase = { uppercaseName ->
            params[uppercaseName.toLowerCase()] = params[uppercaseName]
            params.remove uppercaseName
        }

        def beforeFilter = { ->
            // Expects uppercase URL and FORMAT params
            makeLowercase 'URL'
            makeLowercase 'FORMAT'
        }

        _performProxying(beforeFilter)
    }

    def wmsOnly = {

        if (params.url) {

            try {
                def resp = params.url.toURL()
                def xml = new XmlSlurper().parseText(resp.text)
                // get all valid namespaces eg  xmlns:a="http://a.example.com" xmlns:b="http://b.example.com"
                def namespaceList = xml.'**'.collect{ it.namespaceURI() }.unique()

                def isWMS = false
                def validNSpaceURL = ['http://www.opengis.net/wms', 'http://www.opengis.net/ogc']
                namespaceList.each {
                    if (validNSpaceURL.contains(it)) {
                        isWMS = true
                    }
                }

                // might be a WMT_MS_Capabilities doc
                if (!isWMS) {
                    // what else is better?
                    if (xml.Service.Name.toString().length() > 0) {
                        isWMS = true
                    }
                }

                // exclude to all that dont have the namespace attribute for WMS
                if (isWMS) {
                    render text: resp.text, contentType: "text/xml", encoding: "UTF-8"
                }
                else {
                    // We dont tell the user the problem or how we valiate a genuine WMS XML doc
                    render text: params.url, status: 500
                }
            }
            catch (Exception e) {
                log.debug "User added WMS Server error: $e"

                render text: params.url, status: 500
            }
        }
    }

    def _isAllowedHost(url) {

        try {
            return url && hostVerifier.allowedHost(request, url.toURL())
        }
        catch (Exception e) {
            return false
        }
    }
}
