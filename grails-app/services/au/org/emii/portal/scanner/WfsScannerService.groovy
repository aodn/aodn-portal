package au.org.emii.portal.scanner

import grails.converters.JSON

class WfsScannerService extends ScannerService {

    static transactional = true

    public WfsScannerService(){
        super()
    }


    def saveOrUpdateCallbackUrl() {
        return "${portalBaseURL()}filter/updateFilter"
    }

    def scanJobUrl() {
        return "${scannerURL()}scanJob/"
    }

    def scannerURL(){
        def wfsScannerBaseUrl = grailsApplication.config.wfsScanner.url
        def slash = _optionalSlash( wfsScannerBaseUrl )
        println "${wfsScannerBaseUrl}${slash}"
        return "${wfsScannerBaseUrl}${slash}"
    }

    def callDelete(scanJobId){

        def callbackUrl = URLEncoder.encode( saveOrUpdateCallbackUrl() )
        def address = "${scanJobUrl() }delete?id=${scanJobId}"

        def url
        def conn

        url = address.toURL()
        conn = url.openConnection()
        conn.connect()

        def response = executeCommand( conn )
    }

}
