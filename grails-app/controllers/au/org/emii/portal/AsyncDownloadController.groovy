package au.org.emii.portal

import au.org.emii.portal.proxying.HostVerifyingController

import static au.org.emii.portal.HttpUtils.Status.*

class AsyncDownloadController extends HostVerifyingController {

    def gogoduckService
    def jsonService
    def wpsService
    def asyncExternalRequestService
    def wpsAwsService
    def dataTrawlerService
    def downloadAuthService

    AsyncDownloadService getAggregatorService(aggregatorService, params) {
        switch (aggregatorService) {
            case 'gogoduck':
                return gogoduckService
            case 'json':
                return jsonService
            case 'wps':
                return (!(params.server.contains("geoserver"))) ? wpsAwsService : wpsService
            case 'ala':
                return asyncExternalRequestService
            case 'datatrawler':
                return dataTrawlerService
            default:
                throw new SilentStacktraceException("Cannot find aggregatorService for '$aggregatorService'")
        }
    }

    def verifyChallengeResponse(params, ipAddress) {
        // Verify request can go through
        def challengeResponse = params.remove('challengeResponse')
        if (! downloadAuthService.verifyChallengeResponse(ipAddress, challengeResponse)) {
            log.info "Could not verify challenge '$challengeResponse' from '$ipAddress'"
            throw new SilentStacktraceException('Could not verify challenge (captcha), denying download')
        }
    }

    def index = {
        ifAllowed(params.server) {
            def aggregatorServiceString = params.remove('aggregatorService')

            try {
                def ipAddress = request.getRemoteAddr()

                log.debug("AsyncDownloadController remoteAddr: " + ipAddress)
                verifyChallengeResponse(params, ipAddress)

                AsyncDownloadService aggregatorService = getAggregatorService(aggregatorServiceString, params)

                //  Pass client IP address to download controller
                params.put("X-Forwarded-For", ipAddress)

                def renderText = aggregatorService.registerJob(params)

                // Add accounting for that IP address
                downloadAuthService.registerDownloadForAddress(ipAddress, aggregatorServiceString)

                log.debug "New aggregator job '$params'"

                render renderText
            }
            catch (Exception e) {
                log.error "Problem registering new aggregator job with type '$aggregatorServiceString' and parameters: '$params'", e
                render text: "Problem registering new aggregator job", status: HTTP_500_INTERNAL_SERVER_ERROR
            }
        }
    }
}
