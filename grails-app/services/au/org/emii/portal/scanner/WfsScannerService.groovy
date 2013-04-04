package au.org.emii.portal.scanner

import grails.converters.JSON
import au.org.emii.portal.Server
import au.org.emii.portal.Config
import javax.annotation.PostConstruct

class WfsScannerService extends ScannerService {

    static transactional = true
    static lazyInit = false

    public WfsScannerService(){
        super()
    }

    def getScannerBaseUrl(){
        return grailsApplication.config.wfsScanner.url
    }

    def scanJobUrl() {
        return "${scannerURL()}scanJob/"
    }

    def saveOrUpdateCallbackUrl() {
        return "${portalBaseURL()}filter/updateFilter"
    }

    def callDelete(scanJobId){
        if(scanJobId == null){
            return "No job specified"
        }

        def address = "${scanJobUrl() }delete?id=${scanJobId}"

        callService(address)

        return "Job deleted."
    }


    def callRegister(serverId, layerName, wfsScannerCallbackPassword){
        //http://localhost:8080/Portal2/filter/updateFilter&password=thefreakingpassword
        Server server = Server.get(serverId)

        if(server == null){
            log.debug("Cannot find server with ID: " + serverId)
            throw new Exception("Cannot find server.")
        }

        if (server.type.startsWith("GEO")){
            def address;

            if (layerName != null)
                address = "${scanJobUrl()}register?serverUrl=${server.uri}&layerName=${layerName}&callbackUrl=${saveOrUpdateCallbackUrl()}&password=${wfsScannerCallbackPassword}&scanFrequency=${server.scanFrequency}"
            else
                address =  "${scanJobUrl()}register?serverUrl=${server.uri}&callbackUrl=${saveOrUpdateCallbackUrl()}&password=${wfsScannerCallbackPassword}&scanFrequency=${server.scanFrequency}"

            callService(address)
        }
        else{
            log.info("WFSScanner currently only supports GEOSERVER.")
            throw new Exception("WFSScanner currently only supports GEOSERVER.  Please change the server type and try again.")
        }

        return "Registered new scan job for server."
    }

    def callUpdate(scanJobId){
        def jobId = scanJobId

        if (jobId == null){
            log.debug("Cannot find job with ID: " + jobId)
            throw new Exception("Cannot find job.")
        }

        def address =  "${scanJobUrl()}updateNow?id=${jobId}"

        callService(address)

        return "Running new scan job for WFS."
    }
}
