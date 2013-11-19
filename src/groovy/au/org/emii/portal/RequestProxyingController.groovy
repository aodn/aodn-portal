/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

abstract class RequestProxyingController {

    def index = {

        _performProxying()
    }

    def _performProxying = { paramProcessor = null, streamProcessor = null ->

        if (!params.url) {
            render text: "No URL supplied", contentType: "text/html", encoding: "UTF-8", status: 400
        }
        else if (!hostVerifier.allowedHost(request, params.url)) {
            log.info "Proxy: The url ${params.url} was not allowed"
            render text: "Host for address '${params.url}' not allowed", contentType: "text/html", encoding: "UTF-8", status: 400
        }
        else {

            def processedParams = paramProcessor ? paramProcessor(params) : params

            // Make request
            def proxiedRequest = new ProxiedRequest(request, response, processedParams)
            proxiedRequest.proxy(streamProcessor)
        }
    }
}
