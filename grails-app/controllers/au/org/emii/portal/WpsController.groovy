package au.org.emii.portal

import au.org.emii.portal.proxying.ExternalRequest
import au.org.emii.portal.proxying.RequestProxyingController

import org.joda.time.DateTime

class WpsController extends RequestProxyingController {
    def jobReport = {
        params.url = _getExecutionStatusUrl(params)
        _performProxyingIfAllowed()
    }

    def _performProxying = { paramProcessor = null, streamProcessor = null, fieldName = null, url = null ->
        def execResponse = _getExecutionStatusResponse(url.toURL())
        _renderExecutionStatus(execResponse)
    }

    def _renderExecutionStatus(execResponse) {
        render(
            view: 'show',
            model: [
                job: [
                    uuid: params.uuid,
                    createdTimestamp: new DateTime(String.valueOf(execResponse.Status.@creationTime)),
                    status: execResponse.Status.ProcessSucceeded.text(),
                    downloadTitle: execResponse.ProcessOutputs.Output.Title.text(),
                    downloadUrl: String.valueOf(execResponse.ProcessOutputs.Output.Reference.@href)
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
