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
        "${baseUrl}status/$environment/${job.jobId}.json"
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

        def subset = p.subsetDescriptor
        def temporalExtent = subset.temporalExtent
        def spatialExtent = subset.spatialExtent

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

        if (job.hasEnded()) {

            log.info "Don't update job as we know if has already ended"
            return
        }

        // Generate url
        def apiCall = getJobUpdateUrl(job)

        try {
            log.debug "apiCall: $apiCall"

            // Make the call
            def response = apiCall.toURL().text
            log.debug "response: $response"

            def currentDetails = JSON.parse(response)
            log.debug "currentDetails: $currentDetails"

            job.setStatus currentDetails.status
            job.save failOnError: true

            if (job.hasEnded()) {

                def filesReplacement = _linksForFiles(currentDetails.files)

                _sendNotificationEmail(job, [filesReplacement])
            }
        }
        catch (Exception e) {

            log.info "Call to '$apiCall' failed", e
            throw new AodaacException("Unable to update job '$job'", e)
        }
    }

    def checkIncompleteJobs() {

        def endedList = AodaacJob.Status.endedStatuses.collect{"'$it'"}.join(",")
        def jobList = AodaacJob.findAll("from AodaacJob as job where job.status not in ($endedList)")

        log.debug "number of jobs: " + jobList.size()

        jobList.each {
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

    void _sendNotificationEmail(job, replacements = []) {

        if (!job.hasEnded()) {

            log.debug "Will not send notification email for $job which has not ended."
            return
        }

        if (!job.notificationEmailAddress) {

            log.error "No notification email address, not sending email for $job"
            return
        }

        try {
            log.info "Sending notification email for $job to '${job.notificationEmailAddress}'"

            replacements.addAll _getEmailBodyReplacements(job)

            def emailBody = _getMessage(
                _getEmailBodyMessageCode(job),
                replacements
            )

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

    def _getEmailBodyReplacements(job) {

        def replacements = []

        // If successful
        if (job.failed()) {

            // Job failed
            def errorMessage = job.errors

            if (errorMessage) {
                errorMessage = _prettifyErrorMessage(errorMessage)
            }
            else {
                errorMessage = job.urlCount ? "Unknown error" : "No URLs found to aggregate. Try broadening the search parameters."
            }

            replacements << errorMessage
        }

        // Add footer
        replacements << _getMessage("${portalInstance.code()}.emailFooter")

        return replacements
    }

    def _linksForFiles(files) {

        files.collect{ """<a href="$it">$it</a>""" }.join(" ")
    }

    def _prettifyErrorMessage(errorMessage) {

        def prettificationEntry = grailsApplication.config.aodaacAggregator.errorLookup?.find {
            errorMessage ==~ it.key
        }

        if (!prettificationEntry) {
            return errorMessage
        }

        return prettificationEntry.value(errorMessage)
    }

    def _getEmailBodyMessageCode(job) {

        def codePart = job.status.toString().toLowerCase()
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
