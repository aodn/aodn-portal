/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import au.com.bytecode.opencsv.CSVReader

class DownloadController {

    def grailsApplication
    def hostVerifier

    def index = {

        _performProxying()
    }

    def urlList = {

        def layerId = params.layerId

        if (!layerId) {
            render text: "No layerId provided", status: 400
            return
        }

        def layer = Layer.get(layerId)
        def fieldName = layer.urlDownloadFieldName
        def prefixToRemove = layer.server.urlListDownloadPrefixToRemove
        def newUrlBase = layer.server.urlListDownloadPrefixToSubstitue

        def requestSingleField = { params ->

            params.url = UrlUtils.urlWithQueryString(params.url, "PROPERTYNAME=$fieldName")

            return params
        }

        _performProxying(requestSingleField, urlListStreamProcessor(fieldName, prefixToRemove, newUrlBase))
    }

    def _performProxying = { paramProcessor = null, streamProcessor = null ->

        if (!params.url) {
            render text: "No URL supplied", contentType: "text/html", encoding: "UTF-8", status: 400
        }
        else if (!hostVerifier.allowedHost(request, params.url)) {
            log.info "Proxy: The url ${params.url} was not allowed"
            render text: "Host for address '${params.url}' not allowed", contentType: "text/html", encoding: "UTF-8", status: 500
        }
        else {

            def processedParams = paramProcessor ? paramProcessor(params) : params

            // Make request
            def proxiedRequest = new ProxiedRequest(request, response, processedParams)
            proxiedRequest.proxy(streamProcessor)
        }
    }

    def urlListStreamProcessor(fieldName, prefixToRemove, newUrlBase) {

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
                outputWriter.print "Results contained no column with header '$fieldName'. Column headers were: $firstRow"
                outputWriter.flush()
                return
            }

            def currentRow = csvReader.readNext()
            while (currentRow) {

                log.debug "Processing row $currentRow"

                if (fieldIndex < currentRow.length) {

                    def rowValue = currentRow[fieldIndex].trim()
                    rowValue = rowValue.replace(prefixToRemove, newUrlBase)

                    if (rowValue && includedUrls.add(rowValue)) {
                        outputWriter.print "$rowValue\n"
                    }
                }

                currentRow = csvReader.readNext()
            }

            outputWriter.flush()
        }
    }
}
