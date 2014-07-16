/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal.proxying

import org.slf4j.Logger
import org.slf4j.LoggerFactory

import static au.org.emii.portal.HttpUtils.buildAttachmentHeaderValueWithFilename
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

    def proxy(streamProcessor) {

        log.debug "ProxiedRequest.proxy() params: $params"

        _determineResponseContentType()

        executeRequest(streamProcessor)
    }

    def _determineResponseContentType = {

        response.contentType = params.format ?: request.contentType
    }

    static def _getTargetUrl(params) {

        def url = params.remove('url')
        def query = params.findAll { key, value ->

            key != "controller" &&
            key != "action" &&
            key != "format" &&
            key != "_dc"
        }

        return urlWithQueryString(url, query).toURL()
    }
}
