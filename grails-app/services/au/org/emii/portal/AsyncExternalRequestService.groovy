package au.org.emii.portal

import au.org.emii.portal.proxying.ExternalRequest
import grails.converters.JSON
import groovyx.net.http.HttpResponseException

class AsyncExternalRequestService extends AsyncDownloadService {

    def getConnection(params) {}
    def getBody(params) {}

    String registerJob(params) throws HttpResponseException {

        def outputStream = new ByteArrayOutputStream()
        def request = new ExternalRequest(outputStream, params.server.toURL())
        request.executeRequest()

        String resString = outputStream.toString("utf-8")
        def slurper = new groovy.json.JsonSlurper()
        def result = slurper.parseText(resString)

        return [ url: result.statusUrl ] as JSON
    }
}
