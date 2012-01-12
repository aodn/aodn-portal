package au.org.emii.portal

import grails.converters.JSON

class WmsScannerController {

    def grailsApplication
    def layerApiPath = "/layer/saveOrUpdate"
    
    def controls = {
        
        def baseUrl = Config.activeInstance().wmsScannerBaseUrl
        def callbackUrl = URLEncoder.encode( grailsApplication.config.grails.serverURL + layerApiPath )
        def scanJobList
        
        def url
        
        try {
            url = "${baseUrl}list?callbackUrl=$callbackUrl".toURL()
            
            scanJobList = JSON.parse( url.text )
        }
        catch (Exception e) {
            
            setFlashMessage e, url
            scanJobList = [] // Empty list
        }        
        
        return [scanJobList: scanJobList, serversToList: Server.findAllByTypeInList(["WMS-1.1.1", "WMS-1.3.0"], [sort: "name"])] // Todo DN - put WMS versions list in config
    }
    
    def callDeleteById = {
        
        def baseUrl = Config.activeInstance().wmsScannerBaseUrl
        def callbackUrl = URLEncoder.encode( grailsApplication.config.grails.serverURL + layerApiPath )
        def address = "${baseUrl}deleteById?id=${params.id}&callbackUrl=$callbackUrl"
        
        def url = address.toURL()        
        
        try {
            def response = url.text // Executes command
            
            setFlashMessage response
        }
        catch (Exception e) {
            
            setFlashMessage e, url
        }        
        
        redirect(action: controls)
    }
    
    def callRegister = {
        
        def baseUrl = Config.activeInstance().wmsScannerBaseUrl

        def url
        
        try {
            Server server = Server.get(params.id)
        
            def jobName     = URLEncoder.encode( "Server scan for '${server.name}'" )
            def jobDesc     = URLEncoder.encode( "Created by Portal, ${new Date()}" )
            def jobType     = "WMS"
            def wmsVersion  = URLEncoder.encode( server.type.replace("WMS-", "") )
            def uri         = URLEncoder.encode( server.uri )
            def callbackUrl = URLEncoder.encode( grailsApplication.config.grails.serverURL + layerApiPath )
            
            // Perform action
            def address = "${baseUrl}register?jobName=$jobName&jobDescription=$jobDesc&jobType=$jobType&wmsVersion=$wmsVersion&uri=$uri&callbackUrl=$callbackUrl"
        
            url = address.toURL()   
            
            def response = url.text // Executes command
            
            setFlashMessage response
        }
        catch (Exception e) {
            
            setFlashMessage e, url
        }
        
        redirect(action: controls)
    }
    
    private void setFlashMessage(String response) {
        
        flash.message = "Response: ${response}"
    }
    
    private void setFlashMessage(Exception e, URL commandUrl) {
        
        def msg = "Exception: ${ e.toString() }<br />Command url: $commandUrl"
        
        if ( flash.message?.trim() ) {
            
            flash.message += "<hr>$msg"
        }
        else {
            flash.message = msg
        }
    }
}