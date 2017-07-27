package au.org.emii.portal

import au.com.bytecode.opencsv.CSVReader
import au.org.emii.portal.proxying.ExternalRequest
import au.org.emii.portal.proxying.RequestProxyingController
import grails.converters.JSON
import groovy.json.JsonSlurper
import org.apache.catalina.connector.ClientAbortException

import static au.org.emii.portal.HttpUtils.Status.*
import static au.org.emii.portal.HttpUtils.buildAttachmentHeaderValueWithFilename

class DownloadController extends RequestProxyingController {

    def grailsApplication
    def bulkDownloadService

    // Index action inherited from RequestProxyingController

    def urlListForLayer = {

        def (fieldName, urlSubstitutions) = _loadCommonFields(params)

        if (!fieldName) {
            render text: 'urlFieldName was not provided', status: HTTP_400_BAD_REQUEST
            return
        }

        _performProxyingIfAllowed(
            requestSingleFieldParamProcessor(fieldName),
            urlListStreamProcessor(fieldName, urlSubstitutions),
            fieldName
        )
    }

    def downloadEstimator = {

        if (hostVerifier.allowedHost(params.server)) {
            def url = "${params.server}?layer=${params.layer}&subset=${params.subset}"
            try {
                render new JsonSlurper().parse(url.toURL()) as JSON
            }
            catch (Exception e) {
                log.error "Could not do Download Estimate with ${url}", e
                render ''
            }
        }
        else {
            render text: "Host for Download Estimater '${params.server}' not allowed", contentType: "text/html", encoding: "UTF-8", status: HTTP_403_FORBIDDEN
        }
    }

    def downloadPythonSnippet = {
        _addDownloadTokenCookie()
        response.setContentType("text/plain")
        response.setHeader('Content-Disposition', "Attachment;Filename=\"${params.downloadFilename}\"")
        response.outputStream << g.render(template: "pythonSnippet.py", model: [ collectionUrl: params.url])
    }

    def downloadFilesForLayer = {

        def (fieldName, urlSubstitutions) = _loadCommonFields(params)

        if (!fieldName) {
            render text: 'urlFieldName was not provided', status: HTTP_400_BAD_REQUEST
            return
        }

        def url = UrlUtils.urlWithQueryString(params.url, "PROPERTYNAME=$fieldName")

        if (!hostVerifier.allowedHost(url)) {
            render text: "Host for address '$url' not allowed", contentType: "text/html", encoding: "UTF-8", status: HTTP_403_FORBIDDEN
            return
        }

        def resultStream = new ByteArrayOutputStream()
        def streamProcessor = urlListStreamProcessor(fieldName, urlSubstitutions)

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
        _addDownloadTokenCookie()
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

    def downloadShapeFilesForLayer = {
        def shapeFileUrl = new URL(params.url);
        def connection = shapeFileUrl.openConnection();
        def dataStream = connection.inputStream

        _addDownloadTokenCookie()
        response.setContentType("application/octet-stream")
        response.setHeader('Content-Disposition', "Attachment;Filename=\"${params.downloadFilename}\"")
        response.outputStream << dataStream
        response.outputStream.flush()
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

    def urlListStreamProcessor(fieldName, urlSubstitutions) {

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
                    urlSubstitutions.each {
                        search, replace ->
                        if (!rowValue.startsWith("http")) {
                            rowValue = rowValue.replaceAll(search, replace)
                        }
                    }

                    if (rowValue && includedUrls.add(rowValue)) {
                        outputWriter.println rowValue
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
        return grailsApplication.config.knownServers.find { it.uri.toURL().host == host && it.type == 'GeoServer' }
    }

    def _loadCommonFields(params) {
        def url = params.url.toURL()
        def server = _getServer(url.host)

        return [
            params.remove('urlFieldName'),
            server?.urlListDownloadSubstitutions ?: ""
        ]
    }
}
