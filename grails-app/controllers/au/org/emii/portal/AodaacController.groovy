package au.org.emii.portal

import grails.converters.JSON

class AodaacController {

    def aodaacAggregatorService

    def productInfo = {

        def productIds = []

        if ( params.productIds ) {

            productIds = params.productIds.tokenize( "," )
        }
        else if ( params.layerId ) {

            log.debug "ProductIds being retrieved with params.layerId: '$params.layerId'"

            def layer = Layer.get( params.layerId )

            def aodaacProductLinks = AodaacProductLink.findAllByLayerNameIlikeAndServer( layer.name, layer.server )

            if ( !aodaacProductLinks && log.debugEnabled ) {

                log.debug "layer: ${ layer }"
//                log.debug "AodaacProductLink.findAllByLayerName( layer.name ): ${ AodaacProductLink.findAllByLayerName(layer.name) }"
//                log.debug "AodaacProductLink.findAllByServer( layer.server ): ${ AodaacProductLink.findAllByServer(layer.server) }"
            }

            productIds = aodaacProductLinks.collect{ it.productId }.unique()
        }

        if ( productIds ) {

            render aodaacAggregatorService.getProductInfo( productIds ) as JSON
        }
        else {

            render ([] as JSON)
        }
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
