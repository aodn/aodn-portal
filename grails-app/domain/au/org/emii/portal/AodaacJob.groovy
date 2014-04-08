/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import static au.org.emii.portal.AodaacJob.Status.*

class AodaacJob {

    enum Status {
        UNKNOWN,
        INITIATED,
        WAITING,
        RUNNING,
        FAILED,
        SUCCESS

        static def endedStatuses = [FAILED, SUCCESS]
    }

    Date dateCreated
    String jobId
    String notificationEmailAddress
    Date statusUpdatedDate
    Status status = UNKNOWN

    static constraints = {
        jobId blank: false
        statusUpdatedDate nullable: true
    }

    AodaacJob() { /* For Hibernate */ }

    AodaacJob(jobId, notificationEmailAddress) {

        dateCreated = new Date()
        status = INITIATED

        this.jobId = jobId
        this.notificationEmailAddress = notificationEmailAddress
    }

    def setStatus(status) {
        this.status = status as Status
        statusUpdatedDate = new Date()
    }

    def failed() {
        status == FAILED
    }

    def hasEnded() {
        endedStatuses.contains(status)
    }

    @Override
    public String toString() {

        return "AodaacJob $jobId (status: $status; updated: $statusUpdatedDate)"
    }
}
