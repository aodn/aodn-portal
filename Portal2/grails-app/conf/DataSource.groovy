dataSource {
    pooled = true
    //driverClassName = "org.hsqldb.jdbcDriver"
    //username = "sa"
    //password = ""
			
    //configure DBCP to test connections before using them and evict old connections (as per http://sacharya.com/grails-dbcp-stale-connections/)
    properties {
		minEvictableIdleTimeMillis=1800000
		timeBetweenEvictionRunsMillis=1800000
		numTestsPerEvictionRun=3
	}
}
hibernate {
    cache.use_second_level_cache = true
    cache.use_query_cache = true
    cache.provider_class = 'net.sf.ehcache.hibernate.EhCacheProvider'
}

// environment specific settings
environments {
	
   development {
       dataSource {
            //dbCreate = "update"
            driverClassName = "org.postgresql.Driver"
		    url = "jdbc:postgresql://localhost:5432/portal2"
            username = "postgres"
            password = "postgres"
     
            // logSql = true
            testOnBorrow = true
            validationQuery = "SELECT 1"
	   }
   }
   
   // This is purely here for liquibase's use when generating changelogs.
   dbdiff {
	   dataSource {
		   dbCreate = "create-drop"
		   driverClassName = "org.postgresql.Driver"
		   url = "jdbc:postgresql://dbdev.emii.org.au:5432/portal2_diff?ssl=true&tcpKeepAlive=true&sslfactory=org.postgresql.ssl.NonValidatingFactory"
		   username = "portal2user"
		   password = "wtingzgsfdbat"
	   }
   }

    test {
        dataSource {
            dbCreate = "create-drop"
            url = "jdbc:hsqldb:mem:testDb"
        }
    }
    production {
        dataSource {
            //dbCreate = "update"
            //url = "jdbc:hsqldb:file:prodDb;shutdown=true"

    
            // since there is no production DB yet, just use obsidian (geoff)
            // change this when the time comes...

            driverClassName = "org.postgresql.Driver"
            url = "jdbc:postgresql://dbdev.emii.org.au:5432/portal2?ssl=true&tcpKeepAlive=true&sslfactory=org.postgresql.ssl.NonValidatingFactory"

            username = "portal2user"
            password = "wtingzgsfdbat"
     
			// logSql = true
			testOnBorrow = true
			validationQuery = "SELECT 1"
        }
    }
}
