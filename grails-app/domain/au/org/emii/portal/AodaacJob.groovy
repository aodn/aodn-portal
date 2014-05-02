/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import static au.org.emii.portal.AodaacAggregatorService.FROM_JAVASCRIPT_DATE_FORMATTER as dateFormatter
import static au.org.emii.portal.AodaacJob.Status.*

class AodaacJob {

    enum Status {
        UNKNOWN,
        INITIATED,
        WAITING,
        RUNNING,
        FAIL,
        SUCCESS

        static def endedStatuses = [FAIL, SUCCESS]
    }

    String productId
    Double latitudeRangeStart
    Double latitudeRangeEnd
    Double longitudeRangeStart
    Double longitudeRangeEnd
    Date dateRangeStart
    Date dateRangeEnd
    String notificationEmailAddress

    Date dateCreated
    String jobId
    Date statusUpdatedDate
    Status status = UNKNOWN

    static constraints = {
        productId blank: false
        jobId blank: false
        statusUpdatedDate nullable: true
    }

    AodaacJob() { /* For Hibernate */ }

    AodaacJob(jobId, params) {

        dateCreated = new Date()
        status = INITIATED

        this.jobId = jobId

        productId = params.productId
        latitudeRangeStart = params.latitudeRangeStart.toDouble()
        latitudeRangeEnd = params.latitudeRangeEnd.toDouble()
        longitudeRangeStart = params.longitudeRangeStart.toDouble()
        longitudeRangeEnd = params.longitudeRangeEnd.toDouble()
        dateRangeStart = dateFormatter.parse(params.dateRangeStart)
        dateRangeEnd = dateFormatter.parse(params.dateRangeEnd)
        notificationEmailAddress = params.notificationEmailAddress
    }

    def setStatus(status) {
        this.status = status as Status
        statusUpdatedDate = new Date()
    }

    def failed() {
        status == FAIL
    }

    def hasEnded() {
        endedStatuses.contains(status)
    }

    def succeededWithNoData(result) {

        status == SUCCESS && !result.files
    }

    @Override
    public String toString() {

        return "AodaacJob $jobId (status: $status; updated: $statusUpdatedDate)"
    }
}
