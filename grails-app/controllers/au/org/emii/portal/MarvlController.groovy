package au.org.emii.portal

import static au.org.emii.portal.HttpUtils.Status.*

class MarvlController extends DownloadController {

    def urlListForFeatureRequest = {

        if (!params.propertyName) {
            render text: "No propertyName provided", status: HTTP_400_BAD_REQUEST
            return
        }

        def propertyName = params.propertyName
        def substitutions = grailsApplication.config.marvl.urlList.substitutions

        _performProxyingIfAllowed(
            requestSingleFieldParamProcessor(propertyName),
            urlListStreamProcessor(propertyName, substitutions)
        )
    }
}
