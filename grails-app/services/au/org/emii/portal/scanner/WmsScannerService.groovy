
/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal.scanner

import au.org.emii.portal.Server

class WmsScannerService extends ScannerService {

    static transactional = true
    static lazyInit = false

    public WmsScannerService() {

        super()
    }

    def getScannerBaseUrl() {

		return grailsApplication.config.wmsScanner.url
    }

    def saveOrUpdateCallbackUrl() {

		return "${portalBaseURL()}layer/saveOrUpdate"
    }

    def callDelete(scanJobId) {
        if (scanJobId == null) {
            return "No job specified"
        }

        def address = "${ scanJobUrl() }delete?id=${scanJobId}&callbackUrl=${saveOrUpdateCallbackUrl()}"
        callService(address)

        return "Deleted"
    }

    def callUpdate(scanJobId, scanJobUri, wmsScannerCallbackPassword) {

        def server = Server.findWhere(uri: scanJobUri)

        if (!server) {
            throw new IllegalArgumentException("Unable to find server with uri: '${ scanJobUri }'")
        }

        def versionVal = server.type.replace("NCWMS-", "").replace("WMS-", "").replace("GEO-", "")

        def jobType = "WMS"
        def wmsVersion = URLEncoder.encode(versionVal)
        def uri = URLEncoder.encode(server.uri)
        def callbackUrl = URLEncoder.encode(saveOrUpdateCallbackUrl())
        def callbackPassword = URLEncoder.encode(wmsScannerCallbackPassword)
        def scanFrequency = server.scanFrequency

        def usernamePart = server.username ? "&username=" + URLEncoder.encode(server.username) : ""
        def passwordPart = server.password ? "&password=" + URLEncoder.encode(server.password) : ""

        def address = "${ scanJobUrl() }update?id=${scanJobId}&callbackUrl=$callbackUrl&callbackPassword=$callbackPassword&jobType=$jobType&wmsVersion=$wmsVersion&uri=$uri&scanFrequency=$scanFrequency$usernamePart$passwordPart"

        callService(address)

        return "Updated"
    }

    def callRegister(serverId, wmsScannerCallbackPassword) {

        Server server = Server.get(serverId)

        def versionVal = server.type.replace("NCWMS-", "").replace("WMS-", "").replace("GEO-", "")

        def jobName = URLEncoder.encode("Server scan for '${server.name}'")
        def jobDesc = URLEncoder.encode("Created by Portal, ${new Date().format("dd/MM/yyyy hh:mm")}")
        def jobType = "WMS"
        def wmsVersion = URLEncoder.encode(versionVal)
        def uri = URLEncoder.encode(server.uri)
        def callbackUrl = URLEncoder.encode(saveOrUpdateCallbackUrl())
        def callbackPassword = URLEncoder.encode(wmsScannerCallbackPassword)
        def scanFrequency = server.scanFrequency

        def usernamePart = server.username ? "&username=" + URLEncoder.encode(server.username) : ""
        def passwordPart = server.password ? "&password=" + URLEncoder.encode(server.password) : ""

        // Perform action
        def address = "${scanJobUrl() }register?jobName=$jobName&jobDescription=$jobDesc&jobType=$jobType&wmsVersion=$wmsVersion&uri=$uri&callbackUrl=$callbackUrl&callbackPassword=$callbackPassword&scanFrequency=$scanFrequency$usernamePart$passwordPart"

        callService(address)

        return "Registered"
    }
}
