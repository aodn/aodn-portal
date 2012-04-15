package au.org.emii.portal

import grails.converters.JSON

class DownloadCartController {

    static allowedMethods = [add: "POST"]

    def bulkDownloadService

    def add = {

        if ( !params.newEntries ) {

            render text: "No items specified to add", status: 500
            return
        }

        def newEntries = JSON.parse( params.newEntries )

        def cart = _getCart()
        cart.addAll newEntries.toArray()
        _setCart( cart )

        render _getCartSize().toString()
    }

    def clear = {

        _setCart( [] as Set )

        render _getCartSize().toString()
    }

    def getSize = {

        render _getCartSize().toString()
    }

    def download = {

        // Break early if no cookies
        if ( !_getCartSize() ) {

            render text: "No data to download", status: 500
            return
        }

        // Prepare response stream and create zip stream
        response.setHeader( "Content-Disposition", "attachment; filename=${bulkDownloadService.getArchiveFilename( request.locale )}" )
        response.contentType = "application/octet-stream"
        def outputStream = response.outputStream

        // Ask Service to create archive to outputStream
        bulkDownloadService.generateArchiveOfFiles _getCart(), outputStream, request.locale // Todo - DN: What if this call fails or throws an Exception?

        // Send response
        outputStream.flush()
    }

    def _getCart() {

        return session.downloadCart ?: [] as Set
    }

    def _getCartSize() {

        return _getCart().size()
    }

    void _setCart( newCart ) {

        session.downloadCart = newCart
    }
}