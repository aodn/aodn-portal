

package au.org.emii.portal

import groovy.time.TimeCategory

import java.util.zip.ZipEntry
import java.util.zip.ZipOutputStream

class BulkDownloadService {

    static scope = "request"

    static final def FILENAME_FROM_URL_REGEX = ~"(?:\\w*://).*/([\\w_-]*)(\\.[^&?/#]+)?" // http://aodn.org.au/world_map.gif -> ((world_map) (.gif))
    static final def INDEX_MATCHES = 0
    static final def INDEX_FILENAME = 1
    static final def INDEX_EXTENSION = 2
    static final def FILENAME_TO_USE_WHEN_UNKNOWN = 'file'
    static final def BUFFER_SIZE = 1024 * 4

    def report
    def uniqueFilenameGenerator
    def zipStream

    void generateArchiveOfFiles(urlList, outputStream, locale) {

        def processingStart = new Date()

        report = new DownloadReport(locale)
        uniqueFilenameGenerator = new UniqueFilenameGenerator()

        try {
            _createZipStream outputStream
            _writeFilesToStream urlList
        }
        finally {

            try {
                _closeStream()
            }
            finally {
                use(TimeCategory) {

                    log.info "Bulk download complete. ${urlList.size()} URLs; time taken: ${new Date() - processingStart}"
                }
            }
        }
    }

    def _createZipStream = { outputStream ->

        zipStream = new ZipOutputStream(outputStream)
        zipStream.level = ZipOutputStream.STORED
    }

    def _writeFilesToStream = { urlList ->

        urlList.eachWithIndex { url, index ->
            log.debug "(${index + 1}/${urlList.size()}) Adding entry for file from URL: '$url'"

            _addFileEntry(url)
        }

        _addDownloadReportToArchive()
    }

    def _closeStream = {

        zipStream.close()
    }

    def _addFileEntry = { url ->

        def filenameToUse = _uniqueFilenameForUrl(url)
        def streamFromUrl

        try {
            streamFromUrl = url.toURL().newInputStream()

            zipStream.putNextEntry new ZipEntry(filenameToUse)

            def bytesCopied = copy(streamFromUrl, zipStream, BUFFER_SIZE)

            log.debug "Added $bytesCopied Bytes"

            report.addSuccessfulFileEntry url, filenameToUse, bytesCopied
        }
        catch (Exception e) {

            log.warn "Error adding file to download archive. URL: '$url'"
            log.debug "Caused by:", e

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

        return uniqueFilenameGenerator.generateUniqueFilename(filename, extension)
    }

    def _filenamePartsFromUrl = { url ->

        def matcher = url =~ FILENAME_FROM_URL_REGEX

        if (matcher) {
            def matches = matcher[INDEX_MATCHES]

            return [
                matches[INDEX_FILENAME],
                matches[INDEX_EXTENSION] ?: ""
            ]
        }
        else {
            return [FILENAME_TO_USE_WHEN_UNKNOWN, ""]
        }
    }

    def _addDownloadReportToArchive = { ->

        def reportEntry = new ZipEntry("download_report.txt")
        def bytes = report.text.bytes

        zipStream.putNextEntry reportEntry
        zipStream.write bytes, 0, bytes.length
        zipStream.closeEntry()
    }

    public static void copy(final InputStream input, final OutputStream output, final int bufferSize) throws IOException
    {
        final byte[] buffer = new byte[bufferSize];
        int bytesRead = 0;
        while(-1 != (bytesRead = input.read(buffer))) {
            output.write(buffer, 0, bytesRead);
        }
    }
}
