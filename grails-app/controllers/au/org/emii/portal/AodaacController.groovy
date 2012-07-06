package au.org.emii.portal

import grails.converters.JSON

class AodaacController {

    def aodaacAggregatorService

    def testParams() { // Todo - DN: To be removed once a good testing setup is available

        [
            dateRangeStart: "01/01/2011",
            dateRangeEnd: "14/01/2011",
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

    def index = { // Todo - DN: To be removed once a good testing setup is available

        [ testParams: testParams() ]
    }

    def productInfo = {

        def productIds = []

        if ( params.productIds ) {

            productIds = params.productIds.tokenize( "," )
        }
        else if ( params.layerId ) {

            log.debug "ProductIds being retrieved with params.layerId: '$params.layerId'"

            def layer = Layer.get( params.layerId )

            def aodaacProductLinks = AodaacProductLink.findAllByLayerNameIlikeAndServer( layer.name, layer.server )

            productIds = aodaacProductLinks.collect{ it.productId }.unique()

            if ( !productIds ) { // If no product Ids for layer then return empty array

                render ([] as JSON)
                return
            }
        }

        try {
            render aodaacAggregatorService.getProductInfo( productIds ) as JSON
        }
        catch( Exception e ) {

            log.debug "Unable to get product info for productIds: $productIds", e

            render text: "Unable to get complete product info for productIds: $productIds", status: 500
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

        def jobs = _getJobList()

        jobs.each { aodaacAggregatorService.updateJob it }

        render jobs as JSON
    }

    def _byId( jobId ) {

        return AodaacJob.findByJobId( jobId )
    }

    def _getJobList() {

        if ( !session.aodaacJobList ) { session.aodaacJobList = [] as Set }

        return session.aodaacJobList.collect{ AodaacJob.get( it ) }
    }

    void _addToList( item ) {

        def list = _getJobList()

        list << item.id
    }

    void _removeFromList( item ) {

        def list = _getJobList()

        list.remove item.id
    }
}
