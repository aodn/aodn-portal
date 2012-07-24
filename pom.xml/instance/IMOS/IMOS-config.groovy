// IMOS environment-specific settings

environments {

	prerelease {

        // URLs
		grails.serverURL = "http://imosportaldemo.aodn.org.au/portal"
		spatialsearch.url = "http://spatialsearchtest.emii.org.au/search/search/index"
		wmsScanner.url = "http://wmsscannerdev.aodn.org.au/wmsscanner/"
		openIdProvider.url = "https://devid.emii.org.au"

		dataSource {
			jndiName = "java:comp/env/jdbc/imosportal"
		}
	}

	production {

        // URLs
        grails.serverURL = "http://imos.aodn.org.au/webportal"
		spatialsearch.url = "http://imossearch.emii.org.au/search/search/index"
		wmsScanner.url = "http://wmsscanner.aodn.org.au/wmsscanner/"
		openIdProvider.url = "https://openid.emii.org.au"

        dataSource {
			jndiName = "java:comp/env/jdbc/imosportal"
		}
	}
}

// Change authentication emails for IMOS
portal.systemEmail.fromAddress = "info@emii.org.au"

portal.header.logo = "IMOS-wide-logo-white.png"

portal.header.organisationLink.linkText = "IMOS"
portal.header.organisationLink.tooltipText = "Integrated Marine Observing System"
portal.header.organisationLink.url = "http://imos.org.au/"