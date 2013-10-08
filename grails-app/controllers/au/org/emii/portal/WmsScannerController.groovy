
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.converters.JSON
import org.apache.shiro.SecurityUtils

class WmsScannerController {
    def grailsApplication
    def wmsScannerService

    def serverTypesToShow = [ "WMS-1.1.1",
                              "WMS-1.3.0",
                              "NCWMS-1.1.1",
                              "NCWMS-1.3.0",
                              "GEO-1.1.1",
                              "GEO-1.3.0"]

    def statusText = [ (0): "Enabled",
                      (-1): "Enabled<br />(errors&nbsp;occurred)",
                      (-2): "Stopped<br />(too&nbsp;many&nbsp;errors)" ]

    def controls = {
        def conf = Config.activeInstance()
        def wmsScannerBaseUrl = wmsScannerService.scannerURL()

        // Check if WMS Scanner settings are valid
        if ( !wmsScannerBaseUrl || !conf.wmsScannerCallbackPassword ) {

            flash.message = "Both settings: 'WmsScannerBaseUrl' and 'WmsScannerCallbackPassword' must have values to use a WMS Scanner."

            return [ configInstance: conf, wmsScannerBaseUrl: wmsScannerBaseUrl, scanJobList: [], statusText: statusText, serversToList: [] ]
        }

        def callbackUrl = URLEncoder.encode( wmsScannerService.saveOrUpdateCallbackUrl() )
        def scanJobList

        def url
        def conn

        try {
            url = "${ wmsScannerService.scanJobUrl() }list?callbackUrl=$callbackUrl".toURL()
            conn = url.openConnection()
            conn.connect()

            scanJobList = JSON.parse( conn.content.text ) // Makes the call
        }
        catch (Exception e) {

            setFlashMessage e, conn
            scanJobList = [] // Empty list
        }

        def serversToList = Server.findAllByTypeInListAndAllowDiscoveries( serverTypesToShow, true, [ sort: "name" ])

        def currentUser = SecurityUtils.getSubject()
        if (!currentUser.isPermitted("wmsScanner:callUpdate")) {
            def serverList = [];
            def userInstance = User.current();
            if (userInstance){
                serverList = Server.withCriteria{
                    owners{
                        eq('id', userInstance.id)
                    }
                }
            }
            def allowedUris = serverList*.getUri()

            def allowedJobs = []
            for (job in scanJobList) {
                if (allowedUris.contains(job.uri)) {
                    allowedJobs += job
                }
            }
            scanJobList = allowedJobs


            def allowedServers = []
            for (server in serversToList) {
                if (allowedUris.contains(server.uri)) {
                    allowedServers += server
                }
            }
            serversToList = allowedServers
        }

        return [ configInstance: conf,
                 wmsScannerBaseUrl: grailsApplication.config.wmsScanner.url,
                 scanJobList: scanJobList,
                 statusText: statusText,
                 serversToList: serversToList
               ]
    }

    def callRegister = {

        def conf = Config.activeInstance()

        try {
            setFlashMessage wmsScannerService.callRegister(params.serverId, conf.wmsScannerCallbackPassword)
        }
        catch (Exception e) {

            setFlashMessage e.message
        }

        redirect controller: "server", action: "list"
    }

    def callUpdate = {
        def conf = Config.activeInstance()

        try {
            def response = wmsScannerService.callUpdate(params.scanJobId, params.scanJobUri, conf.wmsScannerCallbackPassword)
            setFlashMessage response
        }
        catch (Exception e) {

            setFlashMessage e.message
        }

        redirect controller: "server", action: "list"
    }

    def callDelete = {

        try {
            setFlashMessage wmsScannerService.callDelete(params.scanJobId)
        }
        catch (Exception e) {

            setFlashMessage e.message
        }

        redirect controller: "server", action: "list"

    }

    private void setFlashMessage(String response) {

        flash.message = "Response: $response"

    }

    private void setFlashMessage(e, connection) {

        def msg = ""

        if ( connection?.errorStream ) {

            Reader reader = new BufferedReader( new InputStreamReader( connection.errorStream ) )
            def currentLine

            while ( ( currentLine = reader.readLine() ) != null ) {

                msg += "<br /><b>$currentLine</b>"
            }

            if ( msg.toLowerCase().contains( "<html" ) ) {

                msg = "<br /><i>HTML response (HTTP code: ${connection.responseCode})</i>"
            }

            msg = "<br />Response: $msg"
        }

        msg = "$e$msg"

        if ( flash.message?.trim() ) {

            flash.message += "<hr>$msg"
        }
        else {
            flash.message = msg
        }
    }

    def executeCommand( conn ) {

        def response = conn.content.text // Executes command

        if ( response.toLowerCase().contains( "<html" ) ) {

            response = "HTML response (Code: ${ conn.responseCode })"
        }

        return response
    }
}
