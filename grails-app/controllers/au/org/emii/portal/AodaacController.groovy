/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

class AodaacController {

    def aodaacAggregatorService
    def downloadAuthService

    def createJob = {

        // Verify request can go through
        def challengeResponse = params.challengeResponse
        def ipAddress         = request.getRemoteAddr()
        if (! downloadAuthService.verifyChallengeResponse(ipAddress, challengeResponse)) {
            log.info "Could not verify challenge '$challengeResponse' from '$ipAddress'"
            render text: 'Could not verify challenge (captcha), denying download', status: 500
            return
        }

        params.remove('challengeResponse')

        def job = aodaacAggregatorService.createJob(params)

        render text: "Job created (ID: ${job.jobId})"

        // Add accounting for that IP address
        downloadAuthService.registerDownloadForAddress(ipAddress, "aodaacController (ID: ${job.jobId})")
    }
}
