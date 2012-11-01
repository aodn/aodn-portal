package au.org.emii.portal

class SplashController {
	
	def oceanCurrentService
	def portalInstance
	def hostVerifier

    // the home page center content
    def index = {
	    if (_pageCanBeProxied('index')) {
		    log.debug("Rendering configured index ${portalInstance.page('index')}")
		    _renderInclude('index')
	    }
	    else if (portalInstance.code()) {
		    log.debug("Rendering index ${portalInstance.code()}")
			def oceanCurrentObj = oceanCurrentService.getRandomDetails()
	        render(view: "${portalInstance.code()}Index", model:[ oceanCurrent: oceanCurrentObj])
	    }
	    else {
		    log.debug("Rendering empty index")
		    _renderEmptyResponse()
	    }
    }
    
    // links
	def links = {
		if (_pageCanBeProxied('links')) {
			log.debug("Rendering configured index ${portalInstance.page('links')}")
			_renderInclude('links')
		}
		else if (portalInstance.code()) {
			log.debug("Rendering links ${portalInstance.code()}")
			render(view: "${portalInstance.code()}Links")
		}
		else {
			log.debug("Rendering empty links")
			_renderEmptyResponse()
		}
	}
     
	// facebook twitter etc
	def community = {
		if (_pageCanBeProxied('community')) {
			log.debug("Rendering configured splash index ${portalInstance.page('community')}")
			_renderInclude('community')
		}
		else if (portalInstance.code()) {
			log.debug("Rendering community ${portalInstance.code()}")
			render(view: "${portalInstance.code()}Community")
		}
		else {
			log.debug("Rendering empty community")
			_renderEmptyResponse()
		}
	}

	def _pageCanBeProxied(page) {
		return portalInstance.page(page) && hostVerifier.allowedHost(request, portalInstance.page(page).toURL())
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
		proxiedRequest.proxy(false)
	}
}
