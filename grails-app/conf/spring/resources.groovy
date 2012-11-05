import grails.util.Environment

// Place your Spring DSL code here
beans = {

	hostVerifier(au.org.emii.portal.HostVerifier) { bean ->
		grailsApplication = ref('grailsApplication')
	}

	portalInstance(au.org.emii.portal.config.PortalInstance) { bean ->
		grailsApplication = ref('grailsApplication')
	}
}
