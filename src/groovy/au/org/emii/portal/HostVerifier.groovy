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

            /*if allowed is still false then server isn't us, our catalog or in our wms servers list,
                but it might have been retrieved from geonetwork, so we check if its registered
                as a layer server with geonetwork*/
            if (!allowed) {
                allowed = _checkCatalog(url)
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

    def _checkCatalog(url) {

        log.info "Resorting to catalogue check for '$url'"

        def containsHost = false
        def server = extractServer(url)
        def results = retrieveResultsFromGeoNetwork(server)

        if (results?.summary[0]?.'@count' != "0") {
            containsHost = true
        }
        return containsHost
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

        allowableServers.addAll _fromServersInDatabase() // Todo - Can be removed when we go full stateless

        return allowableServers
    }

    def _fromServersInDatabase() {
        return Server.list().collect { it.uri }
    }

    def _addIf(list, value) {
        if (value) {
            list.add(value)
        }
    }
}
