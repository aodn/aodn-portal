/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.converters.JSON

class AodaacController {

    def aodaacAggregatorService

    def index = {

        [:]
    }

    def testCreateJob = {

        aodaacAggregatorService.createJob(
            'dnahodil@utas.edu.au',
            [:]
        )

        redirect action: 'index'
    }

    def updateJob = {

        AodaacJob.list().each {
            aodaacAggregatorService.updateJob(it)
        }

        redirect action: 'index'
    }

    def test = {

        render aodaacAggregatorService.getProductInfo([34]) as JSON
    }

    def createJob = {

        def job = aodaacAggregatorService.createJob(params.notificationEmailAddress, params)

        render text: "Job created (ID: ${ job?.jobId })"
    }
}
