package au.org.emii.portal


import groovyx.net.http.HTTPBuilder
import groovyx.net.http.HttpResponseException

import static groovyx.net.http.ContentType.JSON
import static groovyx.net.http.Method.POST

class JsonService extends AsyncDownloadService {

    def groovyPageRenderer
    def grailsApplication

    String registerJob(params) throws HttpResponseException {
        getConnection(params).request(POST) { req ->
            body = getBody(params)
            response.success = onResponseSuccess
        }
    }

    def getConnection(params) {
        def conn = new HTTPBuilder(params.server)
        conn.contentType = JSON
        return conn
    }

    def getBody(params) {
        log.info("POST params: ${params.body.toString()}")
        return new groovy.json.JsonSlurper().parseText(params.body)

    }

    def onResponseSuccess = { resp ->
        assert resp.statusLine.statusCode == 200
        return "statusCode was ok"
    }

}
