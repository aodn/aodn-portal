// environment specific settings
// -DINSTANCE_NAME=IMOS
environments {
	
	production {
		grails.serverURL = "http://imosportal.emii.org.au/portal"
		spatialsearch.url = "http://imossearch.emii.org.au/search/search/index"
		wmsScanner.url = "http://preview.emii.org.au/wms_scanner/"
		dataSource {
			jndiName = "java:comp/env/jdbc/imosportal"
		}
	}
}

portal.header.logo = "IMOS-wide-logo-white.png"