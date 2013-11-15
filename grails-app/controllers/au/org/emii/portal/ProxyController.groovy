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

        // Todo - DN: building this filename should be done in Javascript. Then we wouldn't need this separate action.

        def injectGifFilename = { params ->

            def layersField = "LAYERS="
            def fieldIndex = params.url.indexOf(layersField)

            if (fieldIndex > -1) {
                def layerName = params.url.substring(fieldIndex + layersField.length())
                def timeStr = params.TIME
                    .replaceAll("[-:]", "")
                    .replaceAll("/", "_")

                params.downloadFilename = "${layerName}_${timeStr}.gif"
            }

            return params
        }

        _performProxying(injectGifFilename)
    }

    // this action is intended to always be cached by squid
    // expects Open layers requests
    def cache = {

        // Todo - DN: We're just changing query string values from uppercase to lowercase. I reckon this could be done in javascript.
        // Todo - DN: What else is special about it?

        def makeLowercase = { params, uppercaseName ->
            params[uppercaseName.toLowerCase()] = params[uppercaseName]
            params.remove uppercaseName
        }

        def changeCaseOfParams = { params ->
            // Expects uppercase URL and FORMAT params
            makeLowercase params, 'URL'
            makeLowercase params, 'FORMAT'

            return params
        }

        _performProxying(changeCaseOfParams)
    }

    def _performProxying = { paramProcessor = null ->

        if (!params.url) {
            render text: "No URL supplied", contentType: "text/html", encoding: "UTF-8", status: 500
        }
        else if (!hostVerifier.allowedHost(request, params.url)) {
            log.info "Proxy: The url ${params.url} was not allowed"
            render text: "Host for address '${params.url}' not allowed", contentType: "text/html", encoding: "UTF-8", status: 500
        }
        else {

            def processedParams = paramProcessor ? paramProcessor(params) : params

            // Make request
            def proxiedRequest = new ProxiedRequest(request, response, processedParams)
            proxiedRequest.proxy()
        }
    }

    def wmsOnly = {

        // Todo - DN: Can this be tidied or refactored at all?

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
}
