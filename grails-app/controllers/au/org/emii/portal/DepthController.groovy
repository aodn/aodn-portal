/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

class DepthController {

    def grailsApplication

    def index = {

        if (!params.lat || !params.lon) {

            render "Incorrect parameters supplied"
        }
        else {

            def serviceUrl = _generateServiceUrl()

            if (serviceUrl) {

                def response = serviceUrl.text // Call service

                render text: response, contentType: "text/xml", encoding: "UTF-8"
            }
            else {
                render "This service is unavailable"
            }
        }
    }

    def _generateServiceUrl = {

        def serviceAddress = grailsApplication.config.depthService.url

        if (!serviceAddress) {
            return null
        }

        return "${serviceAddress}.xml?lat=${params.lat}&lon=${params.lon}".toURL()
    }
}
