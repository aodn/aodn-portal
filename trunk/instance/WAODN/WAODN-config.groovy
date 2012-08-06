// WAODN environment-specific settings

environments {
	
	development {
		spatialsearch.url = "http://search.aodn.org.au/search/search/index"
	}

    prerelease {

        // URLs
        grails.serverURL = "http://wa.aodn.org.au/portal"
        spatialsearch.url = "http://search.aodn.org.au/search/search/index"
        wmsScanner.url = "http://wmsscanner.aodn.org.au/wmsscanner/"
        openIdProvider.url = "https://devid.emii.org.au"

        dataSource {
            jndiName = "java:comp/env/jdbc/waportal"
        }
    }

	production {
		grails.serverURL = "http://wa.aodn.org.au/portal"
		spatialsearch.url = "http://search.aodn.org.au/search/search/index"
        wmsScanner.url = "http://wmsscanner.aodn.org.au/wmsscanner/"
		openIdProvider.url = "https://openid.emii.org.au"

		dataSource {
            jndiName = "java:comp/env/jdbc/waportal"
		}
	}
}

portal.systemEmail.fromAddress = "info@aodn.org.au"
portal.header.logo = "WAODN_logo.png"

portal.header.organisationLink.linkText = "WAODN"
portal.header.organisationLink.tooltipText = "Western Australian Ocean Data Network"
portal.header.organisationLink.url = "http://imos.org.au/aodn.html"