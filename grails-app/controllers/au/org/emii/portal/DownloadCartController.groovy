
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

    //static allowedMethods = [download: "POST"]

    def downLoadCart = []

    def bulkDownloadService

    // for testing
    def downloadInput =
        """[
    {
        'uuid': '1111111',
        'name': 'some record',
        'title': 'its really interesting',
        'links': [
            {
                "title":"NRSNSI Mooring diagram - surface",
                "href":"http://imosmest.aodn.org.au:80/geonetwork/srv/en/file.disclaimer?id=8060&fname=NRSNSI_surface_revA.pdf&access=private",
                "type":"application/pdf",
                "protocol":"WWW:DOWNLOAD-1.0-http--downloadother"
            },
            {
                "title":"NRSNSI Mooring diagram - sub-surface",
                "type":"application/pdf",
                "href":"http://imosmest.aodn.org.au:80/geonetwork/srv/en/file.disclaimer?id=8060&fname=NRSNSI_subsurface_revA.pdf&access=private",
                "protocol":"WWW:DOWNLOAD-1.0-http--downloadother"
            }]
    },
    {
        'uuid': '22222',
        'name': 'another record',
        'title': 'its really really interesting',
        'links': [
            {
                "title":"NRSNSI Snoring diagram - Another Dimension",
                "href":"http://imosmest.aodn.org.au:80/geonetwork/srv/en/file.disclaimer?id=8060&fname=NRSNSI_surface_revA.pdf&access=private",
                "type":"application/pdf",
                "protocol":"WWW:DOWNLOAD-1.0-http--downloadother"
            },
            {
                "title":"NRSNSI Snoring diagram - Another Sub Dimension",
                "type":"application/pdf",
                "href":"http://imosmest.aodn.org.au:80/geonetwork/srv/en/file.disclaimer?id=8060&fname=NRSNSI_subsurface_revA.pdf&access=private",
                "protocol":"WWW:DOWNLOAD-1.0-http--downloadother"
            }]
    }
]"""


    def download = {

        params.items = downloadInput // for testing

        if ( !params.items ) {
            render text: "No items specified to add", status: 500
            return
        }

        def items = JSON.parse( params.items as String )
        downLoadCart.addAll items.toArray()
        return _download()

    }



    def _download = {

        if ( downLoadCart.size() == 0 ) {

            flash.message = "No data in cart to download"
            redirect controller: 'home'
            return
        }

        // Prepare response stream and create zip stream
        response.setHeader( "Content-Disposition", "attachment; filename=${bulkDownloadService.getArchiveFilename( request.locale )}" )
        response.contentType = "application/octet-stream"
        def outputStream = response.outputStream

        // Ask Service to create archive to outputStream
        try {
            bulkDownloadService.generateArchiveOfFiles( downLoadCart, outputStream, request.locale)

            // Send response
            outputStream.flush()
        }
        catch (ClientAbortException e) {

            log.info "ClientAbortException caught during bulk download", e
        }
        catch (Exception e) {

            log.error "Unhandled Exception caught during bulk download", e
        }
     }




}
