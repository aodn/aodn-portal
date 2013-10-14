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

import static au.org.emii.portal.UrlUtils.ensureTrailingSlash

class AodaacAggregatorService {

    static transactional = true

    def grailsApplication
    def messageSource
    def portalInstance

    static final def COMMAND_START_JOB = "startBackgroundAggregator.cgi.sh"
    static final def COMMAND_UPDATE_JOB = "reportProgress.cgi.sh"
    static final def COMMAND_CANCEL_JOB = "cancelJob.cgi.sh"
    static final def COMMAND_GET_DATA = "getJobDataUrl.cgi.sh"
    static final def HTTP_SUCCESS_CODES = 200..299

    // Date formats
    static final def AGGREGATOR_DATE_INPUT_FORMAT = "yyyyMMdd"
    static final def AGGREGATOR_DATE_OUTPUT_FORMAT = "dd/MM/yyyy hh:mm:ss"
    static final def JAVASCRIPT_UI_DATE_OUTPUT_FORMAT = "dd/MM/yyyy"
    static final def AGGREGATOR_START_DATE_ADDED_MESSAGE = " to"

    // ProductDataJS
    static final def PRODUCT_DATA_PART_INDEX = 0
    static final def PRODUCT_EXTENT_PART_INDEX = 1
    static final def PRODUCT_DATA_INDEX = 1
    static final def MIN_VALUE_INDEX = 0
    static final def MAX_VALUE_INDEX = 1
    static final def PRODUCT_DATA_BOUNDARY = "var productData = "
    static final def PRODUCT_EXTENT_BOUNDARY = "productExtents="

    // Service methods

    def getProductDataJavascriptAddress() {

        return "${_aggregatorBaseAddress()}aodaac-${_aggregatorEnvironment()}/js/productData.js"
    }

    def getProductInfo(productIds) {

        log.debug "Getting Product Info for ids: '$productIds'. Converting from Javascript to JSON objects."

        // Delimeters for sections

        // Get the javascript
        def productDataJavascript = productDataJavascriptAddress.toURL().text

        // Split into relevant parts
        productDataJavascript = productDataJavascript.split(PRODUCT_DATA_BOUNDARY)[PRODUCT_DATA_INDEX] // Ignore dataset info
        def parts = productDataJavascript.split(PRODUCT_EXTENT_BOUNDARY)
        def productDataPart = parts[PRODUCT_DATA_PART_INDEX]
        def productExtentPart = parts[PRODUCT_EXTENT_PART_INDEX]

        log.debug "productDataPart: ${ productDataPart }"
        log.debug "productExtentPart: ${ productExtentPart }"

        // Convert to JSON fo rextraction
        def allProductDataJson = JSON.parse(productDataPart)
        def allProductExtentJson = JSON.parse(productExtentPart)

        log.debug "allProductDataJson: ${ allProductDataJson } -- ${ allProductDataJson.getClass() }"
        log.debug "allProductExtentJson: ${ allProductExtentJson } -- ${ allProductExtentJson.getClass() }"

        return _productsInfoForIds(productIds, allProductDataJson, allProductExtentJson)
    }

    def productIdsForLayer(layer) {

        def productLinks = AodaacProductLink.findAllByLayerNameIlikeAndServer(layer.name, layer.server)

        return productLinks.collect{ it.productId }.unique()
    }

    def createJob(notificationEmailAddress, params) {

        log.debug "Creating AODAAC Job. Notication email address: '$notificationEmailAddress'"

        def apiCallArgs = []

        def fromJavascriptFotmatter = new SimpleDateFormat(JAVASCRIPT_UI_DATE_OUTPUT_FORMAT) // 01/02/2012  -> Date Object
        def toJavascriptFormatter = new SimpleDateFormat(AGGREGATOR_DATE_INPUT_FORMAT) // Date Object -> 20120201
        def dateRangeStart = fromJavascriptFotmatter.parse(params.dateRangeStart)
        def dateRangeEnd = fromJavascriptFotmatter.parse(params.dateRangeEnd)

        apiCallArgs.with {
            add params.outputFormat
            add toJavascriptFormatter.format(dateRangeStart)
            add toJavascriptFormatter.format(dateRangeEnd)
            add params.timeOfDayRangeStart
            add params.timeOfDayRangeEnd
            add params.latitudeRangeStart
            add params.latitudeRangeEnd
            add params.longitudeRangeStart
            add params.longitudeRangeEnd
            add params.productId
        }

        // Generate url
        def apiCall = _aggregatorCommandAddress(COMMAND_START_JOB, apiCallArgs)

        // Include server/environment
        params.environment = _aggregatorEnvironment()
        params.server = _aggregatorBaseAddress()

        def responseText

        try {
            // Example URL: http://vm-115-33.ersa.edu.au/cgi-bin/IMOS.cgi?test,startBackgroundAggregator.cgi.sh,nc,20010101,20010102,0000,2400,-32.695,-25.006,150.293,165.234,1
            log.debug "apiCall: ${ apiCall }"

            // Make the call
            responseText = apiCall.toURL().text
            def responseJson = JSON.parse(responseText)

            log.debug "responseJson: ${ responseJson }"

            def job = new AodaacJob(responseJson.jobId, params, notificationEmailAddress)

            job.save failOnError: true

            return job
        }
        catch (Exception e) {

            log.info "Call to '$apiCall' failed", e
            throw new AodaacException("Unable to create new job (response: '$responseText')", e)
        }
    }

    void updateJob(job) {

        log.debug "Updating job ${ job }"

        if (job.latestStatus?.jobEnded) {

            log.debug "Don't update job as we know if has already ended, but verify presence of result data file"

            // Check if result file exists
            _verifyResultFileExists job

            return
        }

        // Generate url
        def apiCall = _aggregatorCommandAddress(COMMAND_UPDATE_JOB, [job.jobId])

        try {
            // Example URL: http://vm-115-33.ersa.edu.au/cgi-bin/IMOS.cgi?test,progress.cgi.sh,20110309T162224_3818
            log.debug "apiCall: ${ apiCall }"

            // Make the call
            def response = apiCall.toURL().text

            // Fixing invalid JSON response from AODAAC aggregator
            response = response.replaceAll("/var/aodaac/test/log", "\"/var/aodaac/test/log\"")
            response = response.replaceAll("/var/aodaac/prod/log", "\"/var/aodaac/prod/log\"")
            response = response.replaceAll("cgiSeq: \n", "cgiSeq: \"\"\n")

            log.debug "response: ${ response }"

            def updatedStatus = JSON.parse(response)

            updatedStatus.with {
                theErrors = errors // Rename field to match ours
                remove "errors"    // Remove old field (avoids name collisions)
            }

            log.debug "updatedStatus: ${ updatedStatus }"

            job.latestStatus = new AodaacJobStatus(updatedStatus)
            job.save failOnError: true

            if (job.latestStatus.jobEnded) {

                _retrieveResults job
                _verifyResultFileExists job
                _sendNotificationEmail job
            }
            else if (_jobIsTakingTooLong(job)) {

                _markJobAsExpired job
                _sendNotificationEmail job
            }
        }
        catch (Exception e) {

            log.info "Call to '$apiCall' failed", e
            throw new AodaacException("Unable to update job '$job'", e)
        }
    }

    void cancelJob(job) {

        // Todo - DN: Test this, I'm not even sure cancelling jobs works on our VM

        log.debug "Cancelling job $job"

        // Generate url
        def apiCall = _aggregatorCommandAddress(COMMAND_CANCEL_JOB, [job.jobId])

        try {
            // Example URL: Todo - DN: Include example cancel URL
            log.debug "apiCall: ${ apiCall }"

            // Make the call
            apiCall.toURL().text // Doesn't return anything

            updateJob job
        }
        catch (Exception e) {

            log.info "Call to '$apiCall' failed", e
            throw new AodaacException("Unable to cancel job '$job'", e)
        }
    }

    void deleteJob(job) {

        log.debug "Deleting job $job"

        try {
            // Cancel processing before we delete our record of it
            cancelJob job

            job.delete()
        }
        catch (Exception e) {

            throw new AodaacException("Unable to delete job '$job'", e)
        }
    }

    def checkIncompleteJobs() {
        def jobList = AodaacJob.findAll("from AodaacJob as job where job.expired = false and (job.latestStatus.jobEnded is null or job.latestStatus.jobEnded = false)")

        log.debug "number of jobs: " + jobList.size()

        jobList.each {
            log.debug it
            updateJob it
        }
    }

    // Supporting logic

    void _retrieveResults(job) {

        log.debug "Retrieving results for $job"

        // Generate url
        def apiCall = _aggregatorCommandAddress(COMMAND_GET_DATA, [job.jobId])

        // Example URL: http://vm-115-33.ersa.edu.au/cgi-bin/IMOS.cgi?test,getJobDataUrl.cgi.sh,20110309T162224_3818
        log.debug "apiCall: ${ apiCall }"

        // Make the call
        def response = apiCall.toURL().text

        log.debug "response: $response"

        job.result = new AodaacJobResult(dataUrl: response?.trim())
        job.save failOnError: true
    }

    void _verifyResultFileExists(job) {

        log.debug "Verifying results file exists for $job"

        // Reset data file exists
        job.dataFileExists = false

        try {
            def url = job.result.dataUrl.toURL()

            log.debug "url: ${ url }"

            def conn = url.openConnection()
            conn.requestMethod = "HEAD"
            conn.connect()

            log.debug "conn.responseCode: ${ conn.responseCode }"

            if (conn.responseCode in HTTP_SUCCESS_CODES) {

                job.dataFileExists = true
            }

            // Record date this check occurred
            job.mostRecentDataFileExistCheck = new Date()
            job.save failOnError: true
        }
        catch (Exception e) {

            log.info "Could not check existence of result file for job '$job'", e
        }
    }

    void _sendNotificationEmail(job) {

        log.info "Sending notification email for $job to '${job.notificationEmailAddress}'"

        if (!(job.latestStatus.jobEnded || job.expired)) {

            log.debug "Will not send notification email for job which has not ended or expired."
            return
        }

        if (!job.notificationEmailAddress) {

            log.warn "No notification email address, not sending email"
            return
        }

        try {
            // Message replacement args
            def args = _getEmailBodyReplacements(job)

            def emailBodyCode = _getEmailBodyMessageCode(job)
            def emailBody = messageSource.getMessage(emailBodyCode, args.toArray(), Locale.getDefault())

            def emailSubjectCode = "${portalInstance.code()}.aodaacJob.notification.email.subject"
            def emailSubject = messageSource.getMessage(emailSubjectCode, [job.jobId].toArray(), Locale.getDefault())

            sendMail {
                to([job.notificationEmailAddress])
                subject(emailSubject)
                body(emailBody)
                from(grailsApplication.config.portal.systemEmail.fromAddress)
            }
        }
        catch (Exception e) {

            log.info "Unable to notify user (email address: '${job.notificationEmailAddress}') about completion of AODAAC job: $job", e
        }
    }

    def _aggregatorCommandAddress(command, args) {

        def baseUrl = _aggregatorBaseAddress()
        def cgiPart = "cgi-bin/IMOS.cgi?"
        def environmentPart = "${_aggregatorEnvironment()},"
        def commandPart = "$command,"
        def argPart = args.join(',')

        return baseUrl + cgiPart + environmentPart + commandPart + argPart
    }

    def _aggregatorBaseAddress() {

        return ensureTrailingSlash(grailsApplication.config.aodaacAggregator.url)
    }

    def _aggregatorEnvironment() {

        return grailsApplication.config.aodaacAggregator.environment
    }

    def _productsInfoForIds(productIds, allProductDataJson, allProductExtentJson) {

        if (!productIds) {

            log.debug "No productIds passed, using all from allProductdataJson"

            productIds = allProductDataJson.collect({ it.id })
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
                def productDataJson = allProductDataJson.find(matchingIds)
                def productExtentJson = allProductExtentJson.find(matchingIds)

                log.debug "JSON for productId: '$productId'"
                log.debug "  productDataJson: $productDataJson"
                log.debug "  productExtentJson: $productExtentJson"

                try {
                    // Name, etc.
                    productInfo.name = productDataJson.name
                    productInfo.productId = productDataJson.id

                    // Latitude
                    productInfo.extents.lat.min = productExtentJson.extents.lat[MIN_VALUE_INDEX]
                    productInfo.extents.lat.max = productExtentJson.extents.lat[MAX_VALUE_INDEX]

                    // longitude
                    productInfo.extents.lon.min = productExtentJson.extents.lon[MIN_VALUE_INDEX]
                    productInfo.extents.lon.max = productExtentJson.extents.lon[MAX_VALUE_INDEX]

                    // Time (sanitise and parse)
                    def startTimeString = productExtentJson.extents.dateTime[MIN_VALUE_INDEX]
                    def endTimeString = productExtentJson.extents.dateTime[MAX_VALUE_INDEX]

                    startTimeString -= AGGREGATOR_START_DATE_ADDED_MESSAGE // Remove message added to start time by aggregator

                    log.debug "  startTimeString: ${ startTimeString }"

                    def startTimeDate = Date.parse(AGGREGATOR_DATE_OUTPUT_FORMAT, startTimeString)
                    def endTimeDate = Date.parse(AGGREGATOR_DATE_OUTPUT_FORMAT, endTimeString)

                    productInfo.extents.dateTime.min = startTimeDate.format(JAVASCRIPT_UI_DATE_OUTPUT_FORMAT)
                    productInfo.extents.dateTime.max = endTimeDate.format(JAVASCRIPT_UI_DATE_OUTPUT_FORMAT)

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

    def _jobIsTakingTooLong(job) {

        def jobHasMadeProgress = job.latestStatus.urlsComplete > 0

        def duration

        use(groovy.time.TimeCategory) {
            duration = new Date() - job.dateCreated
        }

        def hours = duration.hours + (duration.days * 24)
        def jobTooOld = hours >= grailsApplication.config.aodaacAggregator.idleJobTimeout

        def isTakingTooLong = jobTooOld && !jobHasMadeProgress

        log.debug "duration: ${ duration }"
        log.debug "isTakingTooLong == (jobTooOld && !isMakingProgress) == ($jobTooOld && !$jobHasMadeProgress) == $isTakingTooLong"

        return isTakingTooLong
    }

    def _markJobAsExpired(job) {

        job.expired = true
        job.save flush: true
    }

    def _getEmailBodyReplacements(job) {

        def replacements = []

        // If successful
        if (job.dataFileExists) {

            // Success message
            replacements << job.result.dataUrl
        }
        else {

            // Record params
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
                Long range end: ${ p.longitudeRangeEnd }""".stripIndent()

            // If expired
            if (job.expired) {

                replacements << job.dateCreated.dateTimeString
                replacements << paramsString
            }
            else {

                // Job failed
                def errorMessage = job.latestStatus.theErrors

                if (errorMessage) {
                    errorMessage = _prettifyErrorMessage(errorMessage)
                }
                else {
                    errorMessage = job.latestStatus.urlCount ? "Unknown error (URLs found: ${job.latestStatus.urlCount})" : "No URLs found to aggregate. Try broadening the search parameters."
                }

                replacements << errorMessage
                replacements << paramsString
            }
        }

        // Add footer
        replacements << _getEmailFooter()

        return replacements
    }

    def _prettifyErrorMessage(errorMessage) {

        def prettificationEntry = grailsApplication?.config?.aodaacAggregator?.errorLookup?.find {
            errorMessage ==~ it.key
        }

        if (!prettificationEntry) {
            return errorMessage
        }

        return prettificationEntry.value(errorMessage)
    }

    def _getEmailBodyMessageCode(job) {

        def codePart

        if (job.dataFileExists) {

            codePart = 'success'
        }
        else if (job.expired) {

            codePart = 'expired'
        }
        else {

            codePart = 'failed'
        }

        return "${portalInstance.code()}.aodaacJob.notification.email.${codePart}Body"
    }

    def _getEmailFooter() {

        return messageSource.getMessage(
            portalInstance.code() + '.emailFooter', // Instance-specific message code
            [].toArray(), // No replacements
            Locale.getDefault()
        )
    }
}
