package au.org.emii.portal

import grails.converters.JSON

class DownloadController {

    private static final String CookieName = "ys-AggregationItems"
    private static final String CookieDataPrefix = "s:"

    def bulkDownloadService

    def downloadFromCart = {

        // Break early if no cookies
        if ( !request.cookies ) {

            render text: "No data to download", status: 500
            return
        }

        // Read data from cookies
        def downloadCartCookie = request.cookies.find{ it.name == CookieName } // Should only be one
        def jsonData = downloadCartCookie.value.decodeURL()
        jsonData -= CookieDataPrefix // Trim data prefix

        log.debug "jsonData: ${ jsonData }"

        def jsonArray = JSON.parse( jsonData )

        log.debug "jsonArray: ${jsonArray.length()} items"
        log.debug "jsonArray: ${jsonArray}"

        // Prepare response stream and create zip stream
        response.setHeader( "Content-Disposition", "attachment; filename=${bulkDownloadService.getArchiveFilename( request.locale )}" )
        response.contentType = "application/octet-stream"

        // Ask Service to create archive to outputStream
        bulkDownloadService.generateArchiveOfFiles jsonArray, response.outputStream

        // Send response
        response.outputStream.flush()
    }
}