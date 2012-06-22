package au.org.emii.portal

import grails.converters.JSON

class AodaacController {

    def aodaacAggregatorService

    def testParams() {

        [
            dateRangeStart: new GregorianCalendar(2011, java.util.Calendar.JANUARY, 14).time,
            dateRangeEnd: new GregorianCalendar(2011, java.util.Calendar.JANUARY, 21).time,
            timeOfDayRangeStart: "0000",
            timeOfDayRangeEnd: "2400",
            latitudeRangeStart:  -30.681,
            latitudeRangeEnd:    -24.452,
            longitudeRangeStart: 148.383,
            longitudeRangeEnd:   159.281,
            productId: 1,
            outputFormat: "nc"
        ]
    }

    def index = {

        [ testParams: testParams() ]
    }

    def productInfo = {

        Thread.sleep 1000 // Todo - DN: Remove after testing

        def productId = params.id

        if ( !productId ) {

            render text: "productId must be specified", status: 500
            return
        }

        try {
            render aodaacAggregatorService.getProductInfo( productId ) as JSON
        }
        catch( Exception e ) {

            log.debug "Unable to get product info for productId: '$productId'", e

            render text: "Unable to get complete product info for productId: '$productId'", status: 500
        }
    }

    def testCreateJob = {

        forward action: "createJob", params: testParams()
    }

    def createJob = {

        try {
            def job = aodaacAggregatorService.createJob( params.notificationEmailAddress, params )

            _addToList job

            render text: "Job created (ID: ${ job?.jobId })"
        }
        catch (Exception e) {

            log.info "Unable to create job with params ($params)", e

            render text: "Unable to create job", status: 500
        }
    }

    def updateJob = {

        try {
            def job = _byId( params.id )

            aodaacAggregatorService.updateJob job

            render text: "Job updated (ID: ${ job.jobId })"
        }
        catch (Exception e) {

            log.info "Unable to update job with params ($params)", e

            render text: "Unable to update job", status: 500
        }
    }

    def cancelJob = {

        try {
            def job = _byId( params.id )

            aodaacAggregatorService.cancelJob job

            _removeFromList job

            render text: "Job cancelled (ID: ${ job.jobId })"
        }
        catch (Exception e) {

            log.info "Unable to cancel job with params ($params)", e

            render text: "Unable to cancel job", status: 500
        }
    }

    def deleteJob = {

        try {
            def job = _byId( params.id )

            // Store jobId to notify the User
            def jobId = job.jobId

            _removeFromList job

            job?.delete()

            render text: "Deleted job (ID: $jobId)"
        }
        catch (Exception e) {

            log.info "Unable to delete job with params ($params)", e

            render text: "Unable to delete job", status: 500
        }
    }

    def userJobInfo = {

        Thread.sleep 1500

        def jobs = _getJobList()

        jobs.each {

            aodaacAggregatorService.updateJob it // Could this be made async?
        }

        render jobs as JSON
    }

    def _byId( jobId ) {

        return AodaacJob.findByJobId( jobId )
    }

    def _getJobList() {

        if ( !session.aodaacJobList ) { session.aodaacJobList = [] as Set }

        return session.aodaacJobList.collect{ AodaacJob.findByJobId( it ) }
    }

    void _addToList( item ) {

        def list = _getJobList()

        list << item.jobId
    }

    void _removeFromList( item ) {

        def list = _getJobList()

        list.remove item.jobId
    }
}
