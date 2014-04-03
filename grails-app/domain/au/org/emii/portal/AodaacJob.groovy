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
        NEW,
        SENT,
        WAITING,
        RUNNING,
        FAILED,
        SUCCESS

        static def getEndedStatuses() {
            [FAILED, SUCCESS]
        }
    }

    Date dateCreated
    String jobId
    String notificationEmailAddress
    Date statusUpdatedDate
    Status status
    String files

    static constraints = {
        jobId blank: false
        statusUpdatedDate nullable: true
        files nullable: true
    }

    static mapping = {
        files type: "text"
    }

    AodaacJob() { /* For Hibernate */ }

    AodaacJob(jobId, notificationEmailAddress) {

        dateCreated = new Date()

        this.jobId = jobId
        this.notificationEmailAddress = notificationEmailAddress
        status = NEW
    }

    def wasSuccessful() {
        status == SUCCESS
    }

    def hasEnded() {
        Status.endedStatuses.contains(status)
    }

    @Override
    public String toString() {

        return "AodaacJob $jobId (status: $status; updated: $statusUpdatedDate)"
    }
}
