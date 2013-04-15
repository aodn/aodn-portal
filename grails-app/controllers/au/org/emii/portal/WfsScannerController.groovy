
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

class WfsScannerController {
    def grailsApplication
    def wfsScannerService

    //a call to register a job looks like this:
    //http://localhost:8200/wfsScanner/scanJob/register?serverUrl=http://geoserver.imos.org.au/geoserver/wfs&layerName=imos:csiro_harvest_pci&callbackUrl=http://localhost:8080/Portal2/filter/updateFilter&password=thefreakingpassword
    def callRegister = {
        try {
            flash.message = wfsScannerService.callRegister(
				params.serverId,
				params.layerName,
				Config.activeInstance().wfsScannerCallbackPassword
			)
        }
        catch (Exception e) {

            log.debug("Error encountered while registering WFS scan job: " + e.message)
            flash.message = "Cannot contact WFS server to register job. "
        }

        redirect controller: "server", action: "list"
    }

    def callUpdate = {

        try {
            flash.message = wfsScannerService.callUpdate(params.scanJobId)
        }
        catch (Exception e) {

            log.debug("Error encounterd while updating WFS scan job: " + e.message)
            flash.message = e.message
        }

        redirect controller: "server", action: "list"
    }


    def callDelete = {

        try {
            flash.message = wfsScannerService.callDelete(params.scanJobId)
        }
        catch (Exception e) {

            flash.message = e.message
        }

        redirect controller: "server", action: "list"
    }
}
