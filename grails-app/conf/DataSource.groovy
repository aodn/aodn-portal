/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

dataSource {
    pooled = true

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
def ENV = System.getenv()

environments {

    development {
        dataSource {
            //dbCreate = "update"
            driverClassName = "org.postgresql.Driver"
            url = ENV['DATA_SOURCE_URL'] ? ENV['DATA_SOURCE_URL'] : "jdbc:postgresql://localhost:5432/aodn_portal"
            username = ENV['DATA_SOURCE_USERNAME'] ? ENV['DATA_SOURCE_USERNAME'] : "postgres"
            password = ENV['DATA_SOURCE_PASSWORD'] ? ENV['DATA_SOURCE_PASSWORD'] : "postgres"
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
            jndiName = "java:comp/env/jdbc/aodnportal"
        }
    }
}
