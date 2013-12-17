/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import au.com.bytecode.opencsv.CSVReader

class DownloadController extends RequestProxyingController {

    def grailsApplication
    def hostVerifier

    // Index action inherited from RequestProxyingController

    def urlListForLayer = {

        def layerId = params.layerId

        if (!layerId) {
            render text: "No layerId provided", status: 400
            return
        }

        def layer = Layer.get(layerId)
        def fieldName = layer.urlDownloadFieldName
        def prefixToRemove = layer.server.urlListDownloadPrefixToRemove
        def newUrlBase = layer.server.urlListDownloadPrefixToSubstitue

        _performProxying(
            requestSingleFieldParamProcessor(fieldName),
            urlListStreamProcessor(fieldName, prefixToRemove, newUrlBase)
        )
    }

    def requestSingleFieldParamProcessor(fieldName) {

        return { params ->

            params.url = UrlUtils.urlWithQueryString(params.url, "PROPERTYNAME=$fieldName")

            return params
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
