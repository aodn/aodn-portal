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
          url = "jdbc:postgresql://obsidian.bluenet.utas.edu.au:5432/portalV2Development?ssl=true&sslfactory=org.postgresql.ssl.NonValidatingFactory"
           //url = "jdbc:postgresql://localhost:5432/publications"

           username = "portalV2DevelopmentUser"
           password = "portalV2DevelopmentUser"


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
        }
    }
}
