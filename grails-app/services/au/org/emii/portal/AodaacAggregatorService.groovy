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

    static final def HTTP_SUCCESS_CODES = 200..299

    // Date formats
    static final def JAVASCRIPT_UI_DATE_OUTPUT_FORMAT = "yyyy-mm-dd'T'hh:mm:ss.SSS'Z'"
    static final def AGGREGATOR_DATE_INPUT_FORMAT = "yyyy-MM-dd'T'hh:mm:ss"
    static final def FROM_JAVASCRIPT_DATE_FORMATTER = new SimpleDateFormat(JAVASCRIPT_UI_DATE_OUTPUT_FORMAT) // 01/02/2012  -> Date Object
    static final def TO_AGGREGATOR_DATE_FORMATTER = new SimpleDateFormat(AGGREGATOR_DATE_INPUT_FORMAT) // Date Object -> 20120201

    def getBaseUrl() {

        ensureTrailingSlash(grailsApplication.config.aodaacAggregator.url)
    }

    def getEnvironment() {

        grailsApplication.config.aodaacAggregator.environment
    }

    def getProductDataJavascriptAddress() {

        "${baseUrl}aodaac/${environment}/products.json"
    }

    def getJobCreationUrl() {
        "${baseUrl}cgi-bin/aodaac.py?site=$environment&task=init"
    }

    def getJobUpdateUrl(job) {
        "${baseUrl}status/$environment/${job.jobId}"
    }

    def getProductInfo(productIds) {

        log.debug "Getting Product Info for ids: '$productIds'. Converting from Javascript to JSON objects."

        // Get the javascript
        def aodaacDataJson = productDataJavascriptAddress.toURL().text
        def aodaacData = JSON.parse(aodaacDataJson).first() // Only first database is used in system currently
        def products = aodaacData.'products'

        return products.findAll { productIds.contains(it.id) }
    }

    def productIdsForLayer(layer) {

        def productLinks = AodaacProductLink.findAllByLayerNameIlikeAndServer(layer.name, layer.server)

        return productLinks.collect{ it.productId }.unique()
    }

    def createJob(notificationEmailAddress, params) {

        log.debug "Creating AODAAC Job. Notication email address: '$notificationEmailAddress'"
        log.debug "params: ${params}"

        def p = JSON.parse("""{
    "layerName":"acorn_hourly_avg_rot_qc_timeseries_url",
    "emailAddress":"dnahodil@gmail.com",
    "subsetDescriptor":{
        "temporalExtent":{"start":"2013-11-01T07:59:59.999Z","end":"2013-11-20T10:30:00.000Z"},
        "spatialExtent":{"north":-31.5537109375,"south":-32.0810546875,"east":116.89453125,"west":113.466796875}
    }
}""")

        def temporalExtent = p.subsetDescriptor.temporalExtent
        def spatialExtent = p.subsetDescriptor.spatialExtent

        def apiCallArgs = [:]

        apiCallArgs.with {
            put 'startdate', _dateFromParams(temporalExtent.start)
            put 'stopdate',  _dateFromParams(temporalExtent.end)
            put 'nlat', spatialExtent.north
            put 'slat', spatialExtent.south
            put 'elon', spatialExtent.east
            put 'wlon', spatialExtent.west
            put 'products', 32
        }

        // Generate url
        def apiCall = UrlUtils.urlWithQueryString(jobCreationUrl, apiCallArgs)

        // Include server/environment
        apiCallArgs.environment = environment
        apiCallArgs.server = baseUrl

        def responseText

        try {
            log.debug "apiCall: $apiCall"

            // Make the call
            responseText = apiCall.toURL().text
            def responseJson = JSON.parse(responseText)

            log.debug "responseJson: $responseJson"

            def jobId = _jobIdFromMonitorUrl(responseJson.url)

            def job = new AodaacJob(jobId, notificationEmailAddress)

            job.save failOnError: true

            return job
        }
        catch (Exception e) {

            log.info "Call to '$apiCall' failed", e
            throw new AodaacException("Unable to create new job (response: '$responseText')", e)
        }
    }

    void updateJob(job) {

        log.debug "Updating job $job"

        if (job.latestStatus?.jobEnded) {

            log.debug "Don't update job as we know if has already ended, but verify presence of result data file"

            // Check if result file exists
            _verifyResultFileExists job

            return
        }

        // Generate url
        def apiCall = getJobUpdateUrl(job)

        try {
            log.debug "apiCall: $apiCall"

            // Make the call
            def response = apiCall.toURL().text

            log.debug "response: $response"

            def updatedStatus = JSON.parse(response)

            updatedStatus.with {
                theErrors = errors // Rename field to match ours
                remove "errors"    // Remove old field (avoids name collisions)
            }

            log.debug "updatedStatus: $updatedStatus"

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

    def checkIncompleteJobs() {
        def jobList = AodaacJob.findAll("from AodaacJob as job where job.expired = false and (job.latestStatus.jobEnded is null or job.latestStatus.jobEnded = false)")

        log.debug "number of jobs: " + jobList.size()

        jobList.each {
            log.debug it
            updateJob it
        }
    }

    // Supporting logic

    def _dateFromParams(dateStringIn) {
        def date = FROM_JAVASCRIPT_DATE_FORMATTER.parse(dateStringIn)
        return TO_AGGREGATOR_DATE_FORMATTER.format(date)
    }

    def _jobIdFromMonitorUrl(url) {
        url.split("/").last()
    }

    void _retrieveResults(job) {

        log.debug "Retrieving results for $job"

        // Generate url
        def apiCall = _aggregatorCommandAddress(COMMAND_GET_DATA, [job.jobId])

        log.debug "apiCall: $apiCall"

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

            log.debug "url: $url"

            def conn = url.openConnection()
            conn.requestMethod = "HEAD"
            conn.connect()

            log.debug "conn.responseCode: ${conn.responseCode}"

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

        if (!(job.latestStatus.jobEnded || job.expired)) {

            log.debug "Will not send notification email for $job which has not ended or expired."
            return
        }

        if (!job.notificationEmailAddress) {

            log.warn "No notification email address, not sending email for $job"
            return
        }

        try {
            log.info "Sending notification email for $job to '${job.notificationEmailAddress}'"

            // Message replacement args
            def args = _getEmailBodyReplacements(job)

            def emailBodyCode = _getEmailBodyMessageCode(job)
            def emailBody = _getMessage(emailBodyCode, args)


            def emailSubject = _getMessage(
                "${portalInstance.code()}.aodaacJob.notification.email.subject",
                [job.jobId]
            )

            sendMail {
                to([job.notificationEmailAddress])
                subject(emailSubject)
                body(emailBody)
                from(grailsApplication.config.portal.systemEmail.fromAddress)
            }
        }
        catch (Exception e) {

            log.error "Unable to notify user (email address: '${job.notificationEmailAddress}') about completion of AODAAC job: $job", e
        }
    }

    def _aggregatorCommandAddress(command, args) {

        "${baseUrl}cgi-bin/IMOS.cgi?$environment,$command,${args.join(',')}"
    }

    def _jobIsTakingTooLong(job) {

        def jobHasMadeProgress = job.latestStatus.urlsComplete > 0

        def duration

        use(groovy.time.TimeCategory) {
            duration = new Date() - job.dateCreated
        }

        def agejobAge = duration.hours + (duration.days * 24)
        def idleJobThreshold = grailsApplication.config.aodaacAggregator.idleJobTimeout
        def jobTooOld = agejobAge >= idleJobThreshold

        def isTakingTooLong = jobTooOld && !jobHasMadeProgress

        log.debug "duration: $duration"
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
        replacements << _getMessage('${portalInstance.code()}.emailFooter')

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

    def _getMessage(messageCode, replacements = []) {

        messageSource.getMessage(
            messageCode,
            replacements.toArray(),
            Locale.default
        )
    }
}
