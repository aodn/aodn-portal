/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */


package au.org.emii.portal

import grails.test.*

import static au.org.emii.portal.AodaacJob.Status.*

class AodaacJobTests extends GrailsUnitTestCase {

    void testConstructor() {

        def testParams = [
            productId: '1',
            latitudeRangeStart: '-90.0',
            latitudeRangeEnd: '90.0',
            longitudeRangeStart: '-180.0',
            longitudeRangeEnd: '180.0',
            dateRangeStart: "2001-04-21T00:34:11.000Z",
            dateRangeEnd: "2012-05-22T11:45:55.000Z",
            notificationEmailAddress: 'john@example.com'
        ]

        AodaacJob job = new AodaacJob('job_id', testParams)

        assertNotNull job.dateCreated
        assertEquals Date, job.dateCreated.getClass()
        assertEquals INITIATED, job.status
        assertEquals 'job_id', job.jobId

        assertEquals '1', job.productId
        assertEquals( -90.0d, job.latitudeRangeStart)
        assertEquals   90, job.latitudeRangeEnd
        assertEquals( -180.0d, job.longitudeRangeStart)
        assertEquals   180, job.longitudeRangeEnd
        assertEquals new GregorianCalendar(2001, 3, 21, 0, 34, 11).time, job.dateRangeStart
        assertEquals new GregorianCalendar(2012, 4, 22, 11, 45, 55).time, job.dateRangeEnd
        assertEquals 'john@example.com', job.notificationEmailAddress
    }
}
