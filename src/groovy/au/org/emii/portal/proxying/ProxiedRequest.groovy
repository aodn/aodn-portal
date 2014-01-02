/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal.proxying

import org.slf4j.Logger
import org.slf4j.LoggerFactory

class ProxiedRequest extends ExternalRequest {

    static final Logger log = LoggerFactory.getLogger(ProxiedRequest.class)

    def request
    def response

    ProxiedRequest(request, response, params) {

        super(response.outputStream, params)

        this.request = request
        this.response = response
    }

    @Override
    def proxy(Object streamProcessor) {

        log.debug "ProxiedRequest.proxy() params: $params"

        response.contentType = params.format ?: request.contentType

        // Force download if filename provided
        if (params.downloadFilename) {
            log.debug "downloadFilename is '${params.downloadFilename}'. Forcing download."
            response.setHeader "Content-disposition", "attachment; filename=${params.downloadFilename}"
        }

        super.proxy(streamProcessor)
    }
}
