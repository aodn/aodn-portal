/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.converters.JSON

class ServerController {

    static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

    def grailsApplication

    def getInfo = {
        def server = params.server

        def serverInformation = grailsApplication.config.knownServers.find { it.uri == server }
        if (!serverInformation) {
            serverInformation = [:]
        }
        else {
            // Filter only the attributes we're passing to the client
            serverInformation = serverInformation.subMap(['uri', 'wmsVersion', 'type', 'csvDownloadFormat']).findAll { it.value }
        }

        render text: serverInformation as JSON
    }
}
