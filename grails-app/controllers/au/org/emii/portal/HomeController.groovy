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
    def portalBranding

    static final def CONFIG_KEYS_TO_IGNORE = [ "log4j", "beans" ]

    def index = { // This is the main portal entry
        [
            resourceVersionNumber: grailsApplication.metadata.'app.version',
            portalBranding: portalBranding
        ]
    }

    def config = {

        // Workaround a problem converting to JSON (trying to convert the filtered
        // items results in an exception - the keys defined in CONFIG_KEYS_TO_IGNORE
        // contain closures, which don't play well when with JSON converters.
        def filteredConfig = grailsApplication.config.findAll {
            k, v ->
            !CONFIG_KEYS_TO_IGNORE.contains(k)
        }

        render(contentType: "text/json", text: filteredConfig as JSON)
    }

    def footerContent = {
        render text: portalBranding.footerContent
    }

    def css = {
        render text: portalBranding.css
    }
}
