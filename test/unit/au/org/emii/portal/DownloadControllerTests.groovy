package au.org.emii.portal

import grails.test.ControllerUnitTestCase
import java.text.DateFormat
import java.util.zip.ZipInputStream
import javax.servlet.http.Cookie
import org.apache.commons.codec.net.URLCodec

class DownloadControllerTests extends ControllerUnitTestCase {
    
    def config
    def mimeTypeJson = "{\"text/html\": \"html\"}"
    def resourcesDir = System.getProperty( "user.dir" ) + "/test/unit/au/org/emii/portal/resources/downloadcontroller"
    
    protected void setUp() {
        
        super.setUp()
        
        config = new Config(
            downloadCartMimeTypeToExtensionMapping: mimeTypeJson,
            downloadCartFilename: "download(%s).zip",
            downloadCartMaxFileSize: 2048,
            downloadCartMaxNumFiles: 3
        )
        
        mockDomain Config, [config]
        mockLogging DownloadController, true
    }

    protected void tearDown() {
        
        super.tearDown()
        
        String.metaClass = null
    }

    void testDownloadFromCart() {
               
        loadCodec(URLCodec)
                
        println ("http://example.com/file1.txt" - "http://example.com/") // REMOVE ME BEFORE COMMIT, YO
        
        String.metaClass.toURL = {
            
            def self = delegate
            
            return [newInputStream: { // new buffered input stream from expected file

                        def filename = self - "http://example.com/"

                        FileInputStream fis = new FileInputStream( "$resourcesDir/$filename" )
                        return new BufferedInputStream( fis )
                    }]
            }
        
        // Configure request
        mockRequest.cookies = [new Cookie("ys-AggregationItems",
                                        """s:[{"href":"http://example.com/file1.txt", title:"File One"},
                                              {"href":"http://example.com/file3.jpeg", title:"File Three"},
                                              {"href":"http://example.com/file2.gif", title:"File Too"}]""")]
        
        // Call action
        controller.downloadFromCart()
        
        // Get ZipInputStream from response
        def zipInStream = new ZipInputStream( new ByteArrayInputStream( mockResponse.getContentAsByteArray() ) )

        // File counts
        def file1Count = 0
        def file2Count = 0
        def file3Count = 0
        def fileReportCount = 0
        def reportData
        
        // Iterate through entries
        def entry
        while ( ( entry = zipInStream.getNextEntry() ) != null) {
            ByteArrayOutputStream baos = new ByteArrayOutputStream()
            byte[] buffer = new byte[1024]
            int count;
            
            while ( ( count = zipInStream.read( buffer ) ) != -1 ) {
                baos.write buffer, 0, count
            }
            
            // File data
            String filename = entry.getName()
            byte[] bytes = baos.toByteArray()

            println "filename: $filename"

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

                case "download report.txt":
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
        
        // Check response paramteres
        def downloadCartFilename = String.format( Config.activeInstance().downloadCartFilename, DateFormat.getDateInstance(DateFormat.MEDIUM, mockRequest.getLocale()).format(new Date()), DateFormat.getTimeInstance(DateFormat.SHORT, mockRequest.getLocale()).format(new Date()) )
        
        assertEquals "Content disposition header", "attachment; filename=$downloadCartFilename", mockResponse.getHeader( "Content-Disposition" )
        assertEquals "Content Type", "application/octet-stream", mockResponse.getContentType()
        
        // Check download report content
        def lineCount = 1
        def reportDataToCheck = ""
        reportData.split("\n").each{
            
            switch ( lineCount ) {
                case 2:
                    reportDataToCheck += it[0..21]
                    break
                
                case 32:
                    reportDataToCheck += it[0..11]
                    break
                
                default:
                    reportDataToCheck += it
            }
           
            reportDataToCheck += "\n"
            lineCount++
        }
        
        assertEquals "'download report.txt' content should match expected", new File( "$resourcesDir/expected download report content.txt").text, reportDataToCheck
    }

    // Todo - DN: Test other added methods
}