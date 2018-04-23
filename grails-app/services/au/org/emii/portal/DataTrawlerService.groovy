package au.org.emii.portal

import groovy.xml.StreamingMarkupBuilder
import groovyx.net.http.HTTPBuilder
import groovyx.net.http.ContentType

class DataTrawlerService extends AsyncDownloadService {

    def grailsApplication

    def getConnection(params) {
        return new HTTPBuilder(params.server, ContentType.URLENC)
    }

    def getBody(params) {
        return params.request.toString()
    }

    def onResponseSuccess = { resp, xmlReader ->
        log.info("POST response status: ${resp.statusLine}")
        return new StreamingMarkupBuilder().bindNode(xmlReader).toString()
    }
}

