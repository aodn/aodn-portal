
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.converters.JSON

class WfsScannerController {
    def grailsApplication
    def wfsScannerService

    //a call to register a job looks like this:
    //http://localhost:8200/wfsScanner/scanJob/register?serverUrl=http://geoserver.imos.org.au/geoserver/wfs&layerName=imos:csiro_harvest_pci&callbackUrl=http://localhost:8080/Portal2/filter/updateFilter&password=thefreakingpassword
    def callRegister = {
        //http://localhost:8080/Portal2/filter/updateFilter&password=thefreakingpassword
        Server server = Server.get(params.serverId)

        if (Config.activeInstance().wfsScannerCallbackPassword == null){
            flash.message = "Both settings: 'WfsScannerBaseUrl' and 'WfScannerCallbackPassword' must have values to use a WFSScanner."
        }

        if (server.type.startsWith("GEO")){
            def address;

            if (params.layerName)
                address = "${wfsScannerService.scanJobUrl()}register?serverUrl=${server.uri}&layerName=${params.layerName}&callbackUrl=${wfsScannerService.saveOrUpdateCallbackUrl()}&password=${Config.activeInstance().wfsScannerCallbackPassword}&scanFrequency=${server.scanFrequency}"
            else
                address =  "${wfsScannerService.scanJobUrl()}register?serverUrl=${server.uri}&callbackUrl=${wfsScannerService.saveOrUpdateCallbackUrl()}&password=${Config.activeInstance().wfsScannerCallbackPassword}&scanFrequency=${server.scanFrequency}"

            try{
                def url = address.toURL()
                def conn = url.openConnection()
                conn.connect()

                def response = executeCommand( conn )

                flash.message = "Created WFS job for " + server.name + "."
            }
            catch(Exception e){
                flash.message = "Cannot contact WFS server to register job. "
                redirect controller: "scanner", action: "index"
            }

        }
        else{
            //say something about not support anything apart from geoserver for now
            log.info("WFSScanner currently only supports GEOSERVER")
            flash.message = "WFSScanner currently only supports GEOSERVER"
        }

        redirect controller: "server", action: "list"
    }


    def callUpdate = {
        def jobId = params.scanJobId
        def serverId = params.serverId

        def server = Server.get(serverId)

        if (jobId == null){
            flash.message = "Job does not exist"
            redirect controller: "scanner", action: "index"
        }

        if (serverId == null){
            flash.message = "Server does not exist"
            redirect controller: "scanner", action: "index"
        }
        else{
            if (server.type.startsWith("GEO")){
                def address;

                address =  "${wfsScannerService.scanJobUrl()}updateNow?id=${jobId}"

                def url = address.toURL()
                def conn = url.openConnection()
                conn.connect()

                def response = executeCommand( conn )

                flash.message = "Updating WFS server now"
            }
            else{
                //say something about not support anything apart from geoserver for now
                log.info("WFSScanner currently only supports GEOSERVER")
                flash.message = "WFSScanner currently only supports GEOSERVER"
            }
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

    def executeCommand( conn ) {

        def response = conn.content.text // Executes command

        if ( response.toLowerCase().contains( "<html" ) ) {

            response = "HTML response (Code: ${ conn.responseCode })"
        }

        return response
    }


}
