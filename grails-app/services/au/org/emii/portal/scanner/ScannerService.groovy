
/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal.scanner

import grails.converters.JSON

abstract class ScannerService {

    def grailsApplication

    def portalBaseURL(){

		return _ensureTrailingSlash(grailsApplication.config.grails.serverURL)
    }

    abstract def saveOrUpdateCallbackUrl()

    def getStatus() {

        def callbackUrl = URLEncoder.encode( saveOrUpdateCallbackUrl() )

        def url = "${scanJobUrl()}list?callbackUrl=$callbackUrl"

        def content = callService(url)

        return JSON.parse( content )
    }

    abstract def getScannerBaseUrl()

    def scannerURL(){

		_ensureTrailingSlash(scannerBaseUrl)
    }

    def scanJobUrl() {

		return "${scannerURL()}scanJob/"
    }

    def executeCommand( conn ) {

        def response = conn.content.text // Executes command

        if ( response.toLowerCase().contains( "<html" ) ) {

            response = "HTML response (Code: ${ conn.responseCode })"
        }

        return response
    }

    def callService(address){

		def url = address.toURL()
        def conn = url.openConnection()
        conn.connect()

        return executeCommand( conn )
    }

	def _ensureTrailingSlash( s ) {

		if ( !s ) return "/"

		def slash = s[-1] != "/" ? "/" : ""

		return "$s$slash"
	}
}
