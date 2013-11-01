/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import org.apache.commons.io.IOUtils
import org.slf4j.Logger
import org.slf4j.LoggerFactory

class ProxiedRequest {

    static final Logger log = LoggerFactory.getLogger(ProxiedRequest.class)

    def request
    def response
    def params

    ProxiedRequest(request, response, params) {
        this.request = request
        this.response = response
        this.params = params
    }

    def proxy() {

        def targetUrl = _getUrl(params)
        def conn = targetUrl.openConnection()

        if (params.format) {
            response.contentType = params.format
        }
        else if (request.contentType) {
            response.contentType = request.contentType
        }

        def outputStream = response.outputStream

        _addAuthentication(conn, targetUrl)

        if (request.method == 'HEAD') {
            render(text: "", contentType: (params.format ?: params.FORMAT))
        }
        else {
            // Force download if filename provided
            if (params.downloadFilename) {
                response.setHeader("Content-disposition", "attachment; filename=${params.downloadFilename}");
            }

            try {
                outputStream << conn.inputStream
                outputStream.flush()
            }
            catch (Exception e) {

                log.info "Unable to pass-through response from $targetUrl", e
            }
            finally {

                IOUtils.closeQuietly(outputStream)
            }
        }
    }

    def _getUrl(params) {

        def query = params.findAll {
            key, value ->

            key != "controller" &&
            key != "url" &&
            key != "format" &&
            key != "_dc"
        }

        def queryStr = ""

        query.each {
            key, value ->

            queryStr += "&$key=$value"
        }

        return (params.url + queryStr).toURL()
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
