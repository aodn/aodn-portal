
/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal.scanner

import au.org.emii.portal.Server

class WfsScannerService extends ScannerService {

    static transactional = true
    static lazyInit = false

    public WfsScannerService(){
        super()
    }

    def getScannerBaseUrl(){

		return grailsApplication.config.wfsScanner.url
    }

    def saveOrUpdateCallbackUrl() {

		return "${portalBaseURL()}filter/updateFilter"
    }

    def callDelete(scanJobId){

        if (!scanJobId) {
            return "No job specified"
        }

        def address = "${scanJobUrl() }delete?id=${scanJobId}"

        callService(address)

        return "Job deleted."
    }

    def callRegister(serverId, layerName, wfsScannerCallbackPassword){
        //http://localhost:8080/Portal2/filter/updateFilter&password=thefreakingpassword
        Server server = Server.get(serverId)

        if (!server) {

            log.error("Cannot find server with ID: " + serverId)
            throw new IllegalArgumentException("Cannot find server.")
        }

        if (server.type.startsWith("GEO")){

			def version = server.type[-5..-1] // Todo - DN: Put this somewhere more central (and re-useable)

            def address = "${scanJobUrl()}register?serverUrl=${server.uri}&callbackUrl=${saveOrUpdateCallbackUrl()}&password=${wfsScannerCallbackPassword}&scanFrequency=${server.scanFrequency}&wfsVersion=$version"

            if (layerName) {
                address += "&layerName=${layerName}"
            }
            callService(address)
        }
        else {

            log.info("WFSScanner currently only supports GEOSERVER.")
            throw new IllegalArgumentException("WFSScanner currently only supports GEOSERVER.  Please change the server type and try again.")
        }

        return "Registered new scan job for server."
    }

    def callUpdate(scanJobId) {

        def jobId = scanJobId

        if (!jobId) {

            log.error("Cannot find job with ID: " + jobId)
            throw new IllegalArgumentException("Cannot find job.")
        }

        def address = "${scanJobUrl()}updateNow?id=${jobId}"

        callService(address)

        return "Running new scan job for WFS."
    }
}
