package au.org.emii.portal

import grails.test.*
import grails.converters.JSON
import org.codehaus.groovy.grails.web.json.*
import au.org.emii.portal.Config
import javax.servlet.http.*
import org.apache.commons.codec.net.URLCodec
import java.util.zip.*
import java.text.DateFormat

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
        mockLogging(DownloadController, true)
    }

    protected void tearDown() {
        super.tearDown()
    }

    void testDownloadFromCart() {
               
        loadCodec(URLCodec)
                
        String.metaClass.toURL = {
            
            def self = delegate
            
            return [newInputStream: { // new buffered input stream from expected file
                    
                        FileInputStream fis = new FileInputStream( "$resourcesDir/$self" )
                        return new BufferedInputStream( fis )
                    }]
            }
        
        // Configure request
        mockRequest.cookies = [new Cookie("ys-AggregationItems",
                                          "s:[{\"href\":\"file1.txt\",\"title\":\"File One\"}," + \
                                             "{\"href\":\"file3.jpeg\",\"title\":\"File Three\"}," + \
                                             "{\"href\":\"file2.gif\",\"title\":\"File Too\"}]")]
        
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
            
            // Count file entry and check size
            switch ( filename ) {
                case "File One.txt":
                    file1Count++
                    assertEquals "File 1 size", 15, bytes.length
                    break;
                              
                case "File Too.gif":
                    file2Count++
                    assertEquals "File 2 size", 877, bytes.length
                    break;
                    
                case "File Three.jpeg":
                    file3Count++
                    assertEquals "File 3 size", 634, bytes.length
                    break;
                    
                case "download report.txt":
                    fileReportCount++
                    reportData = new String( bytes )
                    break;
                    
                default:
                    assertTrue "Unknown file entry $filename", false
            }
         }
        
        assertEquals "File 1 count", 1, file1Count
        assertEquals "File 2 count", 1, file2Count
        assertEquals "File 3 count", 1, file3Count
        assertEquals "Report file count", 1, fileReportCount
        
        // Check response paramteres
        def downloadCartFilename = String.format( Config.activeInstance().downloadCartFilename, DateFormat.getDateInstance(DateFormat.LONG, mockRequest.getLocale()).format(new Date()) )
        
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
            
        println reportDataToCheck
        
        assertEquals "'download report.txt' content should match expected", new File( "$resourcesDir/expected download report content.txt").text, reportDataToCheck
    }
        
    void testExtensionFromUrlAndType() {
        
        assertEquals "Extension should be 'xml'",  "xml",  controller.extensionFromUrlAndType("someFile.xml", "text/html" /* ignored */ )
        assertEquals "Extension should be 'jpeg'", "jpeg", controller.extensionFromUrlAndType("someFile.jpeg", "text/xml" /* ignored */ )
        assertEquals "Extension should be 'html'", "html", controller.extensionFromUrlAndType("someFile", "text/html" )
        assertEquals "Extension should be ''",     "",     controller.extensionFromUrlAndType("someFile", "text/xml" )
    }
    
    void testMappings() {
        
        assertEquals "Mapping() should return JSONObject from config", JSONObject, controller.mapping().getClass()
        assertEquals "Mapping() should return JSONObject from config", JSON.parse(mimeTypeJson), controller.mapping()
    }
}