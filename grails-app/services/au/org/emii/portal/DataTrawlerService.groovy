package au.org.emii.portal

import au.org.emii.portal.proxying.ExternalRequest
import grails.converters.JSON
import groovyx.net.http.HttpResponseException

class DataTrawlerService extends AsyncDownloadService {

    def grailsApplication

    def getConnection(params) {}
    def getBody(params) {}

    String registerJob(params) throws HttpResponseException {
        log.info("Registering DataTrawler job with request: " + params.server.toURL())
        def outputStream = new ByteArrayOutputStream()
        def request = new ExternalRequest(outputStream, params.server.toURL())
        request.executeRequest()

        return [ url: _getJobReportUrl() ] as JSON
    }

    def _getJobReportUrl() {
        // TODO: replace placeholder with status url
        return grailsApplication.config.csiro.url
    }
}
