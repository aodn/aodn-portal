package au.org.emii.portal

import au.org.emii.portal.proxying.ExternalRequest
import au.org.emii.portal.proxying.RequestProxyingController

import org.joda.time.DateTime

class WpsController extends RequestProxyingController {

    def wpsService

    def jobReport = {
        params.url = _getExecutionStatusUrl(params)
        _performProxyingIfAllowed()
    }

    def jobComplete = {
        params.email.subject = "IMOS subsetting complete - ${params.uuid}"
        params.email.template = 'jobComplete'
        wpsService.notifyViaEmail(params)

        render status: 200
    }

    def _performProxying = { paramProcessor = null, streamProcessor = null, fieldName = null, url = null ->
        try {
            def execResponse = _getExecutionStatusResponse(url.toURL())
            _renderExecutionStatus(execResponse)
        }
        catch (Exception e) {
            log.error('Error getting execution status from WPS server', e)
            _renderError()
        }
    }

    def _renderExecutionStatus(execResponse) {
        render(
            view: 'show',
            model: [
                job: [
                    uuid: params.uuid,
                    reportUrl: g.createLink(action: 'jobReport', absolute: true, params: params),
                    createdTimestamp: new DateTime(String.valueOf(execResponse.Status.@creationTime)),
                    status: execResponse.Status.children()?.first().name(),
                    downloadTitle: execResponse.ProcessOutputs.Output.Title.text(),
                    downloadUrl: _getProxiedDownloadUrl(execResponse.ProcessOutputs.Output.Reference.@href)
                ]
            ]
        )
    }

    def _getProxiedDownloadUrl(downloadUrl) {
        if (downloadUrl) {
            return g.createLink(
                controller: 'proxy',
                absolute: true,
                params: [ url: downloadUrl ]
            )
        }

        return null
    }

    def _renderError() {
        render(
            view: 'show',
            model: [
                job: [
                    uuid: params.uuid,
                    status: 'ProcessUnknown'
                ]
            ]
        )
    }

    def _getExecutionStatusResponse(url) {
        def responseStream = new ByteArrayOutputStream()

        def request = new ExternalRequest(responseStream, url)
        request.executeRequest()

        return new XmlSlurper().parseText(new String(responseStream.toByteArray(), 'UTF-8'))
    }

    def _getExecutionStatusUrl(params) {
        return "${params.server}?service=WPS&version=1.0.0&request=GetExecutionStatus&executionId=${params.uuid}"
    }
}
