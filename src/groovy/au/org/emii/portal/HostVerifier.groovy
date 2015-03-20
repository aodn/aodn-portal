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

    def allowedHosts = null

    def allowedHost(address) {

        initializeAllowedHostsIfNeeded()

        if (!address) {
            return false
        }

        def host = extractHost(address)

        if (allowedHosts[host]) {
            return true
        }
        else {
            log.error "Not allowing request to address '${address}'"
            return false
        }
    }

    def extractHost(url) {
        return url.toURL().host
    }

    def initializeAllowedHostsIfNeeded() {
        if (!allowedHosts) {
            initializeAllowedHosts()
        }
    }

    private synchronized initializeAllowedHosts() {
        if(!allowedHosts) {
            def appConfig = grailsApplication.config
            allowedHosts = [:]
            allowedHosts[extractHost(appConfig.geonetwork.url)] = true
            allowedHosts[extractHost(appConfig.baselayerServer.uri)] = true

            appConfig.knownServers.each { server ->
                allowedHosts[extractHost(server.uri)] = true
            }
        }
    }
}
