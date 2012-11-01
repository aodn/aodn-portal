package au.org.emii.portal.config

class PortalInstance {

	def grailsApplication

	def name() {
		return grailsApplication.config.portal.instance.name
	}

	def code() {
		if (name()) {
			return name().toLowerCase()
		}
		return null
	}

	def page(page) {
		return grailsApplication.config.portal.instance.splash."$page"
	}
}
