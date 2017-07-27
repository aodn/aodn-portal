package au.org.emii.portal

import static au.org.emii.portal.HttpUtils.Status.*

class AsyncDownloadController {

    def gogoduckService
    def netcdfSubsetDownloadCalculatorService
    def wpsService
    def downloadAuthService

    AsyncDownloadService getAggregatorService(aggregatorService) {
        switch (aggregatorService) {
            case 'calculator':
                return netcdfSubsetDownloadCalculatorService
            case 'gogoduck':
                return gogoduckService
            case 'wps':
                return wpsService
            default:
                throw new Exception("Cannot find aggregatorService for '$aggregatorService'")
        }
    }

    def verifyChallengeResponse(params, ipAddress) {
        // Verify request can go through
        def challengeResponse = params.remove('challengeResponse')
        if (! downloadAuthService.verifyChallengeResponse(ipAddress, challengeResponse)) {
            log.info "Could not verify challenge '$challengeResponse' from '$ipAddress'"
            throw new Exception('Could not verify challenge (captcha), denying download')
        }
    }

    def index = {

        if (params.aggregatorService == 'calculator') {
            def aggregatorServiceString = params.remove('aggregatorService')
            AsyncDownloadService aggregatorService = getAggregatorService(aggregatorServiceString)

            // todo fix this
            render aggregatorService.stub(params)

        }
        else {
            doDownload(params)
        }
    }

    def doDownload(params) {
        def aggregatorServiceString = params.remove('aggregatorService')

        def ipAddress = request.getRemoteAddr()

        try {
            verifyChallengeResponse(params, ipAddress)
        }
        catch (Exception e) {
            log.error "user captcha error", e
            render text: "The Captcha passphrase is required and must match. Please try again", status: HTTP_401_UNAUTHORISED
            return
        }

        try {
            AsyncDownloadService aggregatorService = getAggregatorService(aggregatorServiceString)

            def renderText = aggregatorService.registerJob(params)

            // Add accounting for that IP address
            downloadAuthService.registerDownloadForAddress(ipAddress, aggregatorServiceString)

            render renderText
        }
        catch (Exception e) {
            log.error "Problem registering new aggregator job with type '$aggregatorServiceString' and parameters: '$params'", e
            render text: "Problem registering new aggregator job", status: HTTP_500_INTERNAL_SERVER_ERROR
        }
    }
}
