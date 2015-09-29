package au.org.emii.portal

import grails.gsp.PageRenderer
import groovyx.net.http.*
import org.codehaus.groovy.grails.web.mapping.LinkGenerator

import static groovyx.net.http.Method.POST
import static groovyx.net.http.ContentType.XML

class WpsService extends AsyncDownloadService {

    def groovyPageRenderer
    LinkGenerator grailsLinkGenerator

    String registerJob(params) throws HttpResponseException {
        def registerResponse = super.registerJob(params)
        params.uuid = _getUuidFromRegisterResponse(registerResponse)
        _notifyRegistrationViaEmail(params)

        return registerResponse
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
        return new groovy.xml.StreamingMarkupBuilder().bindNode(xmlReader).toString()
    }

    def notifyViaEmail(params) {
        params.jobReportUrl = grailsLinkGenerator.link(
            controller: 'wps',
            action: 'jobReport',
            params: [ server: params.server, uuid: params.uuid ],
            absolute: true
        )

        sendMail {
            async true
            to params.email.to
            subject params.email.subject
            body(
                view: "/wps/${params.email.template}",
                model: params
            )
        }
    }

    def _notifyRegistrationViaEmail(params) {
        params.email.subject = "IMOS download request registered - ${params.uuid}"
        params.email.template = 'jobRegistered'
        notifyViaEmail(params)
    }

    def _getUuidFromRegisterResponse(registerResponse) {
        // It'd be nice if the response from geoserver had the job UUID in a separate attribute, but alas, it's not,
        // so we must resort to a regex for now.
        def statusLocation = new XmlSlurper().parseText(registerResponse).@statusLocation
        return (statusLocation =~ "[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}")[0]
    }
}
