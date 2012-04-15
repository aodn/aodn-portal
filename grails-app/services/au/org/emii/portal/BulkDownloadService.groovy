package au.org.emii.portal

import grails.converters.JSON

import java.text.DateFormat
import java.util.zip.ZipEntry
import java.util.zip.ZipOutputStream

class BulkDownloadService {

    static transactional = true
    static scope = "request"

    static final int BufferSize = 4096 // 4kB
    static final def FileDataFromUrl = ~"(?:\\w*://).*/([\\w_-]*)(\\.[^&?/#]+)?"
    static final def FileDataFromGeoServerUrl = ~".*fname=([\\w_-]*)(\\.[^&?/#]*)"
    static final def GeoServerDownloadUrl = "(.*)file.disclaimer(.*)"

    static final def GeoServerDownloadDetailsQueryString = "&name=Portal%20Download&org=Unknown&email=info@aodn.org.au&comments=n%2Fa,%20Portal%20download%20cart"

    def processingStartTime
    def cfg = Config.activeInstance()
    def reportBodyText = ""
    def usedFilenames = [:]
    def totalSizeBeforeCompression = 0
    def numberOfFilesTried = 0
    def numberOfFilesAdded = 0
    def zipStream

    void generateArchiveOfFiles( filesToDownload, outputStream, locale ) {

        processingStartTime = System.currentTimeMillis()

        // Create Zip archive stream
        zipStream = new ZipOutputStream( outputStream )

        // Add all files to archive
        filesToDownload.each {

            _addFileEntry it
        }

        _addDownloadReportToArchive( locale )

        // Close zip stream
        zipStream.close()
    }

    def getArchiveFilename( locale ) {

        def currentDate = DateFormat.getDateInstance( DateFormat.MEDIUM, locale ).format( _currentDate() )
        def currentTime = DateFormat.getTimeInstance( DateFormat.SHORT,  locale ).format( _currentDate() )

        return String.format( cfg.downloadCartFilename, currentDate, currentTime )
    }

    def _addFileEntry( fileInfo ) {

        log.debug "Adding file entry for ${ fileInfo.href }"

        def filenameToUse
        _extractFilenameFromUrl( fileInfo )

        // Ensure we can add another file
        def resultMessage = _getAnyRestrictionsAddingFile()

        if ( !resultMessage ) {

            def fileStream = _getStreamForFile( fileInfo )

            filenameToUse = _makeFilenameUnique( fileInfo.filenameUsed, fileInfo.fileExtensionUsed ) // MUST occur after _getStreamForFile() as that may change filename (would be nice to refactor this dependancy out)

            resultMessage = _writeStreamToArchive( filenameToUse, fileStream, fileInfo )
        }
        else {

            filenameToUse = "N/A - File not added to archive"
        }

        log.debug "Result of attempt: $resultMessage"

        // Incremement counter and add to report
        numberOfFilesTried++

        _writeNewDownloadReportEntry( fileInfo, filenameToUse, resultMessage )
    }

    def _writeStreamToArchive( filenameToUse, stream, fileInfo ) {

        // Check for null stream
        if ( !stream ) return "Could not obtain filestream for ${ fileInfo.href }"

        try {
            // Create new Zip Entry
            zipStream.putNextEntry new ZipEntry( filenameToUse )

            // Write data to new zip entry
            def buffer = new byte[ BufferSize ]
            def bytesRead
            def totalBytesRead = 0
            while ((bytesRead = stream.read( buffer )) != -1) {

                zipStream.write buffer, 0, bytesRead
                totalBytesRead += bytesRead
            }

            totalSizeBeforeCompression += totalBytesRead

            numberOfFilesAdded++

            return "File added ($totalBytesRead Bytes)"
        }
        catch (Exception e) {

            return "Unknown error adding file"
        }
        finally {

            stream?.close()
            zipStream.closeEntry()
        }
    }

    def _getAnyRestrictionsAddingFile() {

        if ( numberOfFilesAdded >= cfg.downloadCartMaxNumFiles ) {

            return "Unable to add file, maximum number of files allowed reached (${ numberOfFilesAdded }/${ cfg.downloadCartMaxNumFiles } files)"
        }

        if ( totalSizeBeforeCompression >= cfg.downloadCartMaxFileSize ) {

            return "Unable to add file, maximum size of files allowed reached (${ totalSizeBeforeCompression }/${ cfg.downloadCartMaxFileSize } Bytes)"
        }

        return null // No restrictions
    }

    void _writeNewDownloadReportEntry( fileInfo, filenameInArchive, statusMessage ) {

        reportBodyText += """
--[ #$numberOfFilesTried ]------------------------------------
Title:               ${fileInfo.title}
URL:                 ${fileInfo.href}
Type:                ${fileInfo.type}
Filename in archive: ${filenameInArchive}
Result:              $statusMessage
"""
    }

    def _getStreamForFile( fileInfo ) {

        def address = fileInfo.href

        try {
            if ( !_isGeoServerDisclaimerAddress( address ) ) {

                // Get stream of URL
                return address.toURL().newInputStream()
            }
            else { // Handle special-case GeoServer URLs

                // Request disclaimer page (unmodified URL) first to create session on GeoNetwork
                def firstRequestConn = address.toURL().openConnection()
                firstRequestConn.connect()

                // Get cookie header (should only be one)
                def cookieHeader = firstRequestConn.headerFields.find { it.key == "Set-Cookie" }
                def cookieHeaderValue = cookieHeader.value.get( 0 ) // Only has one value, a delimeted String of cookies

                // Modify URL to ask for file directly, and pass-in dummy field values
                def geoServerDownloadAddress = _geoServerDownloadAddress( address )
                def secondRequestConn = geoServerDownloadAddress.toURL().openConnection()

                secondRequestConn.setRequestProperty "Cookie", cookieHeaderValue
                secondRequestConn.connect()

                def contentTypeHeader = secondRequestConn.headerFields.find { it.toString().startsWith( "Content-Type" ) }
                def contentTypeHeaderValue = contentTypeHeader.value.get( 0 )

                // Update file info as GeoNetwork returns file archives
                fileInfo.filenameUsed = "archive_containing_${ fileInfo.filenameUsed }${ fileInfo.fileExtensionUsed }"
                fileInfo.fileExtensionUsed = ".zip"

                return secondRequestConn.inputStream
            }
        }
        catch(Exception e) {

            return null
        }
    }

    def _finaliseDownloadReport( locale ) {

        def currentDate = DateFormat.getDateInstance( DateFormat.LONG,  locale ).format( _currentDate() )
        def currentTime = DateFormat.getTimeInstance( DateFormat.SHORT, locale ).format( _currentDate() )

        def finalReportText = """\
========================================================================
Download cart report ($currentDate $currentTime)
========================================================================
$reportBodyText
========================================================================
Total size before compression: $totalSizeBeforeCompression Bytes
Number of files included: $numberOfFilesAdded/$numberOfFilesTried
Time taken: ${ _timeTaken() } seconds
========================================================================"""

        return finalReportText.getBytes( "UTF-8" )
    }

    void _addDownloadReportToArchive( locale ) {

        def reportEntry = new ZipEntry( "download_report.txt" )
        def bytes = _finaliseDownloadReport( locale )

        zipStream.putNextEntry reportEntry
        zipStream.write bytes, 0, bytes.length
        zipStream.closeEntry()
    }

    def _isGeoServerDisclaimerAddress( address ) {

        return address ==~ GeoServerDownloadUrl
    }

    def _geoServerDownloadAddress( disclaimerAddress ) {

        def downloadAddress = disclaimerAddress.replaceFirst( "file.disclaimer", "resources.get" )
        downloadAddress += GeoServerDownloadDetailsQueryString

        return downloadAddress
    }

    void _extractFilenameFromUrl( fileInfo ) {

        def filenameFromUrl
        def fileExtensionFromUrl

        // Test for MEST/GeoNetwork URLs
        def matches = fileInfo.href =~ FileDataFromGeoServerUrl

        if ( matches ) {
            log.debug "FileDataFromGeoServerUrl matches[0]: ${ matches[0] }"
            filenameFromUrl = _getFilenameMatch( matches )
            fileExtensionFromUrl = _getFileExtensionMatch( matches )
        }

        // Test for general URLs
        if ( !filenameFromUrl ) {

            matches = fileInfo.href =~ FileDataFromUrl

            if ( matches ) {
                log.debug "FileDataFromUrl matches[0]: ${ matches[0] }"
                filenameFromUrl = _getFilenameMatch( matches )
                fileExtensionFromUrl = _getFileExtensionMatch( matches )
            }
        }

        // When unable to find filename in URL
        if ( !filenameFromUrl ) {

            filenameFromUrl = "unnamed_data"
            fileExtensionFromUrl = _extensionFromMimeType( fileInfo.type )
        }

        log.debug "filenameFromUrl: $filenameFromUrl fileExtensionUsed: $fileExtensionFromUrl"

        // Write back to fileInfo
        fileInfo.filenameUsed = filenameFromUrl
        fileInfo.fileExtensionUsed = fileExtensionFromUrl
    }

    def _getFilenameMatch( matches ) {

        return matches[0][1]
    }

    def _getFileExtensionMatch( matches ) {

        return matches[0][2] ?: ""
    }

    def _makeFilenameUnique( filename, extension ) {

        def currentCount = usedFilenames[filename]

        // First usage of this filename
        if ( !currentCount ) {

            usedFilenames[filename] = 1

            return "$filename$extension"
        }

        // Subsequent usage of this filename
        currentCount++
        usedFilenames[filename] = currentCount

        return "$filename($currentCount)$extension"
    }

    def _extensionFromMimeType( type ) {

        def mapping = JSON.parse( cfg.downloadCartMimeTypeToExtensionMapping )

        def extensionToReturn = mapping[type]

        // Use mapping to try and guess extension
        return extensionToReturn ? ".$extensionToReturn" : ""
    }

    def _currentDate() {

        return new Date()
    }

    def _timeTaken() {

        return ( System.currentTimeMillis() - processingStartTime ) / 1000
    }
}