/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

class GogoduckController {

    def gogoduckService
    def downloadAuthService

    def registerJob = {

        // Verify request can go through
        def challengeResponse = params.challengeResponse
        def ipAddress         = request.getRemoteAddr()
        if (! downloadAuthService.verifyChallengeResponse(ipAddress, challengeResponse)) {
            log.info "Could not verify challenge '$challengeResponse' from '$ipAddress'"
            render text: 'Could not verify challenge (captcha), denying download', status: 500
            return
        }

        log.debug "Registering GoGoDuck job. Params: $params"

        if (!params.jobParameters) {
            render text: 'GoGoDuck job could not be registered. Job parameters were missing.', status: 400
            return
        }

        try {
            gogoduckService.registerJob(params.jobParameters)

            log.debug "GoGoDuck job registered"

            render 'GoGoDuck job registered'

            // Add accounting for that IP address
            downloadAuthService.registerDownloadForAddress(ipAddress, "gogoduckController")
        }
        catch (Exception e) {

            log.error "Problem registering new GoGoDuck job with parameters: ${params.jobParameters}", e

            render text: 'GoGoDuck job could not be registered', status: 500
        }
    }
}
