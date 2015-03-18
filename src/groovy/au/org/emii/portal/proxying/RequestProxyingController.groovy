/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal.proxying

import static au.org.emii.portal.HttpUtils.buildAttachmentHeaderValueWithFilename

abstract class RequestProxyingController {

    def hostVerifier

    def index = {

        _performProxying()
    }

    def _performProxying = { paramProcessor = null, streamProcessor = null ->

        log.debug "proxying url: ${params.url}"

        def url = params.url

        if (!url) {
            render text: "No URL supplied", contentType: "text/html", encoding: "UTF-8", status: 400
        }
        else if (!hostVerifier.allowedHost(url)) {
            log.info "Proxy: The url $url was not allowed"
            render text: "Host for address '$url' not allowed", contentType: "text/html", encoding: "UTF-8", status: 400
        }
        else {
            def processedParams = paramProcessor ? paramProcessor(params) : params

            // Use download filename if provided
            _setDownloadFilename(response, params)

            // Make request
            def proxiedRequest = new ProxiedRequest(request, response, processedParams)
            proxiedRequest.proxy(streamProcessor)
        }
    }

    def _setDownloadFilename(response, params) {

        def downloadFilename = params.remove('downloadFilename')
        if (downloadFilename) {
            log.debug "Download filename is '${downloadFilename}'. Forcing download."
            response.setHeader("Content-disposition", buildAttachmentHeaderValueWithFilename(downloadFilename))
        }
    }
}
