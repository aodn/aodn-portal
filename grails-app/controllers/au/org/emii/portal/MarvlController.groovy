package au.org.emii.portal

class MarvlController extends DownloadController {

    def urlListForFeatureRequest = {

        if (!params.propertyName) {
            render text: "No propertyName provided", status: 400
            return
        }

        def propertyName = params.propertyName
        def substitutions = grailsApplication.config.marvl.urlList.substitutions

        _performProxying(
            requestSingleFieldParamProcessor(propertyName),
            urlListStreamProcessor(propertyName, substitutions)
        )
    }
}
