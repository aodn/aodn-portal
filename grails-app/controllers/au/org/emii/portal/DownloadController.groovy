package au.org.emii.portal

import grails.converters.JSON
import org.codehaus.groovy.grails.web.json.*
import java.text.DateFormat
import java.util.zip.*
import org.springframework.util.StopWatch

class DownloadController {

    private static int BufferSize = 4096 // 4kB
    
    def downloadFromCart = {
        
        def startTime = System.currentTimeMillis()
        def config = Config.activeInstance()
        def todaysDate = DateFormat.getDateInstance(DateFormat.LONG, request.getLocale()).format(new Date())
        def filename = String.format(config.downloadCartFilename, todaysDate)
        def reportText = """\
============================================\r\n
Download cart report (${todaysDate})\r\n
============================================\r\n
\r\n
"""
        
        def jsonInput = "[{title: \"Tomcat\", href: \"http://localhost:8081/img1.gif\"}," +
                        " {title: \"Rage\",  href: \"http://localhost:8081/img%203.jpg\"}," + // img3.jpg
                        " {title: \"Facebook\",  href: \"http://s-static.ak.facebook.com/rsrc.php/v1/yv/r/mTnxuar3oIS.png\"}," +
                        " {title: \"Rhino\",   href: \"http://localhost:8081/img%20too.jpg\"}]" // image too.jpg
        
        def arrayFromJson = JSON.parse(jsonInput)
       
        println "Cookies: ${request.cookies.size()}"
        request.cookies.find{ it.getName() == "ys-AggregationItems" }.each{println "Cookie: " + it.getValue().decodeURL()}
        
        // Prepare response stream and create zip stream
        response.setHeader("Content-Disposition", "attachment; filename=${filename}")
        response.contentType = "application/octet-stream"
        ZipOutputStream zipOut = new ZipOutputStream(response.outputStream)
        
        def numberOfRowsProcessed = 0
        def numberOfFilesAdded = 0
        def bytesAddedForThisFile = 0
        def totalSizeBeforeCompression = 0
        arrayFromJson.each({
            
            if ( numberOfFilesAdded > config.downloadCartMaxNumFiles ) {

                reportText += "Unable to add file, maximum number of files allowed reached (${config.downloadCartMaxNumFiles})"
            }
            else if ( totalSizeBeforeCompression > config.downloadCartMaxFileSize ) {
                
                reportText += "Unable to add file, maximum size of files allowed reached (${config.totalSizeBeforeCompression} Bytes before compression)"
            }
            else {
                bytesAddedForThisFile = addToZip( zipOut, it )
                
                if (bytesAddedForThisFile > 0) {

                    numberOfFilesAdded++
                    reportText += "File added"
                    totalSizeBeforeCompression += bytesAddedForThisFile
                }
                else {
                    reportText += "Unknown error adding file"
                }
            }
            
            reportText += " -- '${it.title}' from ${it.href}\r\n"
                    
            numberOfRowsProcessed++
        })
                        
        
        reportText += """\r\n
============================================\r\n
Total size before compression: ${totalSizeBeforeCompression} Bytes\r\n
Number of files included: ${numberOfFilesAdded}/${numberOfRowsProcessed}\r\n
Time taken: ${(System.currentTimeMillis() - startTime) / 1000} seconds\r\n
============================================
"""
        
        // Add report to zip file
        def reportEntry = new ZipEntry("report.txt")
        zipOut.putNextEntry(reportEntry)
        byte[] reportData = reportText.getBytes("UTF-8")
        zipOut.write(reportData, 0, reportData.length)
        zipOut.closeEntry()
        
        // Close file
        zipOut.close()
        
        // Respond with file

        response.outputStream.flush()
    }
    
    private long addToZip(ZipOutputStream zipOut, JSONObject info) {
        println "-" * 48
        println "Adding '${info.title}' from ${info.href}"

        def buffer = new byte[BufferSize]        
        def requestUrl = info.href.toURL()
        def con = requestUrl.openConnection()
        def type = con.contentType
        
        println "info.type: ${info.type}"
        println "type:      ${type}"
        
        // Add to zip
        def bytesRead
        long totalBytesRead = 0
        def dataFromUrl
        try {
            dataFromUrl = requestUrl.newInputStream()
            
            def newEntry = new ZipEntry("${info.title}.${info.href[-3..-1]}") // Extension ??
            zipOut.putNextEntry(newEntry)
            
            while ((bytesRead = dataFromUrl.read( buffer )) != -1) {

                zipOut.write( buffer, 0, bytesRead )
                totalBytesRead += bytesRead
            }

            zipOut.closeEntry()
        }
        catch(IOException ioe) {
            println "ioe: ${ioe}"
        }
        
        println "totalBytesRead: ${totalBytesRead}"
        
        if (dataFromUrl) {
            dataFromUrl.close()
        }
        
        return totalBytesRead
    }
}