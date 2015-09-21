package au.org.emii.portal

import grails.gsp.PageRenderer
import groovyx.net.http.*

import static groovyx.net.http.Method.POST
import static groovyx.net.http.ContentType.XML

class WpsService extends AsyncDownloadService {

    def groovyPageRenderer

    def getConnection(params) {
        def conn = new HTTPBuilder(params.server)
        conn.contentType = XML

        return conn
    }

    def getBody(params) {
        def body = groovyPageRenderer.render(template: '/wps/asyncRequest.xml', model: params)
        log.debug("Request body: ${body}")

        return body
    }

    def onResponseSuccess = { resp, xmlReader ->
        return new groovy.xml.StreamingMarkupBuilder().bindNode(xmlReader).toString()
    }
}
