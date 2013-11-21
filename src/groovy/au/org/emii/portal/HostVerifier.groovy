/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

class HostVerifier {

    def grailsApplication

    def allowedHost(request, address) {

        if (!address) {
            return false
        }

        try {
            def url = address.toURL()

            def allowableServers = [request.getHeader("host"), Config.activeInstance().catalogUrl]
            allowableServers.addAll _fromConfig()
            allowableServers.addAll _fromKnownServers()

            def allowed = false
            allowableServers.each {
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
            return false
        }
    }

    def retrieveResultsFromGeoNetwork(server) {
        def catalog = Config.activeInstance().catalogUrl

        return new XmlParser().parse("$catalog/srv/eng/q?serverUrl=$server&fast=index&summaryOnly=true")
    }

    def extractServer(url) {
        return url.protocol + "://" + url.host + url.path
    }

    def _checkCatalog(url) {
        def containsHost = false
        def server = extractServer(url)
        def results = retrieveResultsFromGeoNetwork(server)

        if (results?.summary[0]?.'@count' != "0") {
            containsHost = true
        }
        return containsHost
    }

    def _fromConfig() {
        def result = []
        if (grailsApplication) {
            _addIf(result, grailsApplication.config.spatialsearch.url)
            _addIf(result, grailsApplication.config.portal.instance.splash.index)
            _addIf(result, grailsApplication.config.portal.instance.splash.links)
            _addIf(result, grailsApplication.config.portal.instance.splash.community)
        }
        return result
    }

    def _fromKnownServers() {
        return Server.list().collect { it.uri }
    }

    def _addIf(list, value) {
        if (value) {
            list.add(value)
        }
    }
}
