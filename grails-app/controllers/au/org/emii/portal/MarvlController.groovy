package au.org.emii.portal

import static au.org.emii.portal.HttpUtils.Status.*

class MarvlController extends DownloadController {

    def urlListForFeatureRequest = {

        if (!params.propertyName) {
            render text: "No propertyName provided", status: HTTP_400_BAD_REQUEST
            return
        }

        def propertyName = params.propertyName
        def prefixToRemove = grailsApplication.config.marvl.urlList.prefixToRemove
        def newUrlBase = grailsApplication.config.marvl.urlList.newUrlBase

        _performProxying(
            requestSingleFieldParamProcessor(propertyName),
            urlListStreamProcessor(propertyName, prefixToRemove, newUrlBase)
        )
    }
}
