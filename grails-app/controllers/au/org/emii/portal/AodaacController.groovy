/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

class AodaacController {

    def aodaacAggregatorService

    def createJob = {

        def job = aodaacAggregatorService.createJob(params.notificationEmailAddress, params)

        render text: "Job created (ID: ${job.jobId})"
    }
}
