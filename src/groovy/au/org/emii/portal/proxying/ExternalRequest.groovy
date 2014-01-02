/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal.proxying

import au.org.emii.portal.Server
import org.apache.commons.io.IOUtils
import org.slf4j.Logger
import org.slf4j.LoggerFactory

class ExternalRequest {

    static final Logger log = LoggerFactory.getLogger(this)

    def outputStream
    def targetUrl

    ExternalRequest(outputStream, url) {

        this.outputStream = outputStream
        this.targetUrl = url
    }

    def straightThrough = { inputStream, outputStream ->
        log.debug "Straight-through stream processor"
        outputStream << inputStream
    }

    def executeRequest(streamProcessor = null) {

        def processStream = streamProcessor ?: straightThrough

        log.debug "Opening connection to target URL: $targetUrl"

        def conn = targetUrl.openConnection()
        _addAuthentication(conn, targetUrl)

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

    def _addAuthentication(connection, url) {
        def server = _getServer(url)
        if (server) {
            server.addAuthentication(connection)
        }
    }

    def _getServer(url) {
        return Server.findByUriLike("%${url.host}%")
    }
}
