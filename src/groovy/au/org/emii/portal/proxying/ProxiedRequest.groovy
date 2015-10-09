package au.org.emii.portal.proxying

import org.apache.catalina.connector.ClientAbortException
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

    def proxy(streamProcessor) {

        log.debug "ProxiedRequest.proxy() params: $params"

        _determineResponseContentType()

        try {
            executeRequest(streamProcessor)
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

    def _determineResponseContentType = {

        response.contentType = params.remove('format') ?: request.contentType
    }

    static def _getTargetUrl(params) {

        def url = params.remove('url')
        def query = params.findAll { key, value ->

            key != "controller" &&
            key != "action" &&
            key != "_dc"
        }

        return urlWithQueryString(url, query).toURL()
    }
}
