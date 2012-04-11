package au.org.emii.portal

import grails.converters.JSON
import grails.test.ControllerUnitTestCase
import org.codehaus.groovy.grails.plugins.codecs.URLCodec

import javax.servlet.http.Cookie

class DownloadControllerTests extends ControllerUnitTestCase {
    
    def config
    def mimeTypeJson = "{\"text/html\": \"html\"}"

    
    protected void setUp() {
        
        super.setUp()
    }

    protected void tearDown() {
        
        super.tearDown()
    }

    void testDownloadFromCartNoCookies() {

        mockRequest.cookies = null

        controller.downloadFromCart()

        assertEquals "No data to download", mockResponse.contentAsString
        // assertEquals 500, mockResponse.status // There is a bug in Grails testing code where response is always 200
    }

    void testDownloadFromCartWithCookies() {

        loadCodec URLCodec

        def jsonInCookie = """\
[{"href":"http://example.com/file1.txt", title:"File One"},\
 {"href":"http://example.com/file3.jpeg", title:"File Three"},\
 {"href":"http://example.com/file2.gif", title:"File Too"}]"""

        def expectedJsonArray = JSON.parse( jsonInCookie )

        controller.bulkDownloadService = [
            generateArchiveOfFiles: {
                jsonArray, outputStream, locale ->

                assertEquals expectedJsonArray, jsonArray
                assertEquals mockResponse.outputStream, outputStream
            },
            getArchiveFilename: {
                locale ->

                return "filename.zip"
            }
        ]

        // Set up mock request
        mockRequest.cookies = [new Cookie("ys-AggregationItems","s:$jsonInCookie")]

        controller.downloadFromCart()

        // Check response properties
        assertEquals "Content disposition header", "attachment; filename=filename.zip", mockResponse.getHeader( "Content-Disposition" )
        assertEquals "Content Type", "application/octet-stream", mockResponse.getContentType()
    }
}