
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.converters.JSON
import grails.test.GrailsUnitTestCase
import org.apache.commons.codec.net.URLCodec

import java.util.zip.ZipInputStream

class BulkDownloadServiceTests extends GrailsUnitTestCase {

    def bulkDownloadService
    def letterMatches = [["A", "B", "C"], ["D", "E", "F"]]
    def nullMatches = [[null, null, null]]

    def filesToDownloadJson = """[
    {
        'uuid': '1111111',
        'name': 'some record',
        'title': 'its really interesting',
        'downloadableLinks': [
            {"href":"http://example.com/file1.txt", title:"File One", type:"text/plain"},
            {"href":"http://example.com/file3.jpeg", title:"File Three", type:"image/jpeg"}
        ]
    },
    {
        'uuid': '22222',
        'name': 'another record',
        'title': 'its really really interesting',
        'downloadableLinks': [
            {"href":"http://example.com/fileX.txt", title:"Non-existent file", type:"text/plain"},
            {"href":"http://example.com/file2.gif", title:"File Two", type:"image/gif"},
            {"href":"http://example.com/file2.gif", title:"File Two (too)", type:"image/gif"}
        ]
    }
]"""

    def resourcesDir = System.getProperty( "user.dir" ) + "/test/unit/au/org/emii/portal/resources/downloadcontroller"

    protected void setUp() {

        super.setUp()

        def cfg = new Config( downloadCartMimeTypeToExtensionMapping: '{"text/xhtml":"html","text/plain":"txt"}',
                              downloadCartMaxNumFiles: 3,
                              downloadCartMaxFileSize: 100000,
                              downloadCartFilename: "filename %s.zip" )

        mockDomain Config, [cfg]
        mockLogging( BulkDownloadService, false )

        bulkDownloadService = new BulkDownloadService()
    }

    protected void tearDown() {

        super.tearDown()

        String.metaClass = null
    }

    void testGetArchiveFilename() {

        def knownDate = new GregorianCalendar( 1900, Calendar.AUGUST, 3, 12, 17 )

        bulkDownloadService.metaClass._currentDate = { -> return knownDate.time }

        assertEquals "filename_3_août_1900-12:17.zip", bulkDownloadService.getArchiveFilename( new Locale( "fr" ) )
    }

    void testGenerateArchiveOfFiles() {

        // Set known date
        def knownDate = new GregorianCalendar( 1900, Calendar.JANUARY, 1, 0, 0 )
        bulkDownloadService.metaClass._currentDate = { -> return knownDate.time }

        // Set time taken
        bulkDownloadService.metaClass._timeTaken = { -> return 15 }

        loadCodec URLCodec

        String.metaClass.toURL = {

            def self = delegate

            return [newInputStream: { // new buffered input stream from expected file

                def filename = self - "http://example.com/"

                FileInputStream fis = new FileInputStream( "$resourcesDir/$filename" )
                return new BufferedInputStream( fis )
            }]
        }

        def filesToDownload = JSON.parse( filesToDownloadJson )

        def responseBaos = new ByteArrayOutputStream()

        bulkDownloadService.generateArchiveOfFiles( filesToDownload, responseBaos, new Locale( "au" ) )

        // Get ZipInputStream from response
        def zipInStream = new ZipInputStream( new ByteArrayInputStream( responseBaos.toByteArray() ) )

        // File counts
        def file1Count = 0
        def file2Count = 0
        def file3Count = 0
        def fileReportCount = 0
        def reportData

        // Iterate through entries
        def entry
        while ( ( entry = zipInStream.getNextEntry() ) != null) {
            def checkBaos = new ByteArrayOutputStream()
            byte[] buffer = new byte[1024]
            int count;

            while ( ( count = zipInStream.read( buffer ) ) != -1 ) {
                checkBaos.write buffer, 0, count
            }

            // File data
            String filename = entry.getName()
            byte[] bytes = checkBaos.toByteArray()

            // Count file entry and check size
            switch ( filename ) {
                case "file1.txt":
                    file1Count++
                    assertEquals "File 1 size", 15, bytes.length
                    break;

                case "file2.gif":
                    file2Count++
                    assertEquals "File 2 size", 877, bytes.length
                    break;

                case "file3.jpeg":
                    file3Count++
                    assertEquals "File 3 size", 634, bytes.length
                    break;

                case "fileX.txt":

                    fail "fileX.txt should not be included in archive"
                    break;

                case "file2(2).gif":

                    fail "file2(2).txt should not be included in archive"
                    break;

                case "download_report.txt":
                    fileReportCount++
                    reportData = new String( bytes )
                    break;

                default:
                    fail "Unknown file entry: $filename"
            }
        }

        assertEquals "File 1 count", 1, file1Count
        assertEquals "File 2 count", 1, file2Count
        assertEquals "File 3 count", 1, file3Count
        assertEquals "Report file count", 1, fileReportCount

        assertEquals "'download_report.txt' content should match expected", new File( "$resourcesDir/expected download report content.txt").text, reportData

    }

    void testExtensionFromMimeType() {

        assertEquals ".html", bulkDownloadService._extensionFromMimeType( "text/xhtml" )
        assertEquals ".txt", bulkDownloadService._extensionFromMimeType( "text/plain" )
        assertEquals "", bulkDownloadService._extensionFromMimeType( "image/gif" )
    }

    void testMakeFilenameUnique() {

        def filename1 = "file"
        def extension1 = ".txt"

        def filename2 = "index"
        def extension2 = ".html"

        assertEquals "file.txt",     bulkDownloadService._makeFilenameUnique( filename1, extension1 )
        assertEquals "file(2).html", bulkDownloadService._makeFilenameUnique( filename1, extension2 )
        assertEquals "file(3).txt",  bulkDownloadService._makeFilenameUnique( filename1, extension1 )
        assertEquals "index.html",   bulkDownloadService._makeFilenameUnique( filename2, extension2 )
        assertEquals "index(2).txt", bulkDownloadService._makeFilenameUnique( filename2, extension1 )
        assertEquals "file(4).txt",  bulkDownloadService._makeFilenameUnique( filename1, extension1 )
        assertEquals "index(3)",     bulkDownloadService._makeFilenameUnique( filename2, "" )
    }

    void testExtractFilenameFromUrl() {

        def url1 = [href: "http://imosmest.aodn.org.au:80/geonetwork/srv/en/file.disclaimer?id=4629&fname=IMOS_SOOP-CO2_GST_20080228T083851Z_SSCO2_fv01_REPORT.doc&a=b&c=d"]
        def url2 = [href: "http://opendap-vpac.arcs.org.au/thredds/fileServer/IMOS/SOOP/SOOP-CO2/VLHJ_Southern-Surveyor/2008/SS2008_V03/IMOS_SOOP-CO2_GST_20080228T083851Z_VLHJ_FV01.nc?a=b"]
        def url3 = [href: "http://opendap-vpac.arcs.org.au/thredds/fileServer/IMOS/SOOP/SOOP-CO2/VLHJ_Southern-Surveyor/2008/SS2008_V03/IMOS_SOOP-CO2_GST_20080228T083851Z_VLHJ_FV02.nc#fragment"]

        def url4 = [href: "http://www.example.com/", type: "text/xhtml"]
        def url5 = [href: "http://www.example.com/a"]
        def url6 = [href: "http://www.example.com/a."]
        def url7 = [href: "http://www.example.com/a.c"]
        def url8 = [href: "http://www.example.com/a.d"]

        bulkDownloadService._extractFilenameFromUrl( url1 )
        bulkDownloadService._extractFilenameFromUrl( url2 )
        bulkDownloadService._extractFilenameFromUrl( url3 )
        bulkDownloadService._extractFilenameFromUrl( url4 )
        bulkDownloadService._extractFilenameFromUrl( url5 )
        bulkDownloadService._extractFilenameFromUrl( url6 )
        bulkDownloadService._extractFilenameFromUrl( url7 )
        bulkDownloadService._extractFilenameFromUrl( url8 )

        assertEquals "IMOS_SOOP-CO2_GST_20080228T083851Z_SSCO2_fv01_REPORT", url1.filenameUsed
        assertEquals "IMOS_SOOP-CO2_GST_20080228T083851Z_VLHJ_FV01", url2.filenameUsed
        assertEquals "IMOS_SOOP-CO2_GST_20080228T083851Z_VLHJ_FV02", url3.filenameUsed
        assertEquals "unnamed_data", url4.filenameUsed
        assertEquals "a", url5.filenameUsed
        assertEquals "a", url6.filenameUsed
        assertEquals "a", url7.filenameUsed
        assertEquals "a", url8.filenameUsed

        assertEquals ".doc", url1.fileExtensionUsed
        assertEquals ".nc", url2.fileExtensionUsed
        assertEquals ".nc", url3.fileExtensionUsed
        assertEquals ".html", url4.fileExtensionUsed
        assertEquals "", url5.fileExtensionUsed
        assertEquals "", url6.fileExtensionUsed
        assertEquals ".c", url7.fileExtensionUsed
        assertEquals ".d", url8.fileExtensionUsed
    }

    void testGetFilenameMatch() {

        assertEquals "B", bulkDownloadService._getFilenameMatch( letterMatches )
        assertEquals null, bulkDownloadService._getFilenameMatch( nullMatches )
    }

    void testGetFileExtensionMatch() {

        assertEquals "C", bulkDownloadService._getFileExtensionMatch( letterMatches )
        assertEquals "", bulkDownloadService._getFileExtensionMatch( nullMatches )
    }

    void testGeoServerDownloadAddress() {

        def testUrl1 = "http://www.google.com/file.disclaimer/a.html"
        def testUrl2 = "http://www.google.com/someDirectory/a.html"

        assertEquals "http://www.google.com/resources.get/a.html${BulkDownloadService.GEONETWORK_DOWNLOAD_DETAILS_QUERY_STRING}", bulkDownloadService._geoServerDownloadAddress( testUrl1 )
        assertEquals testUrl2 + BulkDownloadService.GEONETWORK_DOWNLOAD_DETAILS_QUERY_STRING, bulkDownloadService._geoServerDownloadAddress( testUrl2 ) // Unchanged
    }

    void testIsGeoServerDisclaimerAddress() {

        assertTrue  bulkDownloadService._isGeoServerDisclaimerAddress( "http://imosmest.aodn.org.au:80/geonetwork/srv/en/file.disclaimer?id=4629&fname=IMOS_SOOP-CO2_GST_20080228T083851Z_SSCO2_fv01_REPORT.doc&a=b&c=d" )
        assertFalse bulkDownloadService._isGeoServerDisclaimerAddress( "http://imosmest.aodn.org.au:80/geonetwork/srv/en/resources.get?id=4629&fname=IMOS_SOOP-CO2_GST_20080228T083851Z_SSCO2_fv01_REPORT.doc&a=b&c=d" )
    }

    void testCheckRestrictionAddingFile() {

        bulkDownloadService.numberOfFilesAdded = 0
        bulkDownloadService.totalSizeBeforeCompression = 0

        assertNull bulkDownloadService._getAnyRestrictionsAddingFile()

        bulkDownloadService.numberOfFilesAdded = 3

        assertEquals "Unable to add file, maximum number of files allowed reached (3/3 files)", bulkDownloadService._getAnyRestrictionsAddingFile()

        bulkDownloadService.numberOfFilesAdded = 0
        bulkDownloadService.totalSizeBeforeCompression = 100001

        assertEquals "Unable to add file, maximum size of files allowed reached (100001/100000 Bytes)", bulkDownloadService._getAnyRestrictionsAddingFile()
    }

    void testCurrentDate() {

        def dateBefore
        def dateReturned
        def dateAfter

        dateBefore = new Date()
        dateReturned = bulkDownloadService._currentDate()
        dateAfter = new Date()

        assertTrue dateReturned >= dateBefore
        assertNotNull dateReturned
        assertTrue dateReturned instanceof Date
        assertTrue dateReturned <= dateAfter
    }
}
