package au.org.emii.portal

import org.apache.shiro.SecurityUtils
import grails.converters.JSON

class AodaacController {

    def aodaacAggregatorService

    def index = {

        [ testParams: aodaacAggregatorService.testParams ]
    }

    def checkProducts = {

        render "<pre>${aodaacAggregatorService.checkProducts()}</pre>"
    }

    def createJob = {

//        def params = [:]
//
//        // Quick job
//        params.with {
//            dateRangeStart = new GregorianCalendar(2006, java.util.Calendar.NOVEMBER, 7).time
//            dateRangeEnd = new GregorianCalendar(2007, java.util.Calendar.NOVEMBER, 17).time
//            timeOfDayRangeStart = "0000"
//            timeOfDayRangeEnd = "2400"
//            latitudeRangeStart = -40.219
//            latitudeRangeEnd = -43.587
//            longitudeRangeStart = 144.059
//            longitudeRangeEnd = 149.464
//            productId = 8
//            outputFormat = "hdf"
//        }
//
//        // Longer job
//        params.with {
//
//        }

        aodaacAggregatorService.createJob( aodaacAggregatorService.testParams )

        redirect action: "index"
    }

    def updateJob = {

        aodaacAggregatorService.updateJob( _byId( params.id ) )

        redirect action: "index"
    }

    def cancelJob = {

        aodaacAggregatorService.cancelJob( _byId( params.id ) )

        redirect action: "index"
    }

    def deleteJob = {

        _byId( params.id )?.delete()

        redirect action: "index"
    }

    def userJobInfo = {

        def subject = SecurityUtils.subject

        if ( !subject || !subject?.principal ) {

            render [] as JSON
            return
        }

        def userInstance = User.get( subject.principal )

        if ( !userInstance ) {

            log.error "No user found with id: " + subject.principal
            render status: 500
        }

        render userInstance.aodaacJobs as JSON
    }

    def _byId( jobId ) {

        return AodaacJob.findByJobId( jobId )
    }
}
