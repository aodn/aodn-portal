
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

        Server server = Server.get(serverId)

        if (!server) {

            throw new IllegalStateException("Cannot find Server with id: $serverId.")
        }

        if (!wfsScannerCallbackPassword) {

            throw new IllegalArgumentException("No WFS Scanner callback password set in config.")
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

            throw new IllegalStateException("WFS Scanner currently only supports Geoserver. Please change the server type and try again.")
        }

        return "Registered new scan job for server."
    }

    def callUpdate(jobId) {

        if (!jobId) {

            throw new IllegalArgumentException("Invalid value for jobId: $jobId")
        }

        def address = "${scanJobUrl()}updateNow?id=${jobId}"

        callService(address)

        return "Updated scan job $jobId"
    }
}
