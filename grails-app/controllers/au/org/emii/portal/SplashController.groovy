/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import au.org.emii.portal.proxying.ProxiedRequest

class SplashController {

    def oceanCurrentService
    def portalInstance
    def hostVerifier

    // the home page center content
    def index = {

        if (_pageCanBeProxied('index')) {
            log.debug("Rendering configured index page ${portalInstance.page('index')}")
            _renderInclude('index')
        }
        else if (portalInstance.code()) {
            log.debug("Rendering index ${portalInstance.code()}")
            def oceanCurrentObj = oceanCurrentService.getRandomDetails()
            render(view: "${portalInstance.code()}Index", model: [oceanCurrent: oceanCurrentObj, cfg: Config.activeInstance(), portalBuildInfo: _portalBuildInfo()])
        }
        else {
            log.debug("Rendering empty index")
            _renderEmptyResponse()
        }
    }

    // links
    def links = {
        if (_pageCanBeProxied('links')) {
            log.debug("Rendering configured links page ${portalInstance.page('links')}")
            _renderInclude('links')
        }
        else if (portalInstance.code()) {
            log.debug("Rendering links ${portalInstance.code()}")
            def oceanCurrentObj = oceanCurrentService.getRandomDetails()
            render(view: "${portalInstance.code()}Links", model: [oceanCurrent: oceanCurrentObj, cfg: Config.activeInstance()])
        }
        else {
            log.debug("Rendering empty links")
            _renderEmptyResponse()
        }
    }

    // facebook twitter etc
    def community = {
        if (_pageCanBeProxied('community')) {
            log.debug("Rendering configured community page ${portalInstance.page('community')}")
            _renderInclude('community')
        }
        else if (portalInstance.code()) {
            log.debug("Rendering community ${portalInstance.code()}")
            render(view: "${portalInstance.code()}Community", cfg: Config.activeInstance())
        }
        else {
            log.debug("Rendering empty community")
            _renderEmptyResponse()
        }
    }

    def _pageCanBeProxied(page) {
        return portalInstance.page(page) && hostVerifier.allowedHost(portalInstance.page(page))
    }

    def _renderInclude(page) {
        _proxy(portalInstance.page(page))
    }

    def _renderEmptyResponse() {
        render ''
    }

    def _proxy(url) {
        params.url = url
        def proxiedRequest = new ProxiedRequest(request, response, params)
        proxiedRequest.proxy()
    }

    def _portalBuildInfo() {

        def md = grailsApplication.metadata
        return "${ portalInstance.name() } Portal v${ md.'app.version' }, build date: ${md.'app.build.date' ?: '<i>not recorded</i>'}"
    }
}
