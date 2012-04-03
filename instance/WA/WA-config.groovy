def appName = 'WA'

environments {
	
	development {
		dataSource {
            driverClassName = "org.postgresql.Driver"
		    url = "jdbc:postgresql://localhost:5432/portal_wa_development"
            username = "postgres"
            password = "postgres"
		}
	}
	
	production {
		dataSource {
			driverClassName = "org.postgresql.Driver"
			url = "jdbc:postgresql://db.emii.org.au:5432/portal_wa_test"
			username = "postgres"
			password = "postgres"
		}
	}
}
