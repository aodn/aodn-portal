package au.org.emii.portal.scanner

import grails.converters.JSON
import javax.annotation.PostConstruct

class WmsScannerService extends ScannerService{

    static transactional = true
    static lazyInit = false

    public WmsScannerService(){
        super()
    }

    def getScannerBaseUrl(){
        return grailsApplication.config.wmsscanner.url
    }

    def saveOrUpdateCallbackUrl() {
        return "${portalBaseURL()}layer/saveOrUpdate"
    }



}
