package au.org.emii.portal.proxying

import org.apache.catalina.connector.ClientAbortException
import org.codehaus.groovy.grails.io.support.IOUtils
import org.slf4j.Logger
import org.slf4j.LoggerFactory

import static au.org.emii.portal.UrlUtils.urlWithQueryString

class ProxiedRequest extends ExternalRequest {

    static final Logger log = LoggerFactory.getLogger(this)

    def request
    def response
    def params

    ProxiedRequest(request, response, params, proxyRedirectService, grailsApplication) {

        super(response, _getTargetUrl(params, proxyRedirectService), grailsApplication)

        this.request = request
        this.response = response
        this.params = params
    }

    def proxy(streamProcessor) {

        log.debug "ProxiedRequest.proxy() params: $params"

        try {
            executeRequest(streamProcessor)
        }
        catch (IOException e) {
            throw e
        }
        catch (ClientAbortException e) {
            log.debug "ClientAbortException caught while proxying request. URL: $targetUrl", e
        }
        catch (Exception e) {
            // Nothing more can be done here, we just don't want the Exception to propagate
            // The outputStream might already have been written-to so it's in an unknown state

            log.warn "Failure while proxying request. URL: $targetUrl", e
        }
    }

    def getClientIpAddress = {

        log.info "X-Forwarded-For : ${request.getHeader("X-Forwarded-For")}"
        log.info "request.remoteAddr : ${request.remoteAddr}"

        //  Pass X-Forwarded-For header on if present
        def clientip = request.getHeader("X-Forwarded-For")

        if (!clientip) {
            clientip = request.remoteAddr
        }

        log.info "PORTAL Client IP Address : ${clientip}"
        return clientip
    }

    def onConnectionOpened = { conn ->
        if (!response.containsHeader("Content-disposition")) {
            def contentDisposition = conn.getHeaderField("Content-disposition")
            log.debug "Setting content disposition to '${contentDisposition}'"
            response.setHeader("Content-disposition", contentDisposition)
        }

        _determineResponseContentType(conn)
    }

    def _determineResponseContentType = { conn ->
        if (params.remove('proxyContentType')) {
            response.contentType = conn.contentType
        } else {
            response.contentType = params.remove('format') ?: request.contentType
        }
    }


    def executeRequest = { streamProcessor = null ->

        def processStream = streamProcessor ?: straightThrough

        log.debug "Opening connection to target URL: $targetUrl"

        URLConnection conn = targetUrl.openConnection()

        if (connectTimeout) {
            conn.setConnectTimeout(connectTimeout);
        }

        // Forward the originating client IP address
        if(getClientIpAddress) {
            log.info "Setting X-Forwarded-For HTTP header : ${getClientIpAddress}"
            conn.setRequestProperty("X-Forwarded-For", getClientIpAddress())
        }

        onConnectionOpened conn

        try {
            InputStream inputStream = conn.getInputStream()
        }
        catch (IOException e) {
            throw e
            return
        }

        try {
            if (response) {
                outputStream = response.outputStream
            }
            processStream conn.inputStream, outputStream
            outputStream.flush()
        }
        finally {
            IOUtils.closeQuietly(outputStream)
        }
    }

    static def _getTargetUrl(params, proxyRedirectService) {

        String url = params.remove('url')
        String newUrl = proxyRedirectService.getRedirectedUrl(url)

        // separate vars for easy debugging
        if(newUrl != url) {
            url = newUrl
        }

        def query = params.findAll { key, value ->

            key != "controller" &&
            key != "action" &&
            key != "_dc"
        }

        return urlWithQueryString(url, query).toURL()
    }
}
