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

        //  If an X-Forwarded-For param was passed - set it as a HTTP parameter
        if(params["X-Forwarded-For"] != null) {
            conn.headers["X-Forwarded-For"] = params["X-Forwarded-For"]
            log.info("X-Forwarded-For param set : " + params["X-Forwarded-For"])
        }

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
