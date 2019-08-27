package au.org.emii.portal

import groovy.time.TimeCategory

import java.text.DateFormat

class DownloadReport {

    static final def REPORT_TEMP_FILE_SUFFIX = "download_report"
    static final def ZIP_FILE_NAME = "download_report.txt"

    def locale
    def reportStart
    def reportTempFile

    def numberOfFilesTried = 0
    def numberOfFilesAdded = 0
    def sizeOfFilesAdded = 0

    DownloadReport(locale) {

        this.locale = locale

        reportStart = _currentDate()
        try {
            reportTempFile = File.createTempFile(REPORT_TEMP_FILE_SUFFIX, "tmp")
            reportTempFile.deleteOnExit()
            reportTempFile.write(_header())
        } catch (Throwable e) {
            log.warn "Error creating report file: '$REPORT_TEMP_FILE_SUFFIX'"
            log.debug "Caused by:", e
        }
    }

    void addSuccessfulFileEntry(url, filename, size) {

        numberOfFilesAdded++
        sizeOfFilesAdded += size

        _addFileEntry(_makeFileEntry(url, filename, "File added ($size Bytes)"))
    }

    void addFailedFileEntry(url, filename, result) {

        _addFileEntry(_makeFileEntry(url, filename, result))
    }

    def _header = { ->

        def currentDate = DateFormat.getDateInstance(DateFormat.LONG, locale).format(_currentDate())
        def currentTime = DateFormat.getTimeInstance(DateFormat.SHORT, locale).format(_currentDate())

        return """\
            ========================================================================
            Download cart report ($currentDate $currentTime)
            ========================================================================""".stripIndent()
    }

    def _makeFileEntry = { url, filename, result ->

        numberOfFilesTried++

        return """\

            --[ #$numberOfFilesTried ]------------------------------------
            URL:                 $url
            Filename in archive: $filename
            Result:              $result
            """.stripIndent()
    }

    def _footer = { ->

        return """\

            ========================================================================
            Size of all files: $sizeOfFilesAdded Bytes
            Number of files included: $numberOfFilesAdded/$numberOfFilesTried
            Time taken: ${_timeTaken()}
            ========================================================================""".stripIndent()
    }

    def _addFileEntry = { fileEntry ->

        try {
            reportTempFile.append(fileEntry)
        } catch (Throwable e) {
            log.warn "Error writing to report file: '$REPORT_TEMP_FILE_SUFFIX'"
            log.debug "Caused by:", e
        }
    }

    def getTempFile() {

        _addFileEntry(_footer())
        return reportTempFile
    }

    def deleteTempFile() {

        try {
            reportTempFile.delete()
        } catch (Throwable e) {
            log.warn "Error deleting temporary report file: '$REPORT_TEMP_FILE_SUFFIX'"
            log.debug "Caused by:", e
        }
    }

    def _currentDate = {

        return new Date()
    }

    def _timeTaken = {

        use(TimeCategory) {
            return _currentDate() - reportStart
        }
    }
}
