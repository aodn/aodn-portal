
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.converters.JSON
import org.apache.catalina.connector.ClientAbortException

class DownloadCartController {

    def bulkDownloadService

    def download = {

        def downloadCart = []

        if ( !params.items ) {
            render text:"No items are in the Download Cart", status: 400
            return
        }

        def items = JSON.parse( params.items as String )
        downloadCart.addAll items.toArray()
        _outputArchiveFromItemList(downloadCart)
    }

    def _outputArchiveFromItemList(downloadCart) {

        // Prepare response stream and create zip stream
        response.setHeader( "Content-Disposition", "attachment; filename=${bulkDownloadService.getArchiveFilename( request.locale )}" )
        response.contentType = "application/octet-stream"
        def outputStream = response.outputStream

        // Ask Service to create archive to outputStream
        try {
            bulkDownloadService.generateArchiveOfFiles( downloadCart, outputStream, request.locale)

            // Send response
            outputStream.flush()
        }
        catch (ClientAbortException e) {

	        // ClientAbortException is thrown when a user cancels a download
            log.debug "ClientAbortException caught during bulk download", e
        }
        catch (Exception e) {

            log.error "Unhandled Exception caught during bulk download", e
        }
     }
}
