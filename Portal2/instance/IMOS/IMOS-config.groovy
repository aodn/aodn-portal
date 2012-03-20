// environment specific settings
// -DINSTANCE_NAME=IMOS
environments {
	
	production {
		dataSource {
			jndiName = "java:comp/env/jdbc/imos_portal"
		}
	}
}

portal.header.logo = "IMOS-wide-logo-white.png"