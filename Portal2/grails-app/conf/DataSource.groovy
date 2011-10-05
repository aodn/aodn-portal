dataSource {
    pooled = true
    //driverClassName = "org.hsqldb.jdbcDriver"
    //username = "sa"
    //password = ""
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
          // dbCreate = "update" // one of 'create', 'create-drop','update'
            url = "jdbc:postgresql://dbdev.emii.org.au:5432/portal2?ssl=true&sslfactory=org.postgresql.ssl.NonValidatingFactory"
            username = "portal2user"
            password = "wtingzgsfdbat"

           // logSql = true
       }
   }
    test {
        dataSource {
            //dbCreate = "update"
            //url = "jdbc:hsqldb:mem:testDb"
        }
    }
    production {
        dataSource {
            //dbCreate = "update"
            //url = "jdbc:hsqldb:file:prodDb;shutdown=true"

    
            // since there is no production DB yet, just use obsidian (geoff)
            // change this when the time comes...

            driverClassName = "org.postgresql.Driver"
            url = "jdbc:postgresql://dbdev.emii.org.au:5432/portal2?ssl=true&sslfactory=org.postgresql.ssl.NonValidatingFactory"
            username = "portal2user"
            password = "wtingzgsfdbat"

        }
    }
}
