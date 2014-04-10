/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

class GogoduckController {

    def gogoduckService

    def registerJob = {

        log.debug "Registering GoGoDuck job. Params: $params"

        if (!params.jobParameters) {
            render text: 'GoGoDuck job could not be registered. Job parameters were missing.', status: 400
            return
        }

        try {
            gogoduckService.registerJob(params.jobParameters)

            log.debug "GoGoDuck job registered"

            render 'GoGoDuck job registered'
        }
        catch (Exception e) {

            log.error "Problem registering new GoGoDuck job with parameters: ${params.jobParameters}", e

            render text: 'GoGoDuck job could not be registered', status: 500
        }
    }
}
