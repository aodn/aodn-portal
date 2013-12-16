/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import org.apache.commons.io.IOUtils

import java.util.zip.ZipEntry
import java.util.zip.ZipOutputStream

class BulkDownloadService {

    static scope = "request"

    static final def FILENAME_FROM_URL_REGEX = ~"(?:\\w*://).*/([\\w_-]*)(\\.[^&?/#]+)?" // http://aodn.org.au/world_map.gif -> ((world_map) (.gif))

    def zipStream
    def report
    def usedFilenames = [:]

    void generateArchiveOfFiles(urlList, outputStream, locale) {

        report = new DownloadReport(locale)

        try {
            _createZipStream outputStream
            _writeFilesToStream urlList
        }
        finally {
            _closeStream()
        }
    }

    def _createZipStream = { outputStream ->

        zipStream = new ZipOutputStream(outputStream)
        zipStream.level = ZipOutputStream.STORED
    }

    def _writeFilesToStream = { urlList ->

        urlList.each {
            _addFileEntry(it)
        }

        _addDownloadReportToArchive()
    }

    def _closeStream = {

        zipStream.close()
    }

    def _addFileEntry = { url ->

        log.debug "Adding entry for file from URL: '$url'"

        def filenameToUse = _uniqueFilenameForUrl(url)
        def streamFromUrl

        try {
            streamFromUrl = url.toURL().newInputStream()

            zipStream.putNextEntry new ZipEntry(filenameToUse)

            def bytesCopied = IOUtils.copy(streamFromUrl, zipStream)

            report.addSuccessfulFileEntry url, filenameToUse, bytesCopied
        }
        catch (Exception e) {

            log.warn "Error adding file to download archive. URL: '$url'", e

            if (!streamFromUrl) {
                def filenameInArchive = filenameToUse + '.failed'

                zipStream.putNextEntry new ZipEntry(filenameInArchive)
                report.addFailedFileEntry url, filenameInArchive, "Unable to download data from: '$url'"
            }
            else {
                report.addFailedFileEntry url, filenameToUse, "Unknown error adding file"
            }
        }
        finally {

            streamFromUrl?.close()
            zipStream.closeEntry()
        }
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

    def _addDownloadReportToArchive = { ->

        def reportEntry = new ZipEntry("download_report.txt")
        def bytes = report.text.bytes

        zipStream.putNextEntry reportEntry
        zipStream.write bytes, 0, bytes.length
        zipStream.closeEntry()
    }
}
