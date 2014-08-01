/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.converters.JSON
import org.hibernate.mapping.Array

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
            jsVerNum: grailsApplication.metadata.'app.version'
        ]
    }

    def config = {
        render(contentType: "text/json", text: grailsApplication.config.toProperties() as JSON)
    }
}
