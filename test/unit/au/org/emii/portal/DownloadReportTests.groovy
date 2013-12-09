/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.test.GrailsUnitTestCase

class DownloadReportTests extends GrailsUnitTestCase {

    def report

    @Override
    protected void setUp() {
        super.setUp()

        def testLocale = new Locale("fr")
        report = new DownloadReport(testLocale)
    }

    @Override
    protected void tearDown() {
        super.tearDown()
    }

    void testAddSuccessfulFileEntry() {

        def testUrl = "URL"
        def testFilename = "Filename"
        def testSize = 2048

        report._addFileEntry = { url, filename, result ->

            assertEquals testUrl, url
            assertEquals testFilename, filename
            assertEquals "File added (2048 Bytes)", result
        }

        assertEquals 0, report.numberOfFilesAdded
        assertEquals 0, report.sizeOfFilesAdded

        report.addSuccessfulFileEntry testUrl, testFilename, testSize

        assertEquals 1, report.numberOfFilesAdded
        assertEquals 2048, report.sizeOfFilesAdded
    }

    void testAddFailedFileEntry() {

        def testUrl = "URL"
        def testFilename = "Filename"
        def testResult = "Borken"

        report._addFileEntry = { url, filename, result ->

            assertEquals testUrl, url
            assertEquals testFilename, filename
            assertEquals testResult, result
        }

        assertEquals 0, report.numberOfFilesAdded
        assertEquals 0, report.sizeOfFilesAdded

        report.addFailedFileEntry testUrl, testFilename, testResult

        assertEquals 0, report.numberOfFilesAdded
        assertEquals 0, report.sizeOfFilesAdded
    }

    void testAddFileEntry() {

        assertEquals 0, report.numberOfFilesTried
        assertEquals "", report.reportBody

        report._addFileEntry "url", "filename", "went well"

        assertEquals 1, report.numberOfFilesTried
        assertEquals """\
            --[ #1 ]------------------------------------
            URL:                 url
            Filename in archive: filename
            Result:              went well
            """.stripIndent(),
            report.reportBody
    }

    void testGetText() {

        report._currentDate = { new GregorianCalendar(1900, Calendar.AUGUST, 3, 12, 17).time }
        report.reportBody = "report body"
        report.sizeOfFilesAdded = 1024
        report.numberOfFilesAdded = 8
        report.numberOfFilesTried = 10
        report._timeTaken = { "the duration" }

        def reportText = report.text

        assertTrue reportText.contains("Download cart report (3 août 1900 12:17)") // Locale is FR
        assertTrue reportText.contains("report body")
        assertTrue reportText.contains("Size of all files: 1024 Bytes")
        assertTrue reportText.contains("Number of files included: 8/10")
        assertTrue reportText.contains("Time taken: the duration")
    }

    void testTimeTaken() {

        report._currentDate = { new Date(0) }
        report.reportStart = new Date(2000)

        assertEquals "2.000 seconds", report._timeTaken().toString()
    }
}
