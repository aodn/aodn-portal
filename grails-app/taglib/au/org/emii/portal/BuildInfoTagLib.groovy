

package au.org.emii.portal

import grails.util.Environment

class BuildInfoTagLib {

    static namespace = "buildInfo"

    def grailsApplication

    def comment = { attrs, body ->
        out << "<!--$detailedInfo-->"
    }

    def summary = { attrs, body ->
        out << "Portal v${metadata.'app.version'}, build date: ${metadata.'app.build.date'}"
    }

    def detailed = { atts, body ->
        out << detailedInfo.replace('\n', '<br />\n')
    }

    def getDetailedInfo() {
        """
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
