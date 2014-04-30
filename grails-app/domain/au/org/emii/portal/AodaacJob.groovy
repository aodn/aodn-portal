/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.converters.JSON

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

    static final def paramsToStore = ['productId', 'latitudeRangeStart', 'latitudeRangeEnd', 'longitudeRangeStart', 'longitudeRangeEnd', 'dateRangeStart', 'dateRangeEnd']

    Date dateCreated
    String jobId
    String parameters
    String notificationEmailAddress
    Date statusUpdatedDate
    Status status = UNKNOWN

    static constraints = {
        jobId blank: false
        parameters nullable: true
        statusUpdatedDate nullable: true
    }

    static mapping = {
        parameters type: 'text'
    }

    AodaacJob() { /* For Hibernate */ }

    AodaacJob(jobId, params) {

        dateCreated = new Date()
        status = INITIATED

        this.jobId = jobId
        this.parameters = params.subMap(paramsToStore) as JSON
        this.notificationEmailAddress = params.notificationEmailAddress
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

    @Override
    public String toString() {

        return "AodaacJob $jobId (status: $status; updated: $statusUpdatedDate)"
    }
}
