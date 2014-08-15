/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.util.Environment

class BuildInfoTagLib {

    static namespace = "buildInfo"

    def grailsApplication
    def portalInstance

    def comment = { attrs, body ->
        out << "<!--$detailedInfo-->"
    }

    def summary = { attrs, body ->
        out << "${portalInstance.name()} Portal v${metadata.'app.version'}, build date: ${metadata.'app.build.date'}"
    }

    def detailed = { atts, body ->
        out << detailedInfo.replace('\n', '<br />\n')
    }

    def getDetailedInfo() {
        """
            Instance name: ${portalInstance.name()}
            App version: ${metadata.'app.version'}
            Build date: ${metadata.'app.build.date'}
            Build number: ${metadata.'app.build.number'}
            Git ref: ${metadata.'app.build.scmRevision'}
        """
    }

    def getMetadata() {
        grailsApplication.metadata
    }
}
