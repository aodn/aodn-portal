package au.org.emii.portal

import au.org.emii.portal.exceptions.AodaacException
import grails.converters.JSON

class AodaacAggregatorService {

    static transactional = true

    def grailsApplication

    // Todo - DN: Possible to refactor out common parts of these methods. Have a method liek this makeRequest( requestType, args, closure{ response -> } )

    static final def AodaacEnvironment = "test" // Todo - DN: Where should this live?
    static final def StartJobCommand = "startBackgroundAggregator.cgi.sh" // Todo - DN: Where should this live?
    static final def UpdateJobCommand = "reportProgress.cgi.sh" // Todo - DN: Where should this live?
    static final def CancelJobCommand = "cancelJob.cgi.sh" // Todo - DN: Where should this live?
    static final def GetDataCommand = "getJobDataUrl.cgi.sh" // Todo - DN: Where should this live?
    static final def DateFormat = "yyyyMMdd"

    def getTestParams() {

        return [
            dateRangeStart: new GregorianCalendar(2011, java.util.Calendar.DECEMBER, 5).time,
            dateRangeEnd: new GregorianCalendar(2012, java.util.Calendar.JANUARY, 1).time,
            timeOfDayRangeStart: "0000",
            timeOfDayRangeEnd: "2400",
            latitudeRangeStart: -90,
            latitudeRangeEnd: 90,
            longitudeRangeStart: -180,
            longitudeRangeEnd: 180,
            productId: 1,
            outputFormat: "hdf"
        ]
    }

    // Service methods

    def checkProducts() {

        return "${ _aggregatorBaseUrl() }aodaac-$AodaacEnvironment/js/productData.js".toURL().text
    }

    def createJob( params ) {

        // Todo - DN: Vaidate params?

        def args = []
        args.with {
            add params.outputFormat
            add params.dateRangeStart.format( DateFormat )
            add params.dateRangeEnd.format( DateFormat )
            add params.timeOfDayRangeStart
            add params.timeOfDayRangeEnd
            add params.latitudeRangeStart
            add params.latitudeRangeEnd
            add params.longitudeRangeStart
            add params.longitudeRangeEnd
            add params.productId
        }

        // Generate url
        def apiCall = _aggregatorCommandUrl( StartJobCommand, args )

        // Include server/environment
        params.environment = AodaacEnvironment
        params.server = _aggregatorBaseUrl()

        try {
            // Example URL: http://vm-115-33.ersa.edu.au/cgi-bin/IMOS.cgi?test,startBackgroundAggregator.cgi.sh,nc,20010101,20010102,0000,2400,-32.695,-25.006,150.293,165.234,1
            log.debug "apiCall: ${ apiCall }"

            // Make the call
            def response = JSON.parse( apiCall.toURL().text )

            log.debug "response: ${ response }"

            if ( response.jobId ) {

                def job = new AodaacJob( response.jobId, params )

                job.save( failOnError: true )

                return job
            }
        }
        catch(Exception e) {

            log.info "Call to '$apiCall' failed", e
            throw new AodaacException( "Unable to create new job", e )
        }

        return null
    }

    void updateJob( job ) {

        log.debug "Updating job ${ job }"

        if ( !job ) return

        if ( job.latestStatus?.jobEnded ) { // Todo - DN: Check if data has been retrieved as well?

            if ( !job.result?.dataUrl ) log.error "Unexpected state for job: $job" // Todo - DN: What about if job has been cancelled?

            log.debug "Not updating job as we already know it has ended"
            return
        }

        // Generate url
        def apiCall = _aggregatorCommandUrl( UpdateJobCommand, [job.jobId] )

        try {
            // Example URL: http://vm-115-33.ersa.edu.au/cgi-bin/IMOS.cgi?test,progress.cgi.sh,20110309T162224_3818
            log.debug "apiCall: ${ apiCall }"

            // Make the call
            def response = apiCall.toURL().text

            response = response.replaceAll( "/var/aodaac/test/log", "\"/var/aodaac/test/log\"" ) // TODO - HACK - Fixing bad JSON response
            response = response.replaceAll( "/var/aodaac/prod/log", "\"/var/aodaac/prod/log\"" ) // TODO - HACK - Fixing bad JSON response

            log.debug "response: ${ response }"

            def updatedStatus = JSON.parse( response )

            updatedStatus.with {
                theErrors = errors // Rename field to match ours
                remove "errors"
            }

            log.debug "updatedStatus: ${ updatedStatus }"

            job.latestStatus = new AodaacJobStatus( updatedStatus )
            job.save failOnError: true

            if ( job.latestStatus.jobEnded ) {

                _retrieveResults( job )
            }
        }
        catch(Exception e) {

            log.info "Call to '$apiCall' failed", e
            throw new AodaacException( "Unable to create new job", e )
        }
    }

    void cancelJob( job ) {

        // Generate url
        def apiCall = _aggregatorCommandUrl( CancelJobCommand, [job.jobId] )

        try {
            // Example URL: http://vm-115-33.ersa.edu.au/cgi-bin/IMOS.cgi?test,startBackgroundAggregator.cgi.sh,20110309T162224_3818
            log.debug "apiCall: ${ apiCall }"

            // Make the call
            apiCall.toURL().text // Doesn't return anything

            updateJob job
        }
        catch(Exception e) {

            log.info "Call to '$apiCall' failed", e
            throw new AodaacException( "Unable to cancel job '${job.jobId}'", e )
        }
    }

    void _retrieveResults( job ) {

        log.debug "Retrieving results for $job"

        // Generate url
        def apiCall = _aggregatorCommandUrl( GetDataCommand, [job.jobId] )

        try {
            // Example URL: http://vm-115-33.ersa.edu.au/cgi-bin/IMOS.cgi?test,getJobDataUrl.cgi.sh,20110309T162224_3818
            log.debug "apiCall: ${ apiCall }"

            // Make the call
            def response = apiCall.toURL().text

            log.debug "response: $response"

            job.result = new AodaacJobResult( dataUrl: response )
            job.save()
        }
        catch(Exception e) {

            log.info "Call to '$apiCall' failed", e
            throw new AodaacException( "Unable to create new job", e )
        }
    }

    // Supporting logic

    def _aggregatorCommandUrl( command, args ) {

        def baseUrl = _aggregatorBaseUrl()
        def cgiPart = "cgi-bin/IMOS.cgi?"
        def environmentPart = "$AodaacEnvironment,"
        def commandPart = "$command,"
        def argPart = args.join(',')

        return baseUrl + cgiPart + environmentPart + commandPart + argPart
    }

    def _aggregatorBaseUrl() {

        return _ensureTrailingSlash( grailsApplication.config.aodaacAggregator.url )
    }

    def _ensureTrailingSlash( s ) {

        if ( !s ) return "/"

        def slash = s[-1..-1] != "/" ? "/" : ""

        return "$s$slash"
    }
}