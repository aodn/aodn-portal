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
        out << "<!--\n"
        detailed.call(attrs, body)
        out << "\n-->"
    }

    def summary = { attrs, body ->
        out << "${portalInstance.name()} Portal v${grailsApplication.metadata.'app.version'}, build date: ${grailsApplication.metadata.'app.build.date'}"
    }

    def detailed = { atts, body ->
        out << """Instance name: ${portalInstance.name()} <br />
Environment: ${Environment.current.name} <br />
App version: ${grailsApplication.metadata.'app.version'} <br />
Build date: ${grailsApplication.metadata.'app.build.date'} <br />
Build number:  ${grailsApplication.metadata.'app.build.number'} <br />
Git ref: ${grailsApplication.metadata.'app.build.scmRevision'} <br />"""
    }
}
