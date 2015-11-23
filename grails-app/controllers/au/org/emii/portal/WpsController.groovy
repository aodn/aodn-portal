package au.org.emii.portal
import au.org.emii.portal.proxying.RequestProxyingController

import org.joda.time.DateTime

import static au.org.emii.portal.HttpUtils.Status.*

class WpsController extends RequestProxyingController {

    def wpsService

    // Users get WPS status here -> HTML
    def jobReport = {
        params.url = wpsService._getExecutionStatusUrl(params)

        def execResponse = _performProxyingIfAllowed()
        if (execResponse != null) {
            if (_error(execResponse)) {
                _renderExecutionFailed(execResponse)
            }
            else {
                params.status = "Preparing download"
                _renderExecutionStatus(execResponse)
            }
        }
    }

    // the WPS geoserver plugin callback -> email
    def jobComplete = {

        params.url = wpsService._getExecutionStatusUrl(params)
        def execResponse = _performProxyingIfAllowed()
        if (execResponse != null) {
            if (_error(execResponse)) {
                 wpsService._notifyErrorViaEmail(params)
            }
            else {
                 wpsService._notifyDownloadViaEmail(params)
            }
        }
        render status: HTTP_200_OK

    }

    def _error = {
        it.'**'.find{node -> node.name() == 'Exception'}
    }
    
    def _performProxying = { paramProcessor = null, streamProcessor = null, fieldName = null, url = null ->
        try {
            return wpsService._getExecutionStatusResponse(url.toURL())
        }
        catch (Exception e) {
            log.error('Error getting execution status from WPS server', e)
            _renderError()
        }
    }

    def _renderExecutionStatus(execResponse) {

        if (_downloadReady(execResponse)) {
            params.status = "Download ready"
        }

        render(
            view: 'show',
            model: [
                job: [
                    uuid: params.uuid,
                    reportUrl: g.createLink(action: 'jobReport', absolute: true, params: params),
                    createdTimestamp: new DateTime(String.valueOf(execResponse.Status.@creationTime)),
                    status: params.status,
                    downloadTitle: "IMOS download - ${params.uuid}",
                    downloadUrl: _getProxiedDownloadUrl(_getDownloadUrl(execResponse))
                ]
            ]
        )
    }

    def _downloadReady = {
        _getDownloadUrl(it)
    }

    def _getDownloadUrl = {
        it.'**'.find{node -> node.name() == 'Reference'}?.@href
    }

    def _renderExecutionFailed(execResponse) {
        render(
            view: 'show',
            model: [
                job: [
                    uuid: params.uuid,
                    status: "ProcessFailed",
                    downloadTitle: "IMOS download ERROR - ${params.uuid}",
                    errorMessageCode: "message"
                ]
            ]
        )
    }

    def _getProxiedDownloadUrl(downloadUrl) {
        if (String.valueOf(downloadUrl)) {
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
}
