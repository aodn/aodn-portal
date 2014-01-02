/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal.proxying

import org.slf4j.Logger
import org.slf4j.LoggerFactory

import static au.org.emii.portal.UrlUtils.urlWithQueryString

class ProxiedRequest extends ExternalRequest {

    static final Logger log = LoggerFactory.getLogger(this)

    def request
    def response
    def params

    ProxiedRequest(request, response, params) {

        super(response.outputStream, _getTargetUrl(params))

        this.request = request
        this.response = response
        this.params = params
    }

    def proxy(Object streamProcessor) {

        log.debug "ProxiedRequest.proxy() params: $params"

        response.contentType = params.format ?: request.contentType

        // Force download if filename provided
        if (params.downloadFilename) {
            log.debug "downloadFilename is '${params.downloadFilename}'. Forcing download."
            response.setHeader "Content-disposition", "attachment; filename=${params.downloadFilename}"
        }

        executeRequest(streamProcessor)
    }

    static def _getTargetUrl(params) {

        def query = params.findAll { key, value ->

            key != "controller" &&
            key != "action" &&
            key != "url" &&
            key != "format" &&
            key != "_dc"
        }

        return urlWithQueryString(params.url, query).toURL()
    }
}
