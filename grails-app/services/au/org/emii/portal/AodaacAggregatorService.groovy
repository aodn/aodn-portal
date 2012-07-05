package au.org.emii.portal

import au.org.emii.portal.exceptions.AodaacException
import grails.converters.JSON

class AodaacAggregatorService {

    static transactional = true

    def grailsApplication

    static final def AodaacEnvironment = "test" // Todo - DN: Where should this live? Config!
    static final def StartJobCommand = "startBackgroundAggregator.cgi.sh"
    static final def UpdateJobCommand = "reportProgress.cgi.sh"
    static final def CancelJobCommand = "cancelJob.cgi.sh"
    static final def GetDataCommand = "getJobDataUrl.cgi.sh"
    static final def DateFormat = "yyyyMMdd" // Todo - DN: Give better name
    static final def HttpStatusCodeSuccessRange = 200..299

    static final def ProductDataPartIdx = 0
    static final def ProductExtentPartIdx = 1

    static final def ProductDataIdx = 1

    static final def MinValue = 0
    static final def MaxValue = 1

    // Service methods

    def getProductInfo( productIds ) {

        log.debug "Getting Product Info for ids: '$productIds'. Converting from Javascript to JSON objects."

        // Delimeters for sections
        def productDataDelimeter = "var productData = " // Todo - DN: String to constant
        def productExtentDelimeter = "productExtents=" // Todo - DN: String to constant

        // Get the javascript
        def productDataJavascript = "${ _aggregatorBaseUrl() }aodaac-$AodaacEnvironment/js/productData.js".toURL().text

        // Split into relevant parts
        productDataJavascript = productDataJavascript.split( productDataDelimeter )[ ProductDataIdx ] // Ignore dataset info
        def parts = productDataJavascript.split( productExtentDelimeter )
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

        // Todo - DN: Vaidate params?

        log.info "Creating AODAAC Job. Notication email address: '$notificationEmailAddress'"

        def apiCallArgs = []

        apiCallArgs.with {
            add params.outputFormat
            add params.dateRangeStart?.format( DateFormat )
            add params.dateRangeEnd?.format( DateFormat )
            add params.timeOfDayRangeStart
            add params.timeOfDayRangeEnd
            add params.latitudeRangeStart
            add params.latitudeRangeEnd
            add params.longitudeRangeStart
            add params.longitudeRangeEnd
            add params.productId
        }

        // Generate url
        def apiCall = _aggregatorCommandUrl( StartJobCommand, apiCallArgs )

        // Include server/environment
        params.environment = AodaacEnvironment
        params.server = _aggregatorBaseUrl()

        def responseText

        try {
            // Example URL: http://vm-115-33.ersa.edu.au/cgi-bin/IMOS.cgi?test,startBackgroundAggregator.cgi.sh,nc,20010101,20010102,0000,2400,-32.695,-25.006,150.293,165.234,1
            log.debug "apiCall: ${ apiCall }"

            // Make the call
            responseText = apiCall.toURL().text
            def responseJson = JSON.parse( responseText )

            log.debug "responseJson: ${ responseJson }"

            if ( responseJson.jobId ) {

                def job = new AodaacJob( responseJson.jobId, params, notificationEmailAddress )

                job.save failOnError: true

                return job
            }
        }
        catch( Exception e ) {

            log.info "Call to '$apiCall' failed", e
            throw new AodaacException( "Unable to create new job (response: '$responseText')", e )
        }

        return null
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
                remove "errors"    // Remove old field (avoids name collisions)
            }

            log.debug "updatedStatus: ${ updatedStatus }"

            job.latestStatus = new AodaacJobStatus( updatedStatus )
            job.save failOnError: true

            if ( job.latestStatus.jobEnded ) {

                _retrieveResults job
                _verifyResultFileExists job
            }
        }
        catch( Exception e ) {

            log.info "Call to '$apiCall' failed", e
            throw new AodaacException( "Unable to update job '$job'", e )
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
            throw new AodaacException( "Unable to cancel job '$job'", e )
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
            job.save failOnError: true
        }
        catch( Exception e ) {

            log.info "Call to '$apiCall' failed", e
            throw new AodaacException( "Unable to retrieve results of job '$job'", e )
        }
    }

    void _verifyResultFileExists( job ) {

        log.debug "Verifying results file exists for $job"

        // Reset data file exists
        job.dataFileExists = false

        try {
            def url = job.result.dataUrl.toURL()

            log.debug "job.result.dataUrl.toURL(): ${ url }"

            def conn = url.openConnection()
            conn.requestMethod = "HEAD"
            conn.connect()

            log.debug "conn.responseCode: ${ conn.responseCode }"

            if ( HttpStatusCodeSuccessRange.contains( conn.responseCode ) ) {

                job.dataFileExists = true
            }
        }
        catch( Exception e ) {

            log.debug "Could not check existence of result file for job '$job'", e
        }

        // Record date this check occurred
        job.mostRecentDataFileExistCheck = new Date()
        job.save failOnError: true
    }

    def _productsInfoForIds( productIds, allProductDataJson, allProductExtentJson ) {

        if ( !productIds ) {

            log.debug "No productIds passed, using all from allProductdataJson"

            productIds = allProductDataJson.collect( { it.id} )
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

                startTimeString = startTimeString - " to" // Start time is appended with ' to' for display  purposes, but we don't want that // Todo - DN: String to remove

                log.debug "  startTimeString: ${ startTimeString }"

                def startTimeDate = Date.parse( "dd/MM/yyyy hh:mm:ss", startTimeString ) // Todo - DN: String format to constant
                def endTimeDate = Date.parse( "dd/MM/yyyy hh:mm:ss", endTimeString )     // Todo - DN: String format to constant

                productInfo.extents.dateTime.min = startTimeDate.format( "dd/MM/yyyy" ) // Todo - DN: Date format to constant
                productInfo.extents.dateTime.max = endTimeDate.format( "dd/MM/yyyy" )   // Todo - DN: Date format to constant

                productsInfo << productInfo
            }
            catch (Exception) {

                log.info "Problem reading info from JSON (possible invalid values in JSON)"
                log.info "productDataJson: $productDataJson"
                log.info "productExtentJson: $productExtentJson"
            }
        }

        return productsInfo
    }

    // Supporting logic

    def _aggregatorCommandUrl( command, args ) {

        def baseUrl = _aggregatorBaseUrl()
        def cgiPart = "cgi-bin/IMOS.cgi?"
        def environmentPart = "$AodaacEnvironment,"
        def commandPart = "$command,"
        def argPart = args.join( ',' )

        return baseUrl + cgiPart + environmentPart + commandPart + argPart
    }

    def _aggregatorBaseUrl() {

        return _ensureTrailingSlash( grailsApplication.config.aodaacAggregator.url )
    }

    def _ensureTrailingSlash( s ) {

        if ( !s ) return "/"

        def slash = s[-1] != "/" ? "/" : ""

        return "$s$slash"
    }
}