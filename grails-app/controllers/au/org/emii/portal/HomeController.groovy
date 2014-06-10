/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.util.Environment
import grails.converters.JSON

class HomeController {

    def grailsApplication
    def portalInstance

    def index = { // This is the main portal entry

        // Intercept OpenID verification calls
        if (params["openid.return_to"]) {

            forward controller: "auth", action: "verifyResponse"
        }

        [
            configInstance: Config.activeInstance(),
            buildInfo: _appBuildInfo(),
            jsVerNum: grailsApplication.metadata.'app.version'
        ]
    }

    def config = {
        render(contentType: "text/json", text: grailsApplication.config.toProperties() as JSON)
    }

    def _appBuildInfo = {

        def cfg = grailsApplication.config
        def md = grailsApplication.metadata

        if (Environment.current == Environment.PRODUCTION) {

            return "<!-- ${ portalInstance.name() } Portal v${ md.'app.version' }, build date: ${ md.'app.build.date' ?: "not recorded" } -->"
        }

        return """\
<!--
    [Portal Build Info]
    Base URL:      ${ cfg.grails.serverURL }
    Build date:    ${ md.'app.build.date' ?: "Unk." }
    Version:       ${ md.'app.version' }
    Instance name: ${ portalInstance.name() }
    Environment:   ${ Environment.current.name }
-->"""
    }
}
