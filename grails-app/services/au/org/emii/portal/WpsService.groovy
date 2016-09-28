package au.org.emii.portal
import au.org.emii.portal.proxying.ExternalRequest
import grails.converters.JSON
import groovy.xml.StreamingMarkupBuilder
import groovyx.net.http.HTTPBuilder
import groovyx.net.http.HttpResponseException
import org.codehaus.groovy.grails.web.mapping.LinkGenerator
import org.ocpsoft.prettytime.PrettyTime

import static groovyx.net.http.ContentType.XML

class WpsService extends AsyncDownloadService {

    def groovyPageRenderer
    def grailsApplication
    def mailService
    LinkGenerator grailsLinkGenerator

    String registerJob(params) throws HttpResponseException {
        def registerResponse = super.registerJob(params)
        params.uuid = _getUuidFromRegisterResponse(registerResponse)
        _notifyRegistrationViaEmail(params)

        return [ url: _getJobReportUrl(params) ] as JSON
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

    def notifyViaEmail(params) {

        params.expirationPeriod = _getExpirationPeriod()
        params.jobReportUrl = _getJobReportUrl(params)
        params.portalConfig = grailsApplication.config.portal
        params.email.bcc = grailsApplication.config.grails.mail.default.bcc

        if (grailsApplication.config.grails.mail.disabled != true) {
            if (params.email.template == 'jobFailed') {
                mailService.sendMail {
                    async true
                    to params.email.to
                    bcc params.email.bcc
                    subject params.email.subject
                    body(
                        view: "/wps/${params.email.template}",
                        model: params
                    )
                }
            } else {
                mailService.sendMail {
                    async true
                    to params.email.to
                    subject params.email.subject
                    body(
                        view: "/wps/${params.email.template}",
                        model: params
                    )
                }
            }
        }
        else {
            log.info(
                groovyPageRenderer.render (
                    view: "/wps/${params.email.template}",
                    model: params
                )
            )
        }
    }

    def _getJobReportUrl(params) {
        return grailsLinkGenerator.link(
            controller: 'wps',
            action: 'jobReport',
            params: [server: params.server, uuid: params.uuid],
            absolute: true
        )
    }

    def _getExpirationPeriod() {

        def res = "for a limited time"

        if (grailsApplication.config.isSet("wpsResourceExpirationTimeout")) {
            def p = new PrettyTime(new Date());
            def duration = p.format(
                new Date(System.currentTimeMillis() + (grailsApplication.config.wpsResourceExpirationTimeout) * 1000 )
            )
            res = "until approximately " + duration
        }
        return res
    }

    def _notifyRegistrationViaEmail(params) {
        params.email.subject = "IMOS download request registered - ${params.uuid}"
        params.email.template = 'jobRegistered'
        notifyViaEmail(params)
    }

    def _notifyDownloadViaEmail(params) {
        params.email.subject = "IMOS download available - ${params.uuid}"
        params.email.template = 'jobComplete'
        notifyViaEmail(params)
    }

    def _notifyErrorViaEmail(params) {
        params.email.subject = "IMOS download ERROR - ${params.uuid}"
        params.email.template = 'jobFailed'
        notifyViaEmail(params)
    }

    def _getUuidFromRegisterResponse(registerResponse) {
        // It'd be nice if the response from geoserver had the job UUID in a separate attribute, but alas, it's not,
        // so we must resort to a regex for now.
        def statusLocation = new XmlSlurper().parseText(registerResponse).@statusLocation

        return (statusLocation =~ "[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}")[0]

    }

    def _getExecutionStatusUrl(params) {
        return "${params.server}?service=WPS&version=1.0.0&request=GetExecutionStatus&executionId=${params.uuid}"
    }

    def _getExecutionStatusResponse(url) {
        def responseStream = new ByteArrayOutputStream()

        def request = new ExternalRequest(responseStream, url)
        request.executeRequest()

        return new XmlSlurper().parseText(new String(responseStream.toByteArray(), 'UTF-8'))
    }
}
