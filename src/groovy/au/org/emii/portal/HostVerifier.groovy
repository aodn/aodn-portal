/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import org.slf4j.Logger
import org.slf4j.LoggerFactory

class HostVerifier {

    static final Logger log = LoggerFactory.getLogger(this)

    def grailsApplication

    def allowedHost(request, address) {

        if (!address) {
            return false
        }

        try {
            def url = address.toURL()

            def allowed = false
            findAllowableServers(request).each {
                if (it.contains(url.host)) {
                    allowed = true
                }
            }
            return allowed
        }
        catch (Exception e) {

            log.error "Problem while validating host", e

            return false
        }
    }

    def retrieveResultsFromGeoNetwork(server) {
        def catalog = grailsApplication.config.geonetwork.url

        return new XmlParser().parse("$catalog/srv/eng/q?serverUrl=$server&fast=index&summaryOnly=true")
    }

    def extractServer(url) {
        return url.protocol + "://" + url.host + url.path
    }

    def findAllowableServers(request) {

        def allowableServers = []
        allowableServers.add request.getHeader("host")

        def appConfig = grailsApplication.config
        allowableServers.add appConfig.geonetwork.url

        allowableServers.add appConfig.baselayerServer.uri
        allowableServers.addAll appConfig.knownServers*.uri

        // Todo - This might be able to go. I don't think we use the splash screen anymore.
        def splashConfig = appConfig.portal.instance.splash
        _addIf allowableServers, splashConfig.index
        _addIf allowableServers, splashConfig.links
        _addIf allowableServers, splashConfig.community

        return allowableServers
    }

    def _addIf(list, value) {
        if (value) {
            list.add(value)
        }
    }
}
