package au.org.emii.portal

import grails.test.GrailsUnitTestCase

import java.util.zip.ZipInputStream
import java.util.zip.ZipOutputStream

class BulkDownloadServiceTests extends GrailsUnitTestCase {

    def service

    def resourcesDir = System.getProperty("user.dir") + "/test/unit/au/org/emii/portal/resources/bulkdownloadservice"

    @Override
    protected void setUp() {
        super.setUp()

        mockLogging BulkDownloadService

        service = new BulkDownloadService()
        service.uniqueFilenameGenerator = new UniqueFilenameGenerator()
    }

    @Override
    protected void tearDown() {
        super.tearDown()

        String.metaClass = null
    }

    void testGenerateArchiveOfFiles() {

        def testUrlList = ['url1', 'url2']
        def testStream = new Object()
        def testLocale = new Object()

        def createZipStreamCalledCount = 0
        def writeFilesToStreamCalledCount = 0
        def closeStreamCalledCount = 0

        service._createZipStream = { outputStream ->
            assertEquals testStream, outputStream
            createZipStreamCalledCount++
        }
        service._writeFilesToStream = { urlList ->
            assertEquals testUrlList, urlList
            writeFilesToStreamCalledCount++
        }
        service._closeStream = { ->
            closeStreamCalledCount++
        }

        service.generateArchiveOfFiles testUrlList, testStream, testLocale

        assertTrue service.report instanceof DownloadReport
        assertEquals testLocale, service.report.locale
        assertEquals 1, createZipStreamCalledCount
        assertEquals 1, writeFilesToStreamCalledCount
        assertEquals 1, closeStreamCalledCount
    }

    void testGenerateArchiveOfFilesWithException() {

        def testUrlList = new Object()
        def testStream = new Object()
        def testLocale = new Object()

        def createZipStreamCalledCount = 0
        def writeFilesToStreamCalledCount = 0
        def closeStreamCalledCount = 0

        service._createZipStream = { outputStream ->
            assertEquals testStream, outputStream
            createZipStreamCalledCount++
            throw new Exception("For testing")
        }
        service._writeFilesToStream = { urlList ->
            writeFilesToStreamCalledCount++
        }
        service._closeStream = { ->
            closeStreamCalledCount++
        }

        try {
            service.generateArchiveOfFiles testUrlList, testStream, testLocale
            fail "Should have thrown Exception"
        }
        catch(Exception e) {
        }

        assertTrue service.report instanceof DownloadReport
        assertEquals testLocale, service.report.locale
        assertEquals 1, createZipStreamCalledCount
        assertEquals 0, writeFilesToStreamCalledCount
        assertEquals 1, closeStreamCalledCount
    }

    void testCreateZipStream() {

        assertNull service.zipStream

        service._createZipStream new ByteArrayOutputStream()

        assertNotNull service.zipStream
        assertTrue service.zipStream instanceof ZipOutputStream
    }

    void testWriteFilesToStream() {

        def urlList = [
            'http://imos.org.au/',
            'http://www.csiro.au'
        ]
        def remainingUrlsList = []
        remainingUrlsList.addAll urlList

        def addDownloadReportToArchviveCalledCount = 0
        def addFileEntryCalledCount = 0

        service._addDownloadReportToArchive = {
            addDownloadReportToArchviveCalledCount++
        }
        service._addFileEntry = { url ->
            addFileEntryCalledCount++
            remainingUrlsList = remainingUrlsList - url
        }

        assertEquals 2, remainingUrlsList.size()

        service._writeFilesToStream urlList

        assertEquals 2, addFileEntryCalledCount
        assertEquals 0, remainingUrlsList.size()
        assertEquals 1, addDownloadReportToArchviveCalledCount
    }

    void testCloseStream() {

        def closedCallCount = 0
        service.zipStream = [
            close: { -> closedCallCount++ }
        ]

        service._closeStream()

        assertEquals 1, closedCallCount
    }

    void testAddFileEntry() {

        service._uniqueFilenameForUrl = { it }

        def file1 = "grails_logo.png"
        def file2 = "test.txt"
        def file3 = "non_existent.txt"
        def file3InDownload = file3 + '.failed'

        def successfulEntries = 0
        def failedEntries = 0
        service.report = [
            addSuccessfulFileEntry: { url, filename, size -> successfulEntries++ },
            addFailedFileEntry: { url, filename, result ->
                failedEntries++
                assertEquals file3, url
                assertEquals file3InDownload, filename
                assertTrue result.contains(url) // The result shoudl explain we can't get data form the URL
            }
        ]

        // Have files load locally for testing rather than via URL
        String.metaClass.toURL = {
            def self = delegate
            return [newInputStream: {
                new FileInputStream("$resourcesDir/$self")
            }]
        }

        def responseStream = new ByteArrayOutputStream()
        service._createZipStream(responseStream)
        service._addFileEntry file1
        service._addFileEntry file2
        service._addFileEntry file3

        assertZipEntriesValid(
            responseStream,
            [
                [name: file1, size: 10172],
                [name: file2, size: 19],
                [name: file3InDownload, size: 0]
            ]
        )

        assertEquals 2, successfulEntries
        assertEquals 1, failedEntries

        responseStream.close()
        service._closeStream()
    }

    void testAddFileEntryInvalidUrl() {

        def testFile = 'invalid URL'

        service.report = [
            addSuccessfulFileEntry: { url, filename, size -> fail "Should not get called" },
            addFailedFileEntry: { url, filename, result ->
                assertTrue result.contains(url)
            }
        ]

        def responseStream = new ByteArrayOutputStream()
        service._createZipStream(responseStream)
        service._addFileEntry testFile
        service._addFileEntry testFile

        assertZipEntriesValid(
            responseStream,
            [
                [name: 'file.failed', size: 0],
                [name: 'file(2).failed', size: 0]
            ]
        )

        responseStream.close()
        service._closeStream()
    }

    void testUniqueFilenameForUrl() {

        def testUrl = "URL"
        def testFilename = "filename"
        def testExtension = "extension"
        def uniqueFilename = "unique"

        service._filenamePartsFromUrl = { url ->
            assert testUrl, url
            return [testFilename, testExtension]
        }

        def generateUniqueFilenameCalledCount = 0
        service.uniqueFilenameGenerator = [
            generateUniqueFilename: { filename, extension ->
                assertEquals testFilename, filename
                assertEquals testExtension, extension
                generateUniqueFilenameCalledCount++
                return uniqueFilename
            }
        ]

        def filenameReturned
        filenameReturned = service._uniqueFilenameForUrl(testUrl)

        assertEquals uniqueFilename, filenameReturned
        assertEquals 1, generateUniqueFilenameCalledCount
    }

    void testFilenamePartsFromUrl() {

        def (filename, extension) = service._filenamePartsFromUrl("http://www.google.com/a.gif")

        assertEquals "a", filename
        assertEquals ".gif", extension

        (filename, extension) = service._filenamePartsFromUrl("http://www.google.com/b")

        assertEquals "b", filename
        assertEquals "", extension
    }

    void testAddDownloadReportToArchive() {

        def testLocale = new Locale("ENGLISH")

        service.report = new DownloadReport(testLocale)
        def expectedSize = service.report._header().length() + service.report._footer().length()
        def responseStream = new ByteArrayOutputStream()
        service._createZipStream(responseStream)

        service._addDownloadReportToArchive()

        assertZipEntriesValid(
            responseStream,
            [[name: service.report.ZIP_FILE_NAME, size: expectedSize]]
        )
        service._closeStream()
    }

    static void assertZipEntriesValid(responseStream, expectedFiles) {

        def zipInStream = new ZipInputStream(new ByteArrayInputStream(responseStream.toByteArray()))

        // Iterate through entries
        def entry
        while ((entry = zipInStream.nextEntry) != null) {

            def checkStream = new ByteArrayOutputStream()
            checkStream << zipInStream

            // File data
            String filename = entry.name
            byte[] bytes = checkStream.toByteArray()

            def expectedFile = expectedFiles.find { it.name == filename }
            if (expectedFile) {
                countExpectedFile(expectedFile)
                assertEquals expectedFile.size, bytes.length
            }
            else {
                fail "Not expecting file: $filename"
            }
        }

        expectedFiles.each {
            assertEquals "${it.name} should have been found exactly once.", 1, it.timesFound ?: 0
        }
    }

    static void countExpectedFile(expectedFile) {

        if (!expectedFile.timesFound) {
            expectedFile.timesFound = 0
        }

        expectedFile.timesFound += 1
    }
}
