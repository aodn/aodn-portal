package au.org.emii.portal

import static au.org.emii.portal.HttpUtils.Status.*

class AsyncDownloadController {

    def gogoduckService
    def wpsService
    def wpsAwsService
    def downloadAuthService

    AsyncDownloadService getAggregatorService(aggregatorService, params) {
        switch (aggregatorService) {
            case 'gogoduck':
                return gogoduckService
            case 'wps':
                if (!(params.server.contains("geoserver"))) {
                    return wpsAwsService
                }
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

        def aggregatorServiceString = params.remove('aggregatorService')

        try {
            def ipAddress = request.getRemoteAddr()

            verifyChallengeResponse(params, ipAddress)

            AsyncDownloadService aggregatorService = getAggregatorService(aggregatorServiceString, params)

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
