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
import org.apache.catalina.connector.ClientAbortException

import static au.org.emii.portal.HttpUtils.buildAttachmentHeaderValueWithFilename

class DownloadController extends RequestProxyingController {

    def grailsApplication
    def bulkDownloadService

    static def SIZE_ESTIMATE_ERROR = "-1"

    // Index action inherited from RequestProxyingController

    def urlListForLayer = {

        def (fieldName, prefixToRemove, newUrlBase) = _loadCommonFields(params)

        if (!fieldName) {
            render text: 'urlFieldName was not provided', status: 400
            return
        }

        _performProxying(
            requestSingleFieldParamProcessor(fieldName),
            urlListStreamProcessor(fieldName, prefixToRemove, newUrlBase)
        )
    }

    def downloadPythonSnippet = {
        response.setContentType("text/plain")
        response.setHeader('Content-Disposition', "Attachment;Filename=\"${params.downloadFilename}\"")
        response.outputStream << g.render(template: "pythonSnippet.py", model: [ collectionUrl: params.url])
    }

    def downloadNetCdfFilesForLayer = {

        def (fieldName, prefixToRemove, newUrlBase) = _loadCommonFields(params)

        if (!fieldName) {
            render text: 'urlFieldName was not provided', status: 400
            return
        }

        def url = UrlUtils.urlWithQueryString(params.url, "PROPERTYNAME=$fieldName")

        if (!hostVerifier.allowedHost(url)) {
            render text: "Host for address '$url' not allowed", contentType: "text/html", encoding: "UTF-8", status: 400
            return
        }

        def resultStream = new ByteArrayOutputStream()
        def streamProcessor = urlListStreamProcessor(fieldName, prefixToRemove, newUrlBase)

        try {
            _executeExternalRequest url, streamProcessor, resultStream
        }
        catch (Exception e) {
            log.error "Could not download NetCDF files. Failed during _executeExternalRequest for $url", e
            render 'An error occurred before downloading could begin'
            return
        }

        def urls = new String(resultStream.toByteArray(), 'UTF-8').split()

        def downloadFilename = params.remove('downloadFilename')
        response.setHeader("Content-disposition", buildAttachmentHeaderValueWithFilename(downloadFilename))

        try {
            bulkDownloadService.generateArchiveOfFiles(urls, response.outputStream, request.locale)
        }
        catch (Exception e) {

            if (e.cause.class == ClientAbortException) {
                log.debug "ClientAbortException caught during bulk download.", e
            }
            else {
                log.error "Unhandled exception during bulk download", e
            }
        }
    }

    def estimateSizeForLayer = {

        def urlFieldName = params.urlFieldName
        def sizeFieldName = grailsApplication.config.indexedFile.fileSizeColumnName
        def url = UrlUtils.urlWithQueryString(params.url, "PROPERTYNAME=$urlFieldName,$sizeFieldName")

        if (!hostVerifier.allowedHost(url)) {

            log.error "Host for address '$url' not allowed"
            render SIZE_ESTIMATE_ERROR
            return
        }

        def resultStream = new ByteArrayOutputStream()

        if (urlFieldName) {

            try {
                def streamProcessor = calculateSumStreamProcessor(urlFieldName, sizeFieldName)
                _executeExternalRequest url, streamProcessor, resultStream
            }
            catch (Exception e) {

                log.error "Problem estimating size with $url", e

                resultStream << SIZE_ESTIMATE_ERROR
            }
        }
        else {

            log.error "No urlFieldName provided"

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

    def _getServer(host) {
        return grailsApplication.config.knownServers.find { it.uri.toURL().host == host }
    }

    def _loadCommonFields(params) {
        def url = params.url.toURL()
        def server = _getServer(url.host)
        log.info url.host
        log.info server

        return [
            params.remove('urlFieldName'),
            server?.urlListDownloadPrefixToRemove ?: "",
            server?.urlListDownloadPrefixToSubstitue ?: ""
        ]
    }
}
