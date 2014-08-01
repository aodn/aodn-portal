/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

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
            jsVerNum: grailsApplication.metadata.'app.version'
        ]
    }

    def config = {

        // Workaround a problem converting to JSON (trying to convert the filtered 
        // items results in an exception - not exactly sure what's going on there
        // but we don't need these items' config on the front-end, so let's just
        // not do it).
        def filteredConfig = grailsApplication.config.findAll {

            k, v ->

            ![
                "aodaacAggregator",
                "log4j",

             ].contains(k)
        }

        render(contentType: "text/json", text: filteredConfig as JSON)
    }
}
