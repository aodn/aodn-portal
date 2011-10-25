package au.org.emii.portal

import grails.converters.JSON
import org.codehaus.groovy.grails.web.json.*
import java.text.DateFormat
import java.util.zip.*
import org.springframework.util.StopWatch

class DownloadController {

    private static int BufferSize = 4096 // 4kB
    private static String CookieName = "ys-AggregationItems"
    private static String CookieDataPrefix = "s:"
    
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
        
        // Print cookie debug info
        if ( log.isDebugEnabled() ) {
            log.debug( "Cookies: ${request.cookies.size()}" )    
            request.cookies.find{
                it.getName() == CookieName
            }.each{
                log.debug "Cookie: " + it.getValue().decodeURL()
            }
        }
        
        // Read data from cookie
        def jsonArray
        def jsonData = "[]"
        request.cookies.find{
                it.getName() == CookieName
            }.each{
                    
                jsonData = it.getValue().decodeURL()

                jsonData = jsonData[CookieDataPrefix.length()..-1] // Trim data prefix

                log.debug jsonData
            }
        jsonArray = JSON.parse(jsonData)
        
        // Prepare response stream and create zip stream
        response.setHeader("Content-Disposition", "attachment; filename=${filename}")
        response.contentType = "application/octet-stream"
        ZipOutputStream zipOut = new ZipOutputStream(response.outputStream)
        
        def numberOfRowsProcessed = 0
        def numberOfFilesAdded = 0
        def bytesAddedForThisFile = 0
        def totalSizeBeforeCompression = 0
        jsonArray.each({
            
            if ( numberOfFilesAdded >= config.downloadCartMaxNumFiles ) {

                reportText += "Unable to add file, maximum number of files allowed reached (${numberOfFilesAdded}/${config.downloadCartMaxNumFiles} files)"
            }
            else if ( totalSizeBeforeCompression >= config.downloadCartMaxFileSize ) {
                
                reportText += "Unable to add file, maximum size of files allowed reached (${totalSizeBeforeCompression}/${config.downloadCartMaxFileSize} Bytes)"
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
        def reportEntry = new ZipEntry("download report.txt")
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
        log.debug "-" * 48
        log.debug "Adding '${info.title}' from ${info.href}"

        def buffer = new byte[BufferSize]        
        def requestUrl = info.href.toURL()
        def con = requestUrl.openConnection()
        def type = con.contentType
        
        log.debug "info.type: ${info.type}"
        log.debug "type:      ${type}"
        
        // Add to zip
        def bytesRead
        long totalBytesRead = 0
        def dataFromUrl
        try {
            dataFromUrl = requestUrl.newInputStream()
            
            def newEntry = new ZipEntry("${info.title}.${info.href[-3..-1]}") // TODO DN - Find best way to determine extension
            zipOut.putNextEntry(newEntry)
            
            while ((bytesRead = dataFromUrl.read( buffer )) != -1) {

                zipOut.write( buffer, 0, bytesRead )
                totalBytesRead += bytesRead
            }

            zipOut.closeEntry()
        }
        catch(IOException ioe) {
            log.debug "ioe: ${ioe}"
        }
        
        log.debug "totalBytesRead: ${totalBytesRead}"
        
        if (dataFromUrl) {
            dataFromUrl.close()
        }
        
        return totalBytesRead
    }
}