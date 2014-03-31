/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

class AodaacJob {

    Date dateCreated

    String jobId
    String notificationEmailAddress
    Boolean expired = false // For jobs that run too long

    Date mostRecentDataFileExistCheck
    Boolean dataFileExists


    static constraints = {
        jobId blank: false
        notificationEmailAddress nullable: true
        mostRecentDataFileExistCheck nullable: true
        dataFileExists nullable: true
    }

    AodaacJob() { /* For Hibernate */ }

    AodaacJob(jobId, notificationEmailAddress) {

        dateCreated = new Date()

        this.jobId = jobId
        this.notificationEmailAddress = notificationEmailAddress
    }

    @Override
    public String toString() {

        return "AodaacJob $jobId"
    }
}
