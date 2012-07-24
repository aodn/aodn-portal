// AODN environment-specific settings

environments {

	development {
		// URLs
		spatialsearch.url = "http://search.aodn.org.au/search/search/index"
	}
	
	integration {
		
		// URLs
		grails.serverURL = "http://portaldev.aodn.org.au/Portal2"
		spatialsearch.url = "http://spatialsearchtest.emii.org.au/search/search/index"
		wmsScanner.url = "http://wmsscannerdev.aodn.org.au/wmsscanner/"
		openIdProvider.url = "https://devid.emii.org.au"

		dataSource {
			jndiName = "java:comp/env/jdbc/aodnportal"
		}
	}
	
	prerelease {

        // URLs
		grails.serverURL = "http://portaldemo.aodn.org.au/portal"
		spatialsearch.url = "http://spatialsearchtest.emii.org.au/search/search/index"
		wmsScanner.url = "http://wmsscannerdev.aodn.org.au/wmsscanner/"
		openIdProvider.url = "https://devid.emii.org.au"

		dataSource {
			jndiName = "java:comp/env/jdbc/aodnportal"
		}
	}
	
	production {

        // URLs
		grails.serverURL = "http://portal.aodn.org.au/webportal"
		spatialsearch.url = "http://search.aodn.org.au/search/search/index"
		wmsScanner.url = "http://wmsscanner.aodn.org.au/wmsscanner/"
		openIdProvider.url = "https://openid.emii.org.au"

        dataSource {
			jndiName = "java:comp/env/jdbc/aodnportal"
		}
	}
}

portal.systemEmail.fromAddress = "info@aodn.org.au"
