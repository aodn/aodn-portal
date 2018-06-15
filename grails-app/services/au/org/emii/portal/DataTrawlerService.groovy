package au.org.emii.portal

import groovy.xml.StreamingMarkupBuilder
import groovyx.net.http.HTTPBuilder
import static groovyx.net.http.ContentType.URLENC

class DataTrawlerService extends AsyncDownloadService {

    def grailsApplication

    def getConnection(params) {
        log.info("POST server: ${params.server.toString()}")
        return new HTTPBuilder(params.server, URLENC)
    }

    def getBody(params) {
        log.info("POST params: ${params.request.toString()}")
        return params.request.toString()
    }

    def onResponseSuccess = { resp, xmlReader ->
        log.info("POST response status: ${resp.statusLine}")
        return new StreamingMarkupBuilder().bindNode(xmlReader).toString()
    }
}
