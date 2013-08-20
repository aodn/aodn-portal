
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.converters.JSON
import org.apache.catalina.connector.ClientAbortException
import org.codehaus.groovy.grails.web.json.JSONObject

import java.text.DateFormat
import java.util.zip.ZipEntry
import java.util.zip.ZipOutputStream

class BulkDownloadService {

    static transactional = true
    static scope = "request"

    static final int BUFFER_SIZE = 4096 // 4kB
    static final def FILE_DATA_FROM_URL = ~"(?:\\w*://).*/([\\w_-]*)(\\.[^&?/#]+)?"
    static final def FILE_DATA_FROM_GEONETWORK_URL = ~".*fname=([\\w_-]*)(\\.[^&?/#]*)"
    static final def GEONETWORK_DOWNLOAD_URL = "(.*)file.disclaimer(.*)"

    static final def GEONETWORK_DOWNLOAD_DETAILS_QUERY_STRING = "&name=Portal%20Download&org=Unknown&email=info@aodn.org.au&comments=n%2Fa,%20Portal%20download%20cart"

    def processingStartTime
    def cfg = Config.activeInstance()
    def reportBodyText = ""
    def usedFilenames = [:]
    def totalSizeBeforeCompression = 0
    def numberOfFilesTried = 0
    def numberOfFilesAdded = 0
    def zipStream

    void generateArchiveOfFiles( filesToDownload, outputStream, locale ) throws ClientAbortException {

        processingStartTime = System.currentTimeMillis()

        // Create a deep copy of filesToDownload to work with
        def copyOfFilesToDownload = filesToDownload.collect( mapDeepCopyJson )

        // Create Zip archive stream
        zipStream = new ZipOutputStream( outputStream )

        // Add all files to archive
        copyOfFilesToDownload.each {
            it.downloadableLinks.each { layerLink ->
                _addFileEntry layerLink
            }

            if (it.wfsDownloadInfo) {

                _addFileEntry _wfsDownloadItemFrom(it.wfsDownloadInfo)
            }
        }

        _addDownloadReportToArchive( locale )

        // Close zip stream
        zipStream.close()
    }

    def getArchiveFilename(locale) {

        def currentDate = DateFormat.getDateInstance( DateFormat.MEDIUM, locale ).format( _currentDate() )
        def currentTime = DateFormat.getTimeInstance( DateFormat.SHORT,  locale ).format( _currentDate() )
        def now = (currentDate + "-" + currentTime).replaceAll("\\n", "-")

        def fileName = String.format( cfg.downloadCartFilename, now)

        return fileName.replaceAll("\\s","_") // unix friendly
    }

    def _addFileEntry( fileInfo ) {

        log.debug "Adding file entry for ${ fileInfo.href }"

        def filenameToUse

        if (fileInfo.preferredFname) {
            //For now, the preferred name is just <filename>.<file_extension>
            //Adding this option because WFS always returns a file with the name "wms",
            //which isn't going to be very helpful to users
            def preferredFname = fileInfo.preferredFname
            fileInfo.filenameUsed = preferredFname.substring(0, preferredFname.indexOf("."))
            fileInfo.fileExtensionUsed = preferredFname.substring(preferredFname.indexOf("."))
        }
        else {
            _extractFilenameFromUrl( fileInfo )
        }

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
            zipStream.putNextEntry new ZipEntry( filenameToUse as String )

            // Write data to new zip entry
            def buffer = new byte[ BUFFER_SIZE ]
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

            log.info "Exception writing stream to archive", e

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

                // Update file info as GeoNetwork returns file archives
                fileInfo.filenameUsed = "archive_containing_${ fileInfo.filenameUsed }${ fileInfo.fileExtensionUsed }"
                fileInfo.fileExtensionUsed = ".zip"

                return secondRequestConn.inputStream
            }
        }
        catch (Exception e) {

            log.info "Exception while trying to get stream for '$address'", e

            return null
        }
    }

    def _finaliseDownloadReport( locale ) {

        def currentDate = DateFormat.getDateInstance( DateFormat.LONG,  locale ).format( _currentDate() )
        def currentTime = DateFormat.getTimeInstance( DateFormat.LONG, locale ).format( _currentDate() )


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

        return finalReportText.replace("\n","\r\n").getBytes( "UTF-8" )
    }

    void _addDownloadReportToArchive( locale ) {

        def reportEntry = new ZipEntry( "download_report.txt" )
        def bytes = _finaliseDownloadReport( locale )

        zipStream.putNextEntry reportEntry
        zipStream.write bytes, 0, bytes.length
        zipStream.closeEntry()
    }

    def _isGeoServerDisclaimerAddress( address ) {

        return address ==~ GEONETWORK_DOWNLOAD_URL
    }

    def _geoServerDownloadAddress( disclaimerAddress ) {

        def downloadAddress = disclaimerAddress.replaceFirst( "file.disclaimer", "resources.get" )
        downloadAddress += GEONETWORK_DOWNLOAD_DETAILS_QUERY_STRING

        return downloadAddress
    }

    void _extractFilenameFromUrl( fileInfo ) {

        def filenameFromUrl
        def fileExtensionFromUrl

        // Test for MEST/GeoNetwork URLs
        def matches = fileInfo.href =~ FILE_DATA_FROM_GEONETWORK_URL

        if ( matches ) {
            log.debug "FILE_DATA_FROM_GEONETWORK_URL matches[0]: ${ matches[0] }"
            filenameFromUrl = _getFilenameMatch( matches )
            fileExtensionFromUrl = _getFileExtensionMatch( matches )
        }

        // Test for general URLs
        if ( !filenameFromUrl ) {

            matches = fileInfo.href =~ FILE_DATA_FROM_URL

            if ( matches ) {
                log.debug "FILE_DATA_FROM_URL matches[0]: ${ matches[0] }"
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

	def _wfsDownloadItemFrom(info) {

		[
			title: _wfsItemTitle(info),
			preferredFname: _sanitiseFileName(info.layerName) + ".csv",
			href: _wfsUrlFrom(info),
			type: "text/csv" // Will be configurable later
		]
	}

	def _wfsUrlFrom(info) {

		String serverWfsUrl = info.serverUri.replace("/wms", "/wfs")

		return urlWithQueryString(serverWfsUrl, _wfsQueryArgs(info))
	}

	def _wfsQueryArgs(info) {

		def queryArgs = [
			typeName: info.layerName,
			SERVICE: "WFS",
			outputFormat: "csv",
			REQUEST: "GetFeature",
			VERSION: "1.0.0" //This version has BBOX the same as WMS.
		]

		if (info.cqlFilter) {

			queryArgs.CQL_FILTER = info.cqlFilter
		}

		return queryArgs
	}

	def _wfsItemTitle(info) {

		def prefix = info.cqlFilter ? "Filtered " : ""

		return prefix + info.layerName + " data"
	}

	def _sanitiseFileName(name) {

		return name.replace(":", "#")
	}

    def _currentDate() {

        return new Date()
    }

    def _timeTaken() {

        long msTaken = System.currentTimeMillis() - processingStartTime

        return Math.max(Math.round( msTaken / 1000 ), 1) // Return value in whole seconds (min 1 for tidiness)
    }

    def mapDeepCopyJson = {

        def map = [:]

        it.collect {
            k, v ->

            map[k] = v
        }

        return map as JSONObject
    }
}
