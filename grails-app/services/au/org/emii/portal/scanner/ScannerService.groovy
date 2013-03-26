package au.org.emii.portal.scanner

import grails.converters.JSON

/**
 * Created with IntelliJ IDEA.
 * User: pmak
 * Date: 26/03/13
 * Time: 12:31 PM
 * To change this template use File | Settings | File Templates.
 */
class ScannerService {
    def grailsApplication

    def _optionalSlash( url ) { // Todo - DN: Change to _ensureTrailingSlash

        return url[-1..-1] != "/" ? "/" : ""
    }

    def portalBaseURL(){
        def portalBaseUrl = grailsApplication.config.grails.serverURL
        def slash = _optionalSlash( portalBaseUrl )
        return "${portalBaseUrl}${slash}"
    }

    def saveOrUpdateCallbackUrl(){
        return ""
    }

    def getStatus() {
        println "getStatus"
        def callbackUrl = URLEncoder.encode( saveOrUpdateCallbackUrl() )

        def scanJobList = []

        def url
        def conn

        url = "${scanJobUrl()}list?callbackUrl=$callbackUrl".toURL()

        println "${scanJobUrl()}list?callbackUrl=$callbackUrl"
        conn = url.openConnection()
        conn.connect()

        scanJobList = JSON.parse( conn.content.text ) // Makes the call

        return scanJobList
    }



    def scannerURL(){
        //defined in subclasses
    }


    def scanJobUrl() {
        return "${scannerURL()}${slash}scanJob/"
    }

    def executeCommand( conn ) {

        def response = conn.content.text // Executes command

        if ( response.toLowerCase().contains( "<html" ) ) {

            response = "HTML response (Code: ${ conn.responseCode })"
        }

        return response
    }
}
