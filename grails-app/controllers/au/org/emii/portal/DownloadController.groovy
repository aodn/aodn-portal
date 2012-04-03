package au.org.emii.portal

import grails.converters.JSON
import org.codehaus.groovy.grails.web.json.*
import java.text.DateFormat
import java.util.zip.*

// Todo - DN: Should split this out into a service

class DownloadController {

    private static final int BufferSize = 4096 // 4kB
    private static final String CookieName = "ys-AggregationItems"
    private static final String CookieDataPrefix = "s:"

    private static final def fileDataFromUrl = ~"(?:\\w*://).*/([\\w_-]*)(\\.[^&?/#]+)?"
    private static final def fileDataFromGeoServerUrl = ~".*fname=([\\w_-]*)(\\.[^&?/#]*)"

    private static final int MinFileExtensionLength = 2
    private static final int MaxFileExtensionLength = 4
    
    def downloadFromCart = {

        // Time processing
        def startTime = System.currentTimeMillis()

        def config = Config.activeInstance()

        def now = new Date()
        def currentDate = DateFormat.getDateInstance( DateFormat.MEDIUM, request.getLocale() ).format( now )
        def currentTime = DateFormat.getTimeInstance( DateFormat.SHORT,  request.getLocale() ).format( now )

        def filename = String.format(config.downloadCartFilename, currentDate, currentTime)
        def includedFileNames = [:]
        def reportText = """\
============================================
Download cart report ($currentDate $currentTime)
============================================
"""

        // Read data from cookie
        def jsonArray
        def jsonData = "[]"
        log.debug "Cookies: ${ request.cookies?.size() }"

        if ( request.cookies ) {

            def downloadCartCookie = request.cookies.find{ it.name == CookieName } // SHould only be one

            log.debug "Cookie: ${ downloadCartCookie.value.decodeURL() }"

            jsonData = downloadCartCookie.value.decodeURL()
            jsonData = jsonData[CookieDataPrefix.length()..-1] // Trim data prefix

            log.debug jsonData
        }

        jsonArray = JSON.parse(jsonData)
        
        log.debug "jsonArray: ${jsonArray.length()} items"
        log.debug "jsonArray: ${jsonArray}"
        
        // Prepare response stream and create zip stream
        response.setHeader("Content-Disposition", "attachment; filename=$filename")
        response.contentType = "application/octet-stream"
        ZipOutputStream zipOut = new ZipOutputStream( response.outputStream )
        
        def numberOfRowsProcessed = 0
        def numberOfFilesAdded = 0
        def bytesAddedForThisFile = 0
        def totalSizeBeforeCompression = 0
        jsonArray.each({

            // Get file details
            def entryFilename = _filenameFromUrl( it, includedFileNames )

            // Write to report
            reportText += """
--[ #${numberOfRowsProcessed + 1 /* adjust for 0-based index*/} ]------------------------------------
Title:                ${it.title}
URL:                  ${it.href}
Type:                 ${it.type}
Filename in zip file: $entryFilename
                      NB. File extension based on URL where possible, otherwise based on provided type information.
Result:               """

            if ( numberOfFilesAdded >= config.downloadCartMaxNumFiles ) {

                reportText += "Unable to add file, maximum number of files allowed reached (${numberOfFilesAdded}/${config.downloadCartMaxNumFiles} files)"
            }
            else if ( totalSizeBeforeCompression >= config.downloadCartMaxFileSize ) {

                reportText += "Unable to add file, maximum size of files allowed reached (${totalSizeBeforeCompression}/${config.downloadCartMaxFileSize} Bytes)"
            }
            else {

                bytesAddedForThisFile = addToZip( zipOut, it, entryFilename )

                if (bytesAddedForThisFile > 0) {

                    numberOfFilesAdded++
                    reportText += "File added ($bytesAddedForThisFile Bytes)"
                    totalSizeBeforeCompression += bytesAddedForThisFile
                }
                else {
                    reportText += "Unknown error adding file"
                }
            }

            reportText += "\n"

            numberOfRowsProcessed++
        })

        reportText += """
============================================
Total size before compression: ${totalSizeBeforeCompression} Bytes
Number of files included: ${numberOfFilesAdded}/${numberOfRowsProcessed}
Time taken: ${(System.currentTimeMillis() - startTime) / 1000} seconds
============================================"""
        
        // Add report to zip file
        def reportEntry = new ZipEntry( "download_report.txt" )
        def reportData = reportText.getBytes( "UTF-8" )
        
        zipOut.putNextEntry reportEntry
        zipOut.write reportData, 0, reportData.length
        zipOut.closeEntry()
        
        // Close file and finish response
        zipOut.close()
        response.outputStream.flush()
    }

    private long addToZip(ZipOutputStream zipOut, JSONObject info, String entryFilename ) {

        log.debug "-" * 48
        log.debug "Adding '${entryFilename}' from ${info.href}"

        def buffer = new byte[ BufferSize ]
                
        // Add to zip
        def bytesRead
        def totalBytesRead = 0
        def dataFromUrl

        try {
            log.debug "info.href: ${info.href}"
            log.debug "info.type: ${info.type}"

            // Bypass disclaimer if MEST url
            def address = _adjustIfMestUrl( info.href )

            // Get data
            dataFromUrl = address.toURL().newInputStream()

            zipOut.putNextEntry new ZipEntry( entryFilename )
            
            while ((bytesRead = dataFromUrl.read( buffer )) != -1) {

                zipOut.write buffer, 0, bytesRead
                totalBytesRead += bytesRead
            }
        }
        catch (Exception e) {

            log.debug "Exception caught while adding file to download zip", e
        }
        finally {

            dataFromUrl?.close()
            zipOut?.closeEntry()
        }
        
        log.debug "totalBytesRead: $totalBytesRead"

        return totalBytesRead
    }
    
    def _filenameFromUrl( info, includedFileNames ) {

        // Todo - DN: Can this be tidied up?

        def filenameFromUrl
        def fileExtensionFromUrl

        // Test for MEST/GeoNetwork URLs
        def matches = info.href =~ fileDataFromGeoServerUrl

        log.debug "matches: ${ matches }"
        
        if ( matches ) {
            log.debug "matches[0]: ${ matches[0] }"
            filenameFromUrl = matches[0][1]
            fileExtensionFromUrl = matches[0][2] ?: ""
        }

        if ( !filenameFromUrl ) {

            matches = info.href =~ fileDataFromUrl
            
            if ( matches ) {
                log.debug "matches[0]: ${ matches[0] }"
                filenameFromUrl = matches[0][1]
                fileExtensionFromUrl = matches[0][2] ?: ""
            }
        }

        if ( !filenameFromUrl ) {

            filenameFromUrl = "un-named_data"
            fileExtensionFromUrl = _extensionFromMimeType( info.type )
        }

        // Uniquify filenames
        def currentCount = includedFileNames[filenameFromUrl]

        if ( !currentCount ) {

            includedFileNames[filenameFromUrl] = 1

            log.debug "$filenameFromUrl$fileExtensionFromUrl"

            return "$filenameFromUrl$fileExtensionFromUrl"
        }

        currentCount++
        includedFileNames[filenameFromUrl] = currentCount

        log.debug "$filenameFromUrl ($currentCount)$fileExtensionFromUrl"
        
        return "$filenameFromUrl ($currentCount)$fileExtensionFromUrl"
    }
    
    def _extensionFromMimeType(type) {

        def mapping = JSON.parse( Config.activeInstance().downloadCartMimeTypeToExtensionMapping )

        def extensionToReturn = mapping[type]

        // Use mapping to try and guess extension
        return ( extensionToReturn ) ? ".$extensionToReturn" : ""
    }

    def _adjustIfMestUrl( address ) {

        // Fix for http://redmine.emii.org.au/issues/1287
        // // Todo - DN: Use a more robust solution
        if ( address ==~ "(.*)file.disclaimer(.*)" ) {

            address = address.replaceFirst( "file.disclaimer", "resources.get" )
            address += "&name=Portal%20Download&org=Unknown&email=Unknown&comments=n%2Fa"
        }

        return address
    }
}