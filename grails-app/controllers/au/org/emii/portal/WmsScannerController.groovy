
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

    def serverTypesToShow = [ "WMS-1.1.1",
                              "WMS-1.3.0",
                              "NCWMS-1.1.1",
                              "NCWMS-1.3.0" ]

    def statusText = [ (0): "Enabled",
                      (-1): "Enabled<br />(errors&nbsp;occurred)",
                      (-2): "Stopped<br />(too&nbsp;many&nbsp;errors)" ]

    def controls = {
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

        def serversToList = Server.findAllByTypeInListAndAllowDiscoveries( serverTypesToShow, true, [ sort: "name" ])

        def currentUser = SecurityUtils.getSubject()
        if (!currentUser.isPermitted("wmsScanner:callUpdate")) {
            def principal = currentUser?.getPrincipal()
            def serverList = [];
            if (principal) {
                def userInstance = User.get(principal)

                if (!userInstance)
                {
                    log.error("No user found with id: " + principal)
                }
                else{
                    serverList = Server.withCriteria{
                        owners{
                            eq('id', userInstance.id)
                        }
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
                 wmsScannerBaseUrl: wmsScannerBaseUrl,
                 scanJobList: scanJobList,
                 statusText: statusText,
                 serversToList: serversToList
               ]
    }

    def callRegister = {

        def conf = Config.activeInstance()

        def url
        def conn

        try {
            Server server = Server.get( params.serverId )

            def versionVal = server.type.replace( "NCWMS-", "" ).replace( "WMS-", "" )

            def jobName     = URLEncoder.encode( "Server scan for '${server.name}'" )
            def jobDesc     = URLEncoder.encode( "Created by Portal, ${new Date().format( "dd/MM/yyyy hh:mm" )}" )
            def jobType     = "WMS"
            def wmsVersion  = URLEncoder.encode( versionVal )
            def uri         = URLEncoder.encode( server.uri )
            def callbackUrl = URLEncoder.encode( _saveOrUpdateCallbackUrl() )
            def callbackPassword = URLEncoder.encode( conf.wmsScannerCallbackPassword )
            def scanFrequency = server.scanFrequency

            def usernamePart = server.username ? "&username=" + URLEncoder.encode( server.username ) : ""
            def passwordPart = server.password ? "&password=" + URLEncoder.encode( server.password ) : ""

            // Perform action
            def address = "${ _scanJobUrl() }register?jobName=$jobName&jobDescription=$jobDesc&jobType=$jobType&wmsVersion=$wmsVersion&uri=$uri&callbackUrl=$callbackUrl&callbackPassword=$callbackPassword&scanFrequency=$scanFrequency$usernamePart$passwordPart"

            url = address.toURL()
            conn = url.openConnection()
            conn.connect()

            def response = executeCommand( conn )

            setFlashMessage response
        }
        catch (Exception e) {

            setFlashMessage e, conn
        }

        redirect action: "controls"
    }

    def callUpdate = {

        def conf = Config.activeInstance()

        def server = Server.findWhere( uri: params.scanJobUri )

        if ( !server ) {

            setFlashMessage "Unable to find server with uri: '${ params.scanJobUri }'"
            redirect action: "controls"
            return
        }

        def versionVal  = server.type.replace( "NCWMS-", "" ).replace( "WMS-", "" )

        def jobType     = "WMS"
        def wmsVersion  = URLEncoder.encode( versionVal )
        def uri         = URLEncoder.encode( server.uri )
        def callbackUrl = URLEncoder.encode( _saveOrUpdateCallbackUrl() )
        def callbackPassword = URLEncoder.encode( conf.wmsScannerCallbackPassword )
        def scanFrequency = server.scanFrequency

        def usernamePart = server.username ? "&username=" + URLEncoder.encode( server.username ) : ""
        def passwordPart = server.password ? "&password=" + URLEncoder.encode( server.password ) : ""

        def address = "${ _scanJobUrl() }update?id=${params.scanJobId}&callbackUrl=$callbackUrl&callbackPassword=$callbackPassword&jobType=$jobType&wmsVersion=$wmsVersion&uri=$uri&scanFrequency=$scanFrequency$usernamePart$passwordPart"

        def url
        def conn

        try {
            url = address.toURL()
            conn = url.openConnection()
            conn.connect()

            def response = executeCommand( conn )

            setFlashMessage response
        }
        catch (Exception e) {

            setFlashMessage e, conn
        }

        redirect action: "controls"
    }

    def callDelete = {

        def callbackUrl = URLEncoder.encode( _saveOrUpdateCallbackUrl() )
        def address = "${ _scanJobUrl() }delete?id=${params.scanJobId}&callbackUrl=$callbackUrl"

        def url
        def conn

        try {
            url = address.toURL()
            conn = url.openConnection()
            conn.connect()

            def response = executeCommand( conn )

            setFlashMessage response
        }
        catch (Exception e) {

            setFlashMessage e, conn
        }

        redirect action: "controls"
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
