package au.org.emii.portal

import grails.converters.JSON

class WmsScannerController {

    def controls = {
        
        def baseUrl = Config.activeInstance().wmsScannerBaseUrl
        def scanJobList
        
        try {
            scanJobList = JSON.parse( "$baseUrl/list".toURL().text )
        }
        catch (Exception e) {
            
            flash.message = "Exception: ${e.toString()}"
            scanJobList = [] // Empty list
        }        
        
        return [scanJobList: scanJobList, serversToList: Server.findAllByTypeInList(["WMS-1.1.1", "WMS-1.3.0"], [sort: "name"])]
    }
    
    def callDeleteById = {
        
        def baseUrl = Config.activeInstance().wmsScannerBaseUrl
        def address = "$baseUrl/deleteById?id=${params.id}"
        
        def url = address.toURL()        
        
        try {
            flash.message = "Response: ${url.text}"
        }
        catch (Exception e) {
            
            flash.message = "Exception: ${e.toString()}"
        }        
        
        redirect(action: controls)
    }
    
    def callRegister = {
        
        def baseUrl = Config.activeInstance().wmsScannerBaseUrl
                    
        try {
            Server server = Server.get(params.id)
        
            def jobName = URLEncoder.encode( "Server scan for '${server.name}'" )
            def jobDesc = URLEncoder.encode( "Created by Portal, ${new Date()}" )
            def jobType = "WMS"
            def version = URLEncoder.encode( server.type.replace("WMS-", "") )
            def uri = URLEncoder.encode( server.uri )
            
            // Perform action
            def address = "$baseUrl/register?jobName=$jobName&jobDescription=$jobDesc&jobType=$jobType&version=$version&uri=$uri"
        
            def url = address.toURL()        
        
            flash.message = "Response: ${url.text}"
        }
        catch (Exception e) {
            
            flash.message = "Exception: ${e.toString()}"
        }        
        
        redirect(action: controls)
    }
}