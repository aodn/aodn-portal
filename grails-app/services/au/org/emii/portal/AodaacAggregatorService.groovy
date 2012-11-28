
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import au.org.emii.portal.exceptions.AodaacException
import grails.converters.JSON

import java.text.SimpleDateFormat

class AodaacAggregatorService {

    static transactional = true

    def grailsApplication
    def messageSource
	def portalInstance

    static final def StartJobCommand = "startBackgroundAggregator.cgi.sh"
    static final def UpdateJobCommand = "reportProgress.cgi.sh"
    static final def CancelJobCommand = "cancelJob.cgi.sh"
    static final def GetDataCommand = "getJobDataUrl.cgi.sh"
    static final def HttpStatusCodeSuccessRange = 200..299

    // Date formats
    static final def AggregatorDateRangeInputFormat = "yyyyMMdd"
    static final def AggregatorProductInfoDateOutputFormat = "dd/MM/yyyy hh:mm:ss"
    static final def JavascriptUIDateOutputFormat = "dd/MM/yyyy"
    static final def AggregatorStartDateAddedMessage = " to"

    // ProductDataJS
    static final def ProductDataPartIdx = 0
    static final def ProductExtentPartIdx = 1
    static final def ProductDataIdx = 1
    static final def MinValue = 0
    static final def MaxValue = 1
    static final def ProductDataDelimeter   = "var productData = "
    static final def ProductExtentDelimeter = "productExtents="

    // Service methods

	def getProductDataJavascriptAddress() {

		return "${_aggregatorBaseAddress()}aodaac-${_aggregatorEnvironment()}/js/productData.js"
	}

    def getProductInfo( productIds ) {

        log.debug "Getting Product Info for ids: '$productIds'. Converting from Javascript to JSON objects."

        // Delimeters for sections

        // Get the javascript
        def productDataJavascript = productDataJavascriptAddress.toURL().text

        // Split into relevant parts
        productDataJavascript = productDataJavascript.split( ProductDataDelimeter )[ ProductDataIdx ] // Ignore dataset info
        def parts = productDataJavascript.split( ProductExtentDelimeter )
        def productDataPart = parts[ ProductDataPartIdx ]
        def productExtentPart = parts[ ProductExtentPartIdx ]

        log.debug "productDataPart: ${ productDataPart }"
        log.debug "productExtentPart: ${ productExtentPart }"

        // Convert to JSON fo rextraction
        def allProductDataJson = JSON.parse( productDataPart )
        def allProductExtentJson = JSON.parse( productExtentPart )

        log.debug "allProductDataJson: ${ allProductDataJson } -- ${ allProductDataJson.getClass() }"
        log.debug "allProductExtentJson: ${ allProductExtentJson } -- ${ allProductExtentJson.getClass() }"

       return _productsInfoForIds( productIds, allProductDataJson, allProductExtentJson )
    }

    def createJob( notificationEmailAddress, params ) {

        log.debug "Creating AODAAC Job. Notication email address: '$notificationEmailAddress'"

        def apiCallArgs = []

        def fromJavascriptFotmatter = new SimpleDateFormat( JavascriptUIDateOutputFormat ) // 01/02/2012  -> Date Object
        def toJavascriptFormatter = new SimpleDateFormat( AggregatorDateRangeInputFormat ) // Date Object -> 20120201
        def dateRangeStart = fromJavascriptFotmatter.parse( params.dateRangeStart )
        def dateRangeEnd   = fromJavascriptFotmatter.parse( params.dateRangeEnd )

        apiCallArgs.with {
            add params.outputFormat
            add toJavascriptFormatter.format( dateRangeStart )
            add toJavascriptFormatter.format( dateRangeEnd )
            add params.timeOfDayRangeStart
            add params.timeOfDayRangeEnd
            add params.latitudeRangeStart
            add params.latitudeRangeEnd
            add params.longitudeRangeStart
            add params.longitudeRangeEnd
            add params.productId
        }

        // Generate url
        def apiCall = _aggregatorCommandAddress( StartJobCommand, apiCallArgs )

        // Include server/environment
        params.environment = _aggregatorEnvironment()
        params.server = _aggregatorBaseAddress()

        def responseText

        try {
            // Example URL: http://vm-115-33.ersa.edu.au/cgi-bin/IMOS.cgi?test,startBackgroundAggregator.cgi.sh,nc,20010101,20010102,0000,2400,-32.695,-25.006,150.293,165.234,1
            log.debug "apiCall: ${ apiCall }"

            // Make the call
            responseText = apiCall.toURL().text
            def responseJson = JSON.parse( responseText )

            log.debug "responseJson: ${ responseJson }"

            def job = new AodaacJob( responseJson.jobId, params, notificationEmailAddress )

            job.save failOnError: true

            return job
        }
        catch( Exception e ) {

            log.info "Call to '$apiCall' failed", e
            throw new AodaacException( "Unable to create new job (response: '$responseText')", e )
        }
    }

    void updateJob( job ) {

        log.debug "Updating job ${ job }"

        if ( job.latestStatus?.jobEnded ) {

            log.debug "Don't update job as we know if has already ended, but verify presence of result data file"

            // Check if result file exists
            _verifyResultFileExists job

            return
        }

        // Generate url
        def apiCall = _aggregatorCommandAddress( UpdateJobCommand, [job.jobId] )

        try {
            // Example URL: http://vm-115-33.ersa.edu.au/cgi-bin/IMOS.cgi?test,progress.cgi.sh,20110309T162224_3818
            log.debug "apiCall: ${ apiCall }"

            // Make the call
            def response = apiCall.toURL().text

            // Fixing invalid JSON response from AODAAC aggregator
            response = response.replaceAll( "/var/aodaac/test/log", "\"/var/aodaac/test/log\"" )
            response = response.replaceAll( "/var/aodaac/prod/log", "\"/var/aodaac/prod/log\"" )
            response = response.replaceAll( "cgiSeq: \n", "cgiSeq: \"\"\n" )

            log.debug "response: ${ response }"

            def updatedStatus = JSON.parse( response )

            updatedStatus.with {
                theErrors = errors // Rename field to match ours
                remove "errors"    // Remove old field (avoids name collisions)
            }

            log.debug "updatedStatus: ${ updatedStatus }"

            job.latestStatus = new AodaacJobStatus( updatedStatus )
            job.save failOnError: true

            if ( job.latestStatus.jobEnded ) {

                _retrieveResults job
                _verifyResultFileExists job
                _sendNotificationEmail job
            }
        }
        catch( Exception e ) {

            log.info "Call to '$apiCall' failed", e
            throw new AodaacException( "Unable to update job '$job'", e )
        }
    }

    void cancelJob( job ) {

        // Todo - DN: Test this, I'm not even sure cancelling jobs works on our VM

        log.debug "Cancelling job $job"

        // Generate url
        def apiCall = _aggregatorCommandAddress( CancelJobCommand, [job.jobId] )

        try {
            // Example URL: Todo - DN: Include example cancel URL
            log.debug "apiCall: ${ apiCall }"

            // Make the call
            apiCall.toURL().text // Doesn't return anything

            updateJob job
        }
        catch(Exception e) {

            log.info "Call to '$apiCall' failed", e
            throw new AodaacException( "Unable to cancel job '$job'", e )
        }
    }

    void deleteJob( job ) {

        log.debug "Deleting job $job"

        try {
            // Cancel processing before we delete our record of it
            cancelJob job

            job.delete()
        }
        catch (Exception e) {

            throw new AodaacException( "Unable to delete job '$job'", e )
        }
    }

    void _retrieveResults( job ) {

        log.debug "Retrieving results for $job"

        // Generate url
        def apiCall = _aggregatorCommandAddress( GetDataCommand, [job.jobId] )

        // Example URL: http://vm-115-33.ersa.edu.au/cgi-bin/IMOS.cgi?test,getJobDataUrl.cgi.sh,20110309T162224_3818
        log.debug "apiCall: ${ apiCall }"

        // Make the call
        def response = apiCall.toURL().text

        log.debug "response: $response"

        job.result = new AodaacJobResult( dataUrl: response?.trim() )
        job.save failOnError: true
    }

    void _verifyResultFileExists( job ) {

        log.debug "Verifying results file exists for $job"

        // Reset data file exists
        job.dataFileExists = false

        try {
            def url = job.result.dataUrl.toURL()

            def conn = url.openConnection()
            conn.requestMethod = "HEAD"
            conn.connect()

            log.debug "conn.responseCode: ${ conn.responseCode }"

            if ( conn.responseCode in HttpStatusCodeSuccessRange ) {

                job.dataFileExists = true
            }

            // Record date this check occurred
            job.mostRecentDataFileExistCheck = new Date()
            job.save failOnError: true
        }
        catch( Exception e ) {

            log.info "Could not check existence of result file for job '$job'", e
        }
    }

    void _sendNotificationEmail( job ) {

        log.info "Sending notification email for $job to '${job.notificationEmailAddress}'"

        if ( !job.latestStatus.jobEnded ) {

            log.debug "Will not send notification email for job which has not ended."
            return
        }

        if ( !job.notificationEmailAddress ) {

            log.warn "No notification email address, not sending email"
            return
        }

        try {

            // To know which message key to use
            def instanceCode = portalInstance.code()

            def successMessage = job.dataFileExists

            // Message replacement args
            def args

            if ( successMessage ) {

                args = [job.result.dataUrl]
            }
            else {

                def p = job.jobParams
                def paramsString = """\
ProductId: ${ p.productId }
Output format: ${ p.outputFormat }
Date range start: ${ p.dateRangeStart }
Date range end: ${ p.dateRangeEnd }
Time of day start: ${ p.timeOfDayRangeStart }
Time of day end: ${ p.timeOfDayRangeEnd }
Lat range start: ${ p.latitudeRangeStart }
Lat range end: ${ p.latitudeRangeEnd }
Long range start: ${ p.longitudeRangeStart }
Long range end: ${ p.longitudeRangeEnd }
"""

                def errorMessage = job.latestStatus.theErrors

                if ( !errorMessage ) {

                    errorMessage = job.latestStatus.urlCount ? "Unknown error (URLs found: ${job.latestStatus.urlCount})" : "No URLs found to aggregate. Try broadening the search parameters."
                }

                args = [errorMessage, paramsString]
            }

            def emailBodyCode = "${instanceCode}.aodaacJob.notification.email.${ successMessage ? "success" : "failed"}Body"
            def emailBody = messageSource.getMessage( emailBodyCode, args.toArray(), Locale.getDefault() )

            def emailSubjectCode = "${instanceCode}.aodaacJob.notification.email.subject"
            def emailSubject = messageSource.getMessage( emailSubjectCode, [job.jobId].toArray(), Locale.getDefault() )

            sendMail {
                to( [job.notificationEmailAddress] )
                subject( emailSubject )
                body( emailBody )
                from( grailsApplication.config.portal.systemEmail.fromAddress )
            }
        }
        catch (Exception e) {

            log.info "Unable to notify user (email address: '${job.notificationEmailAddress}') about completion of AODAAC job: $job", e
        }
    }

    def _productsInfoForIds( productIds, allProductDataJson, allProductExtentJson ) {

        if ( !productIds ) {

            log.debug "No productIds passed, using all from allProductdataJson"

            productIds = allProductDataJson.collect( { it.id } )
        }

        log.debug "productIds: ${ productIds }"

        def productsInfo = []

        productIds.each {
            productId ->

            // Create new JSON object with desired structure
            def productInfo = [
                    extents: [
                            lat: [:],
                            lon: [:],
                            dateTime: [:]
                    ]
            ]

            // Copy data to new structure
            def matchingIds = { it.id == productId?.toString() } // it.id will be a String
            def productDataJson = allProductDataJson.find( matchingIds )
            def productExtentJson = allProductExtentJson.find( matchingIds )

            log.debug "JSON for productId: '$productId'"
            log.debug "  productDataJson: $productDataJson"
            log.debug "  productExtentJson: $productExtentJson"

            try {
                // Name, etc.
                productInfo.name = productDataJson.name
                productInfo.productId = productDataJson.id

                // Latitude
                productInfo.extents.lat.min = productExtentJson.extents.lat[ MinValue ]
                productInfo.extents.lat.max = productExtentJson.extents.lat[ MaxValue ]

                // longitude
                productInfo.extents.lon.min = productExtentJson.extents.lon[ MinValue ]
                productInfo.extents.lon.max = productExtentJson.extents.lon[ MaxValue ]

                // Time (sanitise and parse)
                def startTimeString = productExtentJson.extents.dateTime[ MinValue ]
                def endTimeString = productExtentJson.extents.dateTime[ MaxValue ]

                startTimeString -= AggregatorStartDateAddedMessage // Remove message added to start time by aggregator

                log.debug "  startTimeString: ${ startTimeString }"

                def startTimeDate = Date.parse( AggregatorProductInfoDateOutputFormat, startTimeString )
                def endTimeDate = Date.parse( AggregatorProductInfoDateOutputFormat, endTimeString )

                productInfo.extents.dateTime.min = startTimeDate.format( JavascriptUIDateOutputFormat )
                productInfo.extents.dateTime.max = endTimeDate.format( JavascriptUIDateOutputFormat )

                productsInfo << productInfo
            }
            catch (Exception e) {

                log.info "Problem reading info from JSON (possible invalid values in JSON)", e
                log.info "productDataJson: $productDataJson"
                log.info "productExtentJson: $productExtentJson"
            }
        }

        return productsInfo
    }

    // Supporting logic

    def _aggregatorCommandAddress( command, args ) {

        def baseUrl = _aggregatorBaseAddress()
        def cgiPart = "cgi-bin/IMOS.cgi?"
        def environmentPart = "${_aggregatorEnvironment()},"
        def commandPart = "$command,"
        def argPart = args.join( ',' )

        return baseUrl + cgiPart + environmentPart + commandPart + argPart
    }

    def _aggregatorBaseAddress() {

        return _ensureTrailingSlash( grailsApplication.config.aodaacAggregator.url )
    }

    def _aggregatorEnvironment() {

        return grailsApplication.config.aodaacAggregator.environment
    }

    def _ensureTrailingSlash( s ) {

        if ( !s ) return "/"

        def slash = s[-1] != "/" ? "/" : ""

        return "$s$slash"
    }

    def checkIncompleteJobs(){
        def jobList = AodaacJob.findAll("from AodaacJob as job where job.latestStatus.jobEnded is null or job.latestStatus.jobEnded = false")

        log.debug "number of jobs: " + jobList.size()

        jobList.each{
            log.debug it
            updateJob it
        }
    }
}
