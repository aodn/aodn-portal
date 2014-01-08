/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import au.com.bytecode.opencsv.CSVReader
import au.org.emii.portal.proxying.ExternalRequest
import au.org.emii.portal.proxying.RequestProxyingController

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

    def estimateSizeForLayer = {

        def layerId = params.layerId

        if (!layerId) {
            render text: "No layerId provided", status: 400
            return
        }

        def layer = Layer.get(layerId)
        def url = params.url

        if (!hostVerifier.allowedHost(request, url)) {
            render text: "Host for address '$url' not allowed", contentType: "text/html", encoding: "UTF-8", status: 400
            return
        }

        def resultStream = new ByteArrayOutputStream()
        def sizeFieldName = grailsApplication.config.indexedFile.fileSizeColumnName
        def streamProcessor = calculateSumStreamProcessor(layer.urlDownloadFieldName, sizeFieldName)

        _executeExternalRequest url, streamProcessor, resultStream

        render new String(resultStream.toByteArray(), 'UTF-8')
    }

    void _executeExternalRequest(url, streamProcessor, resultStream) {

        def request = new ExternalRequest(resultStream, url.toURL())
        request.executeRequest streamProcessor
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

    def calculateSumStreamProcessor(filenameFieldName, sizeFieldName) {

        return { inputStream, outputStream ->

            log.debug "calculateSumStreamProcessor"

            def csvReader = new CSVReader(new InputStreamReader(inputStream))
            def firstRow = csvReader.readNext() as List

            def filenameFieldIndex = firstRow.findIndexOf { it == filenameFieldName }
            def sizeFieldIndex = firstRow.findIndexOf { it == sizeFieldName }

            log.debug "filenameFieldName: '$filenameFieldName'; filenameFieldIndex: $filenameFieldIndex (it's a problem if this is null or -1)"
            log.debug "sizeFieldName: '$sizeFieldName'; sizeFieldIndex: $sizeFieldIndex (it's a problem if this is null or -1)"

            if (filenameFieldIndex == -1 || sizeFieldIndex == -1) {
                log.error "Could not find index of '$filenameFieldName' or '$sizeFieldName' in $firstRow"
                outputStream << "Results contained no column with header '$filenameFieldName' or '$sizeFieldName'. Column headers were: $firstRow"
                return
            }

            def sum = 0

            def higherFieldIndex = Math.max(filenameFieldIndex, sizeFieldIndex)
            def filenamesProcessed = [] as Set

            try {
                def currentRow = csvReader.readNext()
                while (currentRow) {
                    log.debug "Processing row $currentRow"

                    if (higherFieldIndex < currentRow.length) {

                        def rowFilename = currentRow[filenameFieldIndex].trim()
                        def rowSize = currentRow[sizeFieldIndex].trim()

                        if (rowFilename && rowSize) {

                            if (!filenamesProcessed.contains(rowFilename)) {

                                sum += rowSize.toBigInteger()
                                filenamesProcessed.add rowFilename
                            }
                        }
                    }

                    currentRow = csvReader.readNext()
                }
            }
            catch (Exception e) {
                log.warn "Error occurred while calculating sum of values", e

                sum = -1
            }

            outputStream << sum.toString()
        }
    }
}
