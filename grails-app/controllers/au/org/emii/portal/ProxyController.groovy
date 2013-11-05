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
        if (params.url) {
            _index()
        }
        else {
            render text: "No URL supplied", contentType: "text/html", encoding: "UTF-8", status: 500
        }
    }

    def downloadGif = {

        def layersField = "LAYERS="
        def fieldIndex = params.url.indexOf(layersField)

        if (fieldIndex > -1) {
            def layerName = params.url.substring(fieldIndex + layersField.length())
            def timeStr = params.TIME
                .replaceAll("[-:]", "")
                .replaceAll("/", "_")

            params.downloadFilename = "${layerName}_${timeStr}.gif"
        }

        _index()
    }

    def _index() {

        if (allowedHost(params.url)) {
            def proxiedRequest = new ProxiedRequest(request, response, params)
            proxiedRequest.proxy()
        }
        else {
            log.info "Proxy: The url ${params.url} was not allowed"
            render text: "Host for address '${params.url}' not allowed", contentType: "text/html", encoding: "UTF-8", status: 500
        }
    }

    def allowedHost(url) {

        try {
            return url && hostVerifier.allowedHost(request, url.toURL())
        }
        catch (Exception e) {
            return false
        }
    }

    // this action is intended to always be cached by squid
    // expects Open layers requests
    def cache = {

        // Accepts uppercase URL param only
        if (allowedHost(params?.URL)) {

            def url = params.URL.replaceAll(/\?$/, "")

            params.remove('URL')
            params.remove('action')
            params.remove('controller')
            // All other params are maintained in the URL (and passed to the index action)
            def p = params.collect{ k, v -> "$k=$v" }.join('&')
            if (p.size() > 0) {
                url += "?" + p
            }

            // assume that the request FORMAT (from openlayers) will be the return format
            redirect(action: '', params: [url: url, format: params.FORMAT])
        }
        else {
            render(text: "No valid allowable URL supplied", contentType: "text/html", encoding: "UTF-8", status: 500)
        }
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
}
