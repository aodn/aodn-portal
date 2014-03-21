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

import static au.org.emii.portal.HttpUtils.buildAttachmentHeaderValueWithFilename

class DownloadController extends RequestProxyingController {

    def grailsApplication
    def hostVerifier
    def bulkDownloadService

    static def SIZE_ESTIMATE_ERROR = "-1"

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

        if (!prefixToRemove || !newUrlBase) {
            log.error('Cannot proceed with URL download, prefixToRemove or newUrlBase are not configured')
            render text: "Server is not configured for URL downloading, please contact server administrator", status: 404
            return
        }

        _performProxying(
            requestSingleFieldParamProcessor(fieldName),
            urlListStreamProcessor(fieldName, prefixToRemove, newUrlBase)
        )
    }

    def downloadNetCdfFilesForLayer = {

        def layerId = params.layerId

        if (!layerId) {
            render text: "No layerId provided", status: 400
            return
        }

        def layer = Layer.get(layerId)
        def fieldName = layer.urlDownloadFieldName
        def prefixToRemove = layer.server.urlListDownloadPrefixToRemove
        def newUrlBase = layer.server.urlListDownloadPrefixToSubstitue
        def url = UrlUtils.urlWithQueryString(params.url, "PROPERTYNAME=$fieldName")

        if (!hostVerifier.allowedHost(request, url)) {
            render text: "Host for address '$url' not allowed", contentType: "text/html", encoding: "UTF-8", status: 400
            return
        }

        def resultStream = new ByteArrayOutputStream()
        def streamProcessor = urlListStreamProcessor(fieldName, prefixToRemove, newUrlBase)

        _executeExternalRequest url, streamProcessor, resultStream
        def urls = new String(resultStream.toByteArray(), 'UTF-8').split()

        response.setHeader("Content-disposition", buildAttachmentHeaderValueWithFilename(params.downloadFilename))

        bulkDownloadService.generateArchiveOfFiles(urls, response.outputStream, request.locale)
    }

    def estimateSizeForLayer = {

        def layerId = params.layerId

        if (!layerId) {
            render text: "No layerId provided", status: 400
            return
        }

        def layer = Layer.get(layerId)
        def urlDownloadFieldName = layer.urlDownloadFieldName
        def sizeFieldName = grailsApplication.config.indexedFile.fileSizeColumnName
        def url = UrlUtils.urlWithQueryString(params.url, "PROPERTYNAME=$urlDownloadFieldName,$sizeFieldName")

        if (!hostVerifier.allowedHost(request, url)) {
            render text: "Host for address '$url' not allowed", contentType: "text/html", encoding: "UTF-8", status: 400
            return
        }

        def resultStream = new ByteArrayOutputStream()

        if (layer.urlDownloadFieldName) {

            try {
                def streamProcessor = calculateSumStreamProcessor(urlDownloadFieldName, sizeFieldName)
                _executeExternalRequest url, streamProcessor, resultStream
            }
            catch (Exception e) {

                log.error "Problem estimating size with $url", e

                resultStream << SIZE_ESTIMATE_ERROR
            }
        }
        else {

            log.error "No urlDownloadFieldName configured"

            resultStream << SIZE_ESTIMATE_ERROR
        }

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
                _eachRemainingRow(csvReader) { currentRow -> currentRow.each{ log.error it } }

                outputWriter.print "Results contained no column with header '$fieldName'. Column headers were: $firstRow"
                outputWriter.flush()
                return
            }

            _eachRemainingRow(csvReader) { currentRow ->
                if (fieldIndex < currentRow.length) {

                    def rowValue = currentRow[fieldIndex].trim()
                    rowValue = rowValue.replace(prefixToRemove, newUrlBase)

                    if (rowValue && includedUrls.add(rowValue)) {
                        outputWriter.print "$rowValue\n"
                    }
                }
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
                log.info "Could not find index of '$filenameFieldName' or '$sizeFieldName' in $firstRow (this might be because the harvester is not yet collecting file size information, or because of GeoServer configuration)"

                outputStream << "Results contained no column with header '$filenameFieldName' or '$sizeFieldName'. Column headers were: $firstRow"
                return
            }

            def sum = 0

            def higherFieldIndex = Math.max(filenameFieldIndex, sizeFieldIndex)
            def filenamesProcessed = [] as Set

            _eachRemainingRow(csvReader) { currentRow ->
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
            }

            outputStream << sum.toString()
        }
    }

    def _eachRemainingRow(reader, process) {

        def currentRow = reader.readNext()
        while (currentRow) {
            log.debug "Processing row $currentRow"

            process(currentRow)

            currentRow = reader.readNext()
        }
    }
}
