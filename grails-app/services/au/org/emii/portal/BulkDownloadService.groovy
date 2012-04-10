package au.org.emii.portal

import grails.converters.JSON

import java.text.DateFormat
import java.util.zip.*

class BulkDownloadService {

    static transactional = true
    static scope = "request"

    private static final int BufferSize = 4096 // 4kB
    private static final def FileDataFromUrl = ~"(?:\\w*://).*/([\\w_-]*)(\\.[^&?/#]+)?"
    private static final def FileDataFromGeoServerUrl = ~".*fname=([\\w_-]*)(\\.[^&?/#]*)"
    private static final def GeoServerDownloadUrl = "(.*)file.disclaimer(.*)"

    private static final def GeoServerDownloadDetailsQueryString = "&name=Portal%20Download&org=Unknown&email=info@aodn.org.au&comments=n%2Fa,%20Portal%20download%20cart"

    def processingStartTime
    def cfg
    def reportBodyText = ""
    def usedFilenames = [:]
    def totalSizeBeforeCompression = 0
    def numberOfFilesTried = 0
    def numberOfFilesAdded = 0
    def zipStream

    void generateArchiveOfFiles( filesToDownload, outputStream ) {

        processingStartTime = System.currentTimeMillis()

        if ( !cfg ) cfg = Config.activeInstance()

        // Create Zip archive stream
        zipStream = new ZipOutputStream( outputStream )

        // Add all files to archive
        filesToDownload.each {

            _addFileEntry it
        }

        _addDownloadReportToArchive()

        // Close zip stream
        zipStream.close()
    }

    def getArchiveFilename( locale ) {

        if ( !cfg ) cfg = Config.activeInstance()

        def now = new Date()
        def currentDate = DateFormat.getDateInstance( DateFormat.MEDIUM, locale ).format( now )
        def currentTime = DateFormat.getTimeInstance( DateFormat.SHORT,  locale ).format( now )

        return String.format( cfg.downloadCartFilename, currentDate, currentTime )
    }

    def _addFileEntry( fileInfo ) {

        log.debug "Adding file entry for ${ fileInfo.href }"

        _extractFilenameFromUrl( fileInfo )

        def fileStream = _getStreamForFile( fileInfo )
        def filename = _makeFilenameUnique( fileInfo.filenameUsed, fileInfo.fileExtensionUsed )

        def statusMessage = _writeStreamToArchive( filename, fileStream )

        _writeNewDownloadReportEntry( fileInfo, filename, statusMessage )

        log.debug "Status of attempt: $statusMessage"

        numberOfFilesTried++
    }

    def _writeStreamToArchive( entryFilename, stream ) {

        // Ensure we can add another file
        def restrictionAddingFile = _checkRestrictionAddingFile()
        if ( restrictionAddingFile ) return restrictionAddingFile

        try {
            // Create new Zip Entry
            zipStream.putNextEntry new ZipEntry( entryFilename )

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

            return "$e" // Todo - DN: What here?
        }
        finally {

            stream?.close()
            zipStream.closeEntry()
        }
    }

    def _checkRestrictionAddingFile() {

        if ( numberOfFilesAdded >= cfg.downloadCartMaxNumFiles ) {

            return "Unable to add file, maximum number of files allowed reached (${ numberOfFilesAdded }/${ cfg.downloadCartMaxNumFiles } files)"
        }

        if ( totalSizeBeforeCompression >= cfg.downloadCartMaxFileSize ) {

            return "Unable to add file, maximum size of files allowed reached (${ totalSizeBeforeCompression }/${ cfg.downloadCartMaxFileSize } Bytes)"
        }
    }

    void _writeNewDownloadReportEntry( fileInfo, filenameInArchive, statusMessage ) {

        reportBodyText += """
--[ #$numberOfFilesAdded ]------------------------------------
Title:                ${fileInfo.title}
URL:                  ${fileInfo.href}
Type:                 ${fileInfo.type}
Filename in zip file: ${filenameInArchive}
                      NB. File extension based on URL where possible, otherwise based on provided type information.
Result:               $statusMessage
"""
    }

    def _getStreamForFile( fileInfo ) {

        def address = fileInfo.href

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

    def _finaliseDownloadReport() {

        def currentDate = 0
        def currentTime = 0

        def finalReportText = """\
============================================
Download cart report ($currentDate $currentTime)
============================================
$reportBodyText
============================================
Total size before compression: $totalSizeBeforeCompression Bytes
Number of files included: $numberOfFilesAdded/$numberOfFilesTried
Time taken: ${(System.currentTimeMillis() - processingStartTime) / 1000} seconds
============================================"""

        return finalReportText.getBytes( "UTF-8" )
    }

    void _addDownloadReportToArchive() {

        def reportEntry = new ZipEntry( "download_report.txt" )
        def bytes = _finaliseDownloadReport()

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
}