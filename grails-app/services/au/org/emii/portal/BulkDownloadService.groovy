/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import java.util.zip.ZipEntry
import java.util.zip.ZipOutputStream

class BulkDownloadService {

    static scope = "request"

    static final int BUFFER_SIZE = 4096 // Bytes
    static final def FILENAME_FROM_URL_REGEX = ~"(?:\\w*://).*/([\\w_-]*)(\\.[^&?/#]+)?"

    def urlList
    def zipStream
    def report
    def usedFilenames = [:]

    void generateArchiveOfFiles(urlList, outputStream, locale) {

        this.urlList = urlList

        report = new DownloadReport(locale)

        _createZipStream(outputStream)

        _writeFilesToStream()

        _closeStream()
    }

    def _createZipStream = { outputStream ->

        zipStream = new ZipOutputStream(outputStream)
        zipStream.level = ZipOutputStream.STORED
    }

    def _writeFilesToStream = {

        urlList.each {
            _addFileEntry(it)
        }

        _addDownloadReportToArchive()
    }

    def _closeStream = {

        zipStream.close()
    }

    def _addFileEntry = { url ->

        def filenameToUse = _uniqueFilenameForUrl(url)

        log.debug "filenameToUse: $filenameToUse"

        _writeStreamToArchive(url, filenameToUse)
    }

    def _uniqueFilenameForUrl = { url ->

        def (filename, extension) = _filenamePartsFromUrl(url)

        log.debug "filename: $filename -- extension: $extension"

        def currentCount = usedFilenames[filename]

        // First usage of this filename
        if (!currentCount) {
            usedFilenames[filename] = 1

            return filename + extension
        }

        // Subsequent usage of this filename
        currentCount++
        usedFilenames[filename] = currentCount

        return "$filename($currentCount)$extension"
    }

    def _filenamePartsFromUrl = { url ->

        def matches = url =~ FILENAME_FROM_URL_REGEX

        return [
            matches[0][1], // Filename
            matches[0][2] ?: "" // Extension
        ]
    }

    def _writeStreamToArchive = { url, filenameToUse ->

        def stream

        try {
            stream = url.toURL().newInputStream()

            zipStream.putNextEntry new ZipEntry(filenameToUse)

            def buffer = new byte[BUFFER_SIZE]
            def bytesRead
            def totalBytesRead = 0

            while ((bytesRead = stream.read(buffer)) != -1) {
                zipStream.write buffer, 0, bytesRead
                totalBytesRead += bytesRead
            }

            report.addSuccessfulFileEntry url, filenameToUse, totalBytesRead
        }
        catch (Exception e) {

            report.addFailedFileEntry url, filenameToUse, "Unknown error adding file"
        }
        finally {

            stream?.close()
            zipStream.closeEntry()
        }
    }

    def _addDownloadReportToArchive = { ->

        def reportEntry = new ZipEntry("download_report.txt")
        def bytes = report.text.bytes

        zipStream.putNextEntry reportEntry
        zipStream.write bytes, 0, bytes.length
        zipStream.closeEntry()
    }
}
