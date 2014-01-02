/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal.proxying

import au.org.emii.portal.Server
import org.apache.commons.io.IOUtils
import org.slf4j.Logger
import org.slf4j.LoggerFactory

import static au.org.emii.portal.UrlUtils.urlWithQueryString

class ProxiedRequest {

    static final Logger log = LoggerFactory.getLogger(ProxiedRequest.class)

    def request
    def response
    def params

    def straightThrough = { inputStream, outputStream ->
        log.debug "Straight-through stream processor"
        outputStream << inputStream
    }

    ProxiedRequest(request, response, params) {
        this.request = request
        this.response = response
        this.params = params
    }

    def proxy(streamProcessor = null) {

        log.debug "params: $params"

        def processStream = streamProcessor ?: straightThrough

        def targetUrl = _getUrl(params)
        log.debug "Opening connection to target URL: ${targetUrl}"

        def conn = targetUrl.openConnection()

        response.contentType = params.format ?: request.contentType

        def outputStream = response.outputStream

        _addAuthentication(conn, targetUrl)

        // Force download if filename provided
        if (params.downloadFilename) {
            log.debug "downloadFilename is '${params.downloadFilename}'. Forcing download."
            response.setHeader("Content-disposition", "attachment; filename=${params.downloadFilename}")
        }

        try {
            processStream conn.inputStream, outputStream
            outputStream.flush()
        }
        catch (Exception e) {

            log.warn "Unable to process response from $targetUrl", e
        }
        finally {

            IOUtils.closeQuietly(outputStream)
        }
    }

    def _getUrl(params) {

        def query = params.findAll {
            key, value ->

            key != "controller" &&
            key != "action" &&
            key != "url" &&
            key != "format" &&
            key != "_dc"
        }

        return urlWithQueryString(params.url, query).toURL()
    }

    def _addAuthentication(connection, url) {
        def server = _getServer(url)
        if (server) {
            server.addAuthentication(connection)
        }
    }

    def _getServer(url) {
        return Server.findByUriLike("%${url.getHost()}%")
    }
}
