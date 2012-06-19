package au.org.emii.portal

import org.apache.shiro.SecurityUtils
import grails.converters.JSON

class AodaacController {

    def aodaacAggregatorService

    def testParams() {

        [
            dateRangeStart: new GregorianCalendar(2011, java.util.Calendar.JANUARY, 14).time,
            dateRangeEnd: new GregorianCalendar(2011, java.util.Calendar.JANUARY, 21).time,
            timeOfDayRangeStart: "0000",
            timeOfDayRangeEnd: "2400",
//            latitudeRangeStart: -70,
//            latitudeRangeEnd: 40,
//            longitudeRangeStart: -145,
//            longitudeRangeEnd: 60,
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

    def checkProducts = {

        render "<pre>${aodaacAggregatorService.checkProducts()}</pre>"
    }

    def createJob = {

        def user = User.get( SecurityUtils.subject?.principal as Long )

        aodaacAggregatorService.createJob user, testParams()

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

        Thread.sleep 1500

        def subject = SecurityUtils.subject

        if ( !subject || !subject?.principal ) {

            render [] as JSON
            return
        }

        def userInstance = User.get( subject.principal as Long )

        if ( !userInstance ) {

            log.error "No user found with id: ${subject.principal}"
            render status: 500
        }

        def jobs = userInstance.aodaacJobs

        jobs.each {

            aodaacAggregatorService.updateJob it // Could this be made async?
        }

        render jobs as JSON
    }

    def _byId( jobId ) {

        return AodaacJob.findByJobId( jobId )
    }
}
