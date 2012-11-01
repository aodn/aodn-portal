package au.org.emii.portal

class HostVerifier {

	def grailsApplication

	def allowedHost(request, url) {

		def allowableServers = [request.getHeader("host"), Config.activeInstance().catalogUrl]
		allowableServers.addAll(_fromConfig())
		// allow hosts we consider valid. from our list of wms servers first
		allowableServers.addAll(Server.list().collect { it.uri })

		def allowed = false
		allowableServers.each {
			if (it.contains( url.getHost() )) {
				allowed = true
			}
		}
		return allowed
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

	def _addIf(list, value) {
		if (value) {
			list.add(value)
		}
	}
}
