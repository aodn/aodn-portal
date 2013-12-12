package au.org.emii.portal

class MarvlController extends DownloadController {

    def grailsApplication

    def urlListForFeatureRequest = {

        if (!params.propertyName) {
            render text: "No propertyName provided", status: 400
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
