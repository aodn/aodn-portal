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
            outputFormat: "nc",
            notificationEmailAddress: "dnahodil@gmail.com"
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
        }

        if ( productIds ) {

            render aodaacAggregatorService.getProductInfo( productIds ) as JSON
        }
        else {

            render ([] as JSON)
        }
    }

    def testCreateJob = {

        forward action: "createJob", params: testParams()
    }

    def createJob = {

        def job = aodaacAggregatorService.createJob( params.notificationEmailAddress, params )

        _addToList job

        render text: "Job created (ID: ${ job?.jobId })"
    }

    def updateJob = {

        def job = _byId( params.id )

        aodaacAggregatorService.updateJob job

        render text: "Job updated (ID: ${ job.jobId })"
    }

    def cancelJob = {

        def job = _byId( params.id )

        aodaacAggregatorService.cancelJob job

        _removeFromList job

        render text: "Job cancelled (ID: ${ job.jobId })"
    }

    def deleteJob = {

        def job = _byId( params.id )

        // Store jobId to notify the User
        def jobId = job.jobId

        _removeFromList job

        aodaacAggregatorService.deleteJob job

        render text: "Job deleted (ID: $jobId)"
    }

    def userJobInfo = {

        def jobIds = _getJobIdList()

        def jobs = jobIds.size() ? AodaacJob.getAll( jobIds ) : []

        render jobs as JSON
    }

    def _byId( jobId ) {

        return AodaacJob.findByJobId( jobId )
    }

    def _getJobIdList() {

        if ( !session.aodaacJobIdList ) { session.aodaacJobIdList = [] }

        return session.aodaacJobIdList
    }

    void _addToList( item ) {

        _getJobIdList().add item.jobId
    }

    void _removeFromList( item ) {

        _getJobIdList().remove item.jobId as Object
    }
}
