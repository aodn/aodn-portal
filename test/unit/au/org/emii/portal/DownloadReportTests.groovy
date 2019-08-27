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

    void testAddSuccessfulFileEntry() {

        def testUrl = "URL"
        def testFilename = "Filename"
        def testSize = 2048

        report._makeFileEntry = { url, filename, result ->

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

        report._makeFileEntry = { url, filename, result ->

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

        def header = report.reportTempFile.getText()

        report._addFileEntry(report._makeFileEntry("url", "filename", "went well"))

        assertEquals 1, report.numberOfFilesTried

        def entry =  """\
            --[ #1 ]------------------------------------
            URL:                 url
            Filename in archive: filename
            Result:              went well
            """.stripIndent()

        assertEquals """$header\n$entry""", report.reportTempFile.getText()
    }

    void testTimeTaken() {

        report.reportStart = new Date(2000)
        report._currentDate = { new Date(4000) }

        assertEquals "2.000 seconds", report._timeTaken().toString()
    }
}
