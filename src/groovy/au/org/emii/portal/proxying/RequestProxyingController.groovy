/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal.proxying

import javax.servlet.http.Cookie

import static au.org.emii.portal.HttpUtils.Status.*
import static au.org.emii.portal.HttpUtils.buildAttachmentHeaderValueWithFilename

abstract class RequestProxyingController {

    def hostVerifier

    def index = {

        _performProxyingIfAllowed()
    }

    def _performProxyingIfAllowed = { paramProcessor = null, streamProcessor = null ->

        log.debug "proxying url: ${params.url}"

        def url = params.url

        if (!url) {
            render text: "No URL supplied", contentType: "text/html", encoding: "UTF-8", status: HTTP_400_BAD_REQUEST
        }
        else if (!hostVerifier.allowedHost(url)) {
            log.info "Proxy: The url $url was not allowed"
            render text: "Host for address '$url' not allowed", contentType: "text/html", encoding: "UTF-8", status: HTTP_403_FORBIDDEN
        }
        else {
            _performProxying(paramProcessor, streamProcessor)
        }
    }

    def _performProxying = { paramProcessor = null, streamProcessor = null ->
        _addDownloadTokenCookie()
        _setDownloadFilename(response, params)
        _makeRequest(request, response, params, paramProcessor, streamProcessor)
    }

    def _addDownloadTokenCookie = {
        if (params.downloadToken) {
            response.addCookie(_newDownloadTokenCookie(params.downloadToken))
        }
    }

    def _newDownloadTokenCookie = { downloadToken ->
        new Cookie("downloadToken${downloadToken}", downloadToken)
    }

    def _makeRequest = { request, response, params, paramProcessor, streamProcessor ->
        def processedParams = paramProcessor ? paramProcessor(params) : params
        def proxiedRequest = new ProxiedRequest(request, response, processedParams)
        proxiedRequest.proxy(streamProcessor)
    }

    def _setDownloadFilename(response, params) {

        def downloadFilename = params.remove('downloadFilename')
        if (downloadFilename) {
            log.debug "Download filename is '${downloadFilename}'. Forcing download."
            response.setHeader("Content-disposition", buildAttachmentHeaderValueWithFilename(downloadFilename))
        }
    }
}
