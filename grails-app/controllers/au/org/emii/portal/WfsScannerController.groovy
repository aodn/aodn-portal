
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.converters.JSON

class WfsScannerController {


    //a call to register a job looks like this:
    //http://localhost:8200/wfsScanner/scanJob/register?serverUrl=http://geoserver.imos.org.au/geoserver/wfs&layerName=imos:csiro_harvest_pci&callbackUrl=http://localhost:8080/Portal2/filter/updateFilter&password=thefreakingpassword
    def callRegister = {
        //http://localhost:8080/Portal2/filter/updateFilter&password=thefreakingpassword
        Server server = Server.get(params.serverId)

        if (Config.activeInstance().wfsScannerCallbackPassword == null){
            flash.message = "Both settings: 'WmfsScannerBaseUrl' and 'WmfScannerCallbackPassword' must have values to use a WMS Scanner."
        }

        if (server.type.startsWith("GEO")){
            def address;

            if (params.layerName)
                address = "${_scanJobUrl()}register?serverUrl=${server.uri}&layerName=${params.layerName}&callbackUrl=${_saveOrUpdateCallbackUrl()}&password=${Config.activeInstance().wfsScannerCallbackPassword}"
            else
                address =  "${_scanJobUrl()}register?serverUrl=${server.uri}&callbackUrl=${_saveOrUpdateCallbackUrl()}&password=${Config.activeInstance().wfsScannerCallbackPassword}"

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

        redirect controller: "scanner", action: "index"
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


                address =  "${_scanJobUrl()}updateNow?id=${jobId}"

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

        redirect controller: "scanner", action: "index"
    }

    def _scanJobUrl() {

        def wfsScannerBaseUrl = grailsApplication.config.wfsScanner.url
        def slash = _optionalSlash( wfsScannerBaseUrl )

        return "${wfsScannerBaseUrl}${slash}scanJob/"
    }

    def _saveOrUpdateCallbackUrl() {

        def portalBaseUrl = grailsApplication.config.grails.serverURL
        def slash = _optionalSlash( portalBaseUrl )

        return "${portalBaseUrl}${slash}filter/updateFilter"
    }

    def _optionalSlash( url ) { // Todo - DN: Change to _ensureTrailingSlash

        return url[-1..-1] != "/" ? "/" : ""
    }

    //Not catching exception here
    def getStatus(){
        def callbackUrl = URLEncoder.encode( _saveOrUpdateCallbackUrl() )
        def scanJobList = []

        def url
        def conn

            url = "${ _scanJobUrl() }list?callbackUrl=$callbackUrl".toURL()
            conn = url.openConnection()
            conn.connect()

            scanJobList = JSON.parse( conn.content.text ) // Makes the call

        return scanJobList
    }


    def callDelete = {

        def callbackUrl = URLEncoder.encode( _saveOrUpdateCallbackUrl() )
        def address = "${ _scanJobUrl() }delete?id=${params.scanJobId}"

        def url
        def conn

        try {
            url = address.toURL()
            conn = url.openConnection()
            conn.connect()

            def response = executeCommand( conn )

            flash.message = response
        }
        catch (Exception e) {

            flash.message = e.message
        }

        redirect controller: "scanner", action: "index"

    }

    def executeCommand( conn ) {

        def response = conn.content.text // Executes command

        if ( response.toLowerCase().contains( "<html" ) ) {

            response = "HTML response (Code: ${ conn.responseCode })"
        }

        return response
    }


}
