package au.org.emii.portal

import grails.converters.JSON
import groovy.xml.StreamingMarkupBuilder
import groovyx.net.http.HTTPBuilder
import groovyx.net.http.HttpResponseException

import static groovyx.net.http.ContentType.XML
import static groovyx.net.http.Method.POST

class WpsAwsService extends AsyncDownloadService {

    def groovyPageRenderer
    def grailsApplication

    String registerJob(params) throws HttpResponseException {

        def response = getConnection(params).request(POST) {req ->
            body = getBody(params)
            response.success = onResponseSuccess
        }
        return [url: _getExecutionStatusUrl(response) ] as JSON
    }

    def getConnection(params) {
        def conn = new HTTPBuilder(params.server)
        conn.contentType = XML

        return conn
    }

    def getBody(params) {
        // grails puts all permutations of dotted parameters in here, we only want one lot.
        params.jobParameters = params.jobParameters.findAll { it.value instanceof String }

        def body = groovyPageRenderer.render(template: '/wps/asyncRequest.xml', model: params)
        log.debug("Request body:\n\n${body}")

        return body
    }

    def onResponseSuccess = { resp, xmlReader ->
        return new StreamingMarkupBuilder().bindNode(xmlReader).toString()
    }

    def _getExecutionStatusUrl(registerResponse) {
        def xmlLink =  new XmlSlurper().parseText(registerResponse).@statusLocation[0].toString()

        return xmlLink.replace(/format=xml/,"format=html")
    }
}