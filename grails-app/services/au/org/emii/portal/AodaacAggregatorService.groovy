/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.converters.JSON
import java.text.SimpleDateFormat

import static au.org.emii.portal.UrlUtils.ensureTrailingSlash

class AodaacAggregatorService {

    static transactional = true

    def grailsApplication
    def messageSource
    def portalInstance

    // Date formats
    static final def JAVASCRIPT_UI_DATE_OUTPUT_FORMAT = "yyyy-MM-dd'T'hh:mm:ss.SSS'Z'"
    static final def AGGREGATOR_DATE_INPUT_FORMAT = "yyyy-MM-dd'T'hh:mm:ss"
    static final def FROM_JAVASCRIPT_DATE_FORMATTER = new SimpleDateFormat(JAVASCRIPT_UI_DATE_OUTPUT_FORMAT) // 01/02/2012  -> Date Object
    static final def TO_AGGREGATOR_DATE_FORMATTER = new SimpleDateFormat(AGGREGATOR_DATE_INPUT_FORMAT) // Date Object -> 20120201

    def getProductInfo(productIds) {

        log.debug "Getting Product Info for ids: '$productIds'."

        if (!productIds) {
            return []
        }

        def aodaacData = _makeApiCall(productDataJavascriptAddress)
        def relevantAoddacDatabase = aodaacData.first()
        def products = relevantAoddacDatabase.'products'

        return products.findAll { productIds.contains(it.id) }
    }

    def productIdsForLayer(layer) {

        def productLinks = AodaacProductLink.findAllByLayerNameIlikeAndServer(layer.name, layer.server)

        return productLinks.collect{ it.productId }.unique()
    }

    def createJob(notificationEmailAddress, params) {

        log.debug "Creating AODAAC Job. Notication email address: '$notificationEmailAddress'"
        log.debug "params: ${params}"

        def apiCallUrl = jobCreationUrl(
            _creationApiCallArgs(params)
        )
        def response = _makeApiCall(apiCallUrl)

        if (response.error) {
            log.error "Error creating AODAAC job. Call was $apiCallUrl\n Response from system was $response"
            throw new RuntimeException("Error creating AODAAC job. Call was $apiCallUrl\n Response from system was $response")
        }

        def job = new AodaacJob(response.id, notificationEmailAddress)
        job.save failOnError: true

        return job
     }

    void updateJob(job) {

        if (job.hasEnded()) {

            log.info "Don't update $job as we know it has already ended"
            return
        }

        log.debug "Updating job $job"

        def currentDetails = _makeApiCall(
            jobUpdateUrl(job)
        )

        job.setStatus currentDetails.status
        job.save failOnError: true

        if (job.hasEnded()) {

            def filesReplacement = currentDetails.files.join("\n")

            _sendNotificationEmail(job, [filesReplacement])
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

    // URLs

    def getBaseUrl() {

        ensureTrailingSlash(grailsApplication.config.aodaacAggregator.url)
    }

    def getEnvironment() {

        grailsApplication.config.aodaacAggregator.environment
    }

    def getProductDataJavascriptAddress() {

        "${baseUrl}aodaac/${environment}/products.json"
    }

    def jobCreationUrl(apiCallArgs) {

        UrlUtils.urlWithQueryString(
            "${baseUrl}cgi-bin/aodaac.py?site=$environment&task=init",
            apiCallArgs
        )
    }

    def jobUpdateUrl(job) {
        "${baseUrl}status/$environment/${job.jobId}.json"
    }

    // Supporting logic

    def _creationApiCallArgs(params) {

        [
            'startdate': _dateFromParams(params.dateRangeStart),
            'stopdate':  _dateFromParams(params.dateRangeEnd),
            'nlat': params.latitudeRangeEnd,
            'slat': params.latitudeRangeStart,
            'elon': params.longitudeRangeEnd,
            'wlon': params.longitudeRangeStart,
            'products': params.productId
        ]
    }

    def _makeApiCall(apiCallUrl) {

        try {
            log.debug "API call URL: $apiCallUrl"

            // Make the call
            def response = apiCallUrl.toURL().text
            log.debug "response: $response"

            return JSON.parse(response)
        }
        catch (Exception e) {

            log.info "Call to AODAAC API failed. URL: '$apiCallUrl'", e
            throw e
        }
    }

    def _dateFromParams(dateStringIn) {
        def date = FROM_JAVASCRIPT_DATE_FORMATTER.parse(dateStringIn)
        return TO_AGGREGATOR_DATE_FORMATTER.format(date)
    }

    void _sendNotificationEmail(job, replacements = []) {

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

            replacements << _prettifyErrorMessage(job.errors)
        }

        // Add footer
        replacements << _getMessage("${portalInstance.code()}.emailFooter")

        return replacements
    }

    def _prettifyErrorMessage(errorMessage) {

        def errorPrettifiers = grailsApplication.config.aodaacAggregator.errorLookup

        def prettifier = errorPrettifiers?.find {
            errorMessage ==~ it.key
        }

        return prettifier?.value(errorMessage) ?: "Unknown error"
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
