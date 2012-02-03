package au.org.emii.portal

import grails.converters.JSON

class WmsScannerController {

    def layerApiPath = "layer/saveOrUpdate"

    def serverTypesToShow = [ "WMS-1.1.1",
                              "WMS-1.3.0",
                              "NCWMS-1.1.1",
                              "NCWMS-1.3.0" ]

    def statusText = [ (0): "Running",
                      (-1): "Running<br>(with&nbsp;errors)",
                      (-2): "Stopped<br>(too&nbsp;many&nbsp;errors)" ]
    
    def controls = {
        
        def conf = Config.activeInstance()
        
        // Check if WMS Scanner settings are valid
        if ( !conf.wmsScannerBaseUrl || !conf.wmsScannerCallbackUsername || !conf.wmsScannerCallbackPassword ) {
            
            flash.message = "All three settings: 'WmsScannerBaseUrl', 'WmsScannerCallbackUsername', and 'WmsScannerCallbackPassword' must have values to use a WMS Scanner."
            
            return [ configInstance: conf, scanJobList: [], statusText: statusText, serversToList: [] ]
        }
        
        def apiUrl = conf.wmsScannerBaseUrl + "scanJob/"
        def callbackUrl = URLEncoder.encode( conf.applicationBaseUrl + layerApiPath )
        def scanJobList
        
        def url
        def conn
        
        try {
            url = "${apiUrl}list?callbackUrl=$callbackUrl".toURL()
            conn = url.openConnection()
            conn.connect()
            
            scanJobList = JSON.parse( conn.content.text ) // Makes the call
        }
        catch (Exception e) {
            
            setFlashMessage e, url, conn
            scanJobList = [] // Empty list
        }
        
        return [ configInstance: conf,
                 scanJobList: scanJobList,
                 statusText: statusText,
                 serversToList: Server.findAllByTypeInListAndAllowDiscoveries( serverTypesToShow, true, [ sort: "name" ] )
               ]
    }

    def callRegister = {
        
        def conf = Config.activeInstance()
        
        def apiUrl = conf.wmsScannerBaseUrl + "scanJob/"

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
            def callbackUrl = URLEncoder.encode( conf.applicationBaseUrl + layerApiPath )
            def callbackUsername = URLEncoder.encode( conf.wmsScannerCallbackUsername )
            def callbackPassword = URLEncoder.encode( conf.wmsScannerCallbackPassword )
            def scanFrequency = server.scanFrequency
            
            // Perform action
            def address = "${apiUrl}register?jobName=$jobName&jobDescription=$jobDesc&jobType=$jobType&wmsVersion=$wmsVersion&uri=$uri&callbackUrl=$callbackUrl&callbackUsername=$callbackUsername&callbackPassword=$callbackPassword&scanFrequency=$scanFrequency"
        
            url = address.toURL()   
            conn = url.openConnection()
            conn.connect()
            
            def response = conn.content.text // Executes command
            
            setFlashMessage response
        }
        catch (Exception e) {
            
            setFlashMessage e, url, conn
        }

        redirect(action: "controls")
    }

    def callUpdate = {

        def conf = Config.activeInstance()
        
        def server = Server.findWhere( uri: params.scanJobUri )
        
        def versionVal  = server.type.replace( "NCWMS-", "" ).replace( "WMS-", "" )
        
        def jobType     = "WMS"
        def wmsVersion  = URLEncoder.encode( versionVal )
        def uri         = URLEncoder.encode( server.uri )
        def callbackUrl = URLEncoder.encode( conf.applicationBaseUrl + layerApiPath )
        def callbackUsername = URLEncoder.encode( conf.wmsScannerCallbackUsername )
        def callbackPassword = URLEncoder.encode( conf.wmsScannerCallbackPassword )
        def scanFrequency = server.scanFrequency
        
        def apiUrl = Config.activeInstance().wmsScannerBaseUrl + "scanJob/"
        def address = "${apiUrl}update?id=${params.scanJobId}&callbackUrl=$callbackUrl&callbackUsername=$callbackUsername&callbackPassword=$callbackPassword&jobType=$jobType&wmsVersion=$wmsVersion&uri=$uri&scanFrequency=$scanFrequency"
        
        def url
        def conn
        
        try {
            url = address.toURL()
            conn = url.openConnection()
            conn.connect()
            
            def response = conn.content.text // Executes command
            
            setFlashMessage response
        }
        catch (Exception e) {
            
            setFlashMessage e, url, conn
        }        
        
        redirect(action: "controls")
    }
    
    def callDelete = {
        
        def conf = Config.activeInstance()
        
        
        def apiUrl = conf.wmsScannerBaseUrl + "scanJob/"
        def callbackUrl = URLEncoder.encode( conf.applicationBaseUrl + layerApiPath )
        def address = "${apiUrl}delete?id=${params.scanJobId}&callbackUrl=$callbackUrl"
        
        def url
        def conn
        
        try {
            url = address.toURL()
            conn = url.openConnection()
            conn.connect()
            
            def response = conn.content.text // Executes command
            
            setFlashMessage response
        }
        catch (Exception e) {
            
            setFlashMessage e, url, conn
        }        
        
        redirect(action: "controls")
    }
        
    private void setFlashMessage(String response) {
        
        flash.message = "Response: ${response}"
    }
    
    private void setFlashMessage(e, commandUrl, connection) {
        
        def msg = "Exception: ${ e.toString() }"
        
        if ( connection?.errorStream ) {

            Reader reader = new BufferedReader( new InputStreamReader( connection.errorStream ) )
            def currentLine

            msg += "<br />Response: "
            
            while ( ( currentLine = reader.readLine() ) != null ) {

                msg += "<br /><b>$currentLine</b>"
            }
        }
        
        if ( flash.message?.trim() ) {
            
            flash.message += "<hr>$msg"
        }
        else {
            flash.message = msg
        }
    }
}