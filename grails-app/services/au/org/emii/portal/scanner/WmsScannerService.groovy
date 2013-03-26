package au.org.emii.portal.scanner

import grails.converters.JSON

class WmsScannerService extends ScannerService{

    static transactional = true

    public WmsScannerService(){
        super()
    }


    def saveOrUpdateCallbackUrl() {
        return "${portalBaseURL()}layer/saveOrUpdate"
    }


    //Not catching exception here

    def scannerURL(){
        def wmsScannerBaseUrl = grailsApplication.config.wmsScanner.url
        def slash = _optionalSlash( wmsScannerBaseUrl )
        return "${wmsScannerBaseUrl}${slash}"
    }

    def scanJobUrl() {
        return "${scannerURL()}scanJob/"
    }

}
