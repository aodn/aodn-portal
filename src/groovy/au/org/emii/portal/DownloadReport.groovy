/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import groovy.time.TimeCategory

import java.text.DateFormat

class DownloadReport {

    def locale
    def reportStart
    def reportBody = ""

    def numberOfFilesTried = 0
    def numberOfFilesAdded = 0
    def sizeOfFilesAdded = 0

    DownloadReport(locale) {

        this.locale = locale

        reportStart = _currentDate()
    }

    void addSuccessfulFileEntry(url, filename, size) {

        numberOfFilesAdded++
        sizeOfFilesAdded += size

        _addFileEntry(url, filename, "File added ($size Bytes)")
    }

    void addFailedFileEntry(url, filename, result) {

        _addFileEntry(url, filename, result)
    }

    def _addFileEntry = { url, filename, result ->

        numberOfFilesTried++

        reportBody += """\
            --[ #$numberOfFilesTried ]------------------------------------
            URL:                 $url
            Filename in archive: $filename
            Result:              $result
            """.stripIndent()
    }

    def getText() {

        def currentDate = DateFormat.getDateInstance(DateFormat.LONG, locale).format(_currentDate())
        def currentTime = DateFormat.getTimeInstance(DateFormat.SHORT, locale).format(_currentDate())

        return """\
        ========================================================================
        Download cart report ($currentDate $currentTime)
        ========================================================================
        $reportBody
        ========================================================================
        Size of all files: $sizeOfFilesAdded Bytes
        Number of files included: $numberOfFilesAdded/$numberOfFilesTried
        Time taken: ${_timeTaken()}
        ========================================================================""".stripIndent()
    }

    def _currentDate = {

        return new Date()
    }

    def _timeTaken = {

        use(TimeCategory) {
            return reportStart - _currentDate()
        }
    }
}
