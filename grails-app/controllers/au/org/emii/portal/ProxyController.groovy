/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import au.com.bytecode.opencsv.CSVReader

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

        def fieldName = params.fieldName

        if (!fieldName) {
            render text: "Field name required to parse CSV result", status: 400
            return
        }

        _performProxying(null, uniqueListStreamProcessor(fieldName))
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

    def _performProxying = {
        beforeAction = null, streamProcessor = null ->

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

    def uniqueListStreamProcessor(fieldName) {

        return { inputStream, outputStream ->

            log.debug "Unique list streamProcessor"

            def includedUrls = [] as HashSet

            def outputWriter = new OutputStreamWriter(outputStream)
            def csvReader = new CSVReader(new InputStreamReader(inputStream))
            def firstRow = csvReader.readNext() as List

            def fieldIndex = firstRow.findIndexOf { it == fieldName }

            log.debug "fieldName: '$fieldName'; fieldIndex: $fieldIndex (it's a problem if this is null or -1)"

            if (fieldIndex == -1) {
                log.error "Could not find index of '$fieldName' in $firstRow"
                outputWriter.print "Results contained no column with header '$fieldName'"
                outputWriter.flush()
                return
            }

            def currentRow = csvReader.readNext()
            while (currentRow) {

                log.debug "Processing row $currentRow"

                if (fieldIndex < currentRow.length) {

                    def rowValue = currentRow[fieldIndex].trim()

                    if (rowValue && includedUrls.add(rowValue)) {
                        outputWriter.print "$rowValue\n"
                    }
                }

                currentRow = csvReader.readNext()
            }

            outputWriter.flush()
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
