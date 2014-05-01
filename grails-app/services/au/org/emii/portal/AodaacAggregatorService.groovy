/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.converters.JSON
import org.apache.commons.io.IOUtils

import java.text.SimpleDateFormat

import static au.org.emii.portal.UrlUtils.ensureTrailingSlash

class AodaacAggregatorService {

    static transactional = true

    def grailsApplication
    def messageSource
    def portalInstance

    // Date formats
    static final def FROM_JAVASCRIPT_DATE_FORMATTER = new SimpleDateFormat("yyyy-MM-dd'T'hh:mm:ss.SSS'Z'") // String from UI -> Date Object
    static final def TO_AGGREGATOR_DATE_FORMATTER = new SimpleDateFormat("yyyy-MM-dd'T'hh:mm:ss") // Date Object -> String for AODAAC

    def getProductInfo(productIds) {

        log.debug "Getting Product Info for ids: '$productIds'."

        if (!productIds) {
            return []
        }

        try {
            def aodaacData = _makeApiCall(productDataJavascriptAddress)
            def relevantAoddacDatabase = aodaacData.first()
            def products = relevantAoddacDatabase.'products'

            return products.findAll { productIds.contains(it.id) }
        }
        catch (Exception e) {
            log.warn "Exception occurred while getting AODAAC product info.", e

            return []
        }
    }

    def productIdsForLayer(layer) {

        def productLinks = AodaacProductLink.findAllByLayerNameIlikeAndServer(layer.name, layer.server)

        return productLinks.collect{ it.productId }.unique()
    }

    def createJob(params) {

        log.debug "Creating AODAAC Job. Notication email address: '${params.notificationEmailAddress}'"
        log.debug "params: ${params}"

        def apiCallUrl = jobCreationUrl(
            _creationApiCallArgs(params)
        )
        def response = _makeApiCall(apiCallUrl)

        log.debug "response: $response"

        if (response.error) {
            log.error "Error creating AODAAC job. Call was $apiCallUrl\n Response from system was $response"
            throw new RuntimeException("Error creating AODAAC job. Call was $apiCallUrl\n Response from system was $response")
        }

        def job = new AodaacJob(response.id, params)
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

        log.debug "response: $currentDetails"

        job.setStatus currentDetails.status
        job.save failOnError: true

        if (job.hasEnded()) {

            _sendNotificationEmail(job, currentDetails)
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

        if (_apiCallsDisabled()) {
            throw new IllegalStateException("AODAAC API calls disabled. If testing please mock the service or specific behaviour required.")
        }

        log.debug "API call URL: $apiCallUrl"

        def response = '<not set>'
        try {
            def conn = apiCallUrl.toURL().openConnection()
            conn.connectTimeout = grailsApplication.config.aodaacAggregator.apiCallsConnectTimeout
            conn.readTimeout = grailsApplication.config.aodaacAggregator.apiCallsReadTimeout
            conn.connect()

            response = IOUtils.toString(conn.inputStream, "UTF-8")

            return JSON.parse(response)
        }
        catch (Exception e) {

            log.warn "Call to AODAAC API failed. URL: '$apiCallUrl'. Response: $response", e
            throw e
        }
    }

    def _apiCallsDisabled() {

        !grailsApplication.config.aodaacAggregator.allowApiCalls
    }

    def _dateFromParams(dateStringIn) {
        def date = FROM_JAVASCRIPT_DATE_FORMATTER.parse(dateStringIn)
        return TO_AGGREGATOR_DATE_FORMATTER.format(date)
    }

    void _sendNotificationEmail(job, currentDetails) {

        try {
            log.info "Sending notification email for $job to '${job.notificationEmailAddress}'"

            def emailBody = _getMessage(
                _getEmailBodyMessageCode(job, currentDetails),
                _getEmailBodyReplacements(job, currentDetails)
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

    def _getEmailBodyReplacements(job, currentDetails) {

        def replacements = []

        if (job.failed()) {

            replacements << _prettifyErrorMessage(currentDetails.errors)
        }
        else if (_successButNoData(job, currentDetails)) {

            replacements.addAll _extentsReplacements(job)
        }
        else {

            replacements << _fileList(currentDetails)
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

    def _extentsReplacements(job) {

        def productId = job.productId.toInteger()
        def productExtents = getProductInfo([productId]).extents

        def formatExtents = "Latitude from %s to %s\nLongitude from %s to %s\nDate range from %s to %s"

        return [
            String.format(
                formatExtents,
                job.latitudeRangeStart,
                job.latitudeRangeEnd,
                job.longitudeRangeStart,
                job.longitudeRangeEnd,
                job.dateRangeStart,
                job.dateRangeEnd
            ),
            String.format(
                formatExtents,
                _startOf(productExtents.lat),
                _endOf(productExtents.lat),
                _startOf(productExtents.lon),
                _endOf(productExtents.lon),
                _startOf(productExtents.time),
                _endOf(productExtents.time)
            )
        ]
    }

    def _fileList(details) {

        details.files.collect{ it.toString() }.join("\n")
    }

    def _getEmailBodyMessageCode(job, currentDetails) {

        def codePart = job.status.toString().toLowerCase()

        if (_successButNoData(job, currentDetails)) {
            codePart = 'noData'
        }

        return "${portalInstance.code()}.aodaacJob.notification.email.${codePart}Body"
    }

    def _successButNoData(job, details) {

        return (job.status == AodaacJob.Status.SUCCESS) && !details.files
    }

    def _getMessage(messageCode, replacements = []) {

        messageSource.getMessage(
            messageCode,
            replacements.toArray(),
            Locale.default
        )
    }

    def _startOf(extents) {
        extents[0].first()
    }

    def _endOf(extents) {
        extents[0].last()
    }
}
