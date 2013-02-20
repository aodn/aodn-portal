package au.org.emii.portal

import grails.converters.JSON

class CheckWmsScannerService {

    static transactional = true

    def grailsApplication

    def getServerFromJob(jobId) {
        def conf = Config.activeInstance()
        def wmsScannerBaseUrl = grailsApplication.config.wmsScanner.url
        wmsScannerBaseUrl += _optionalSlash( wmsScannerBaseUrl ) // Ensure trailing slash

        // Check if WMS Scanner settings are valid
        if ( !wmsScannerBaseUrl || !conf.wmsScannerCallbackPassword ) {

            flash.message = "Both settings: 'WmsScannerBaseUrl' and 'WmsScannerCallbackPassword' must have values to use a WMS Scanner."

            return [ configInstance: conf, wmsScannerBaseUrl: wmsScannerBaseUrl, scanJobList: [], statusText: statusText, serversToList: [] ]
        }

        def callbackUrl = URLEncoder.encode( _saveOrUpdateCallbackUrl() )
        def scanJobList

        def url
        def conn

        try {
            url = "${ _scanJobUrl() }list?callbackUrl=$callbackUrl".toURL()
            conn = url.openConnection()
            conn.connect()

            scanJobList = JSON.parse( conn.content.text ) // Makes the call
        }
        catch (Exception e) {

            setFlashMessage e, conn
            scanJobList = [] // Empty list
        }
        def requestedJob = null
        for(job in scanJobList)
        {
            if(jobId.toInteger() == job.id.toInteger()) {
                requestedJob = job
                break
            }
        }

        def server = Server.findWhere( uri: requestedJob.uri )
        return server
    }

    def _saveOrUpdateCallbackUrl() {

        def portalBaseUrl = grailsApplication.config.grails.serverURL
        def slash = _optionalSlash( portalBaseUrl )

        return "${portalBaseUrl}${slash}layer/saveOrUpdate"
    }

    def _scanJobUrl() {

        def wmsScannerBaseUrl = grailsApplication.config.wmsScanner.url
        def slash = _optionalSlash( wmsScannerBaseUrl )

        return "${wmsScannerBaseUrl}${slash}scanJob/"
    }

    def _optionalSlash( url ) { // Todo - DN: Change to _ensureTrailingSlash

        return url[-1..-1] != "/" ? "/" : ""
    }
}
