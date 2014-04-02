/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

import static au.org.emii.portal.DateTimeUtils.*

dataSource {
    pooled = true

    //configure DBCP to test connections before using them and evict old connections (as per http://sacharya.com/grails-dbcp-stale-connections/)
    properties {
        minEvictableIdleTimeMillis = 30 * MINUTES
        timeBetweenEvictionRunsMillis = 30 * MINUTES
        numTestsPerEvictionRun = 3
    }
}
hibernate {
    cache.use_second_level_cache = true
    cache.use_query_cache = true
    cache.provider_class = 'net.sf.ehcache.hibernate.EhCacheProvider'
}

// environment specific settings
def env = System.getenv()

environments {

    development {
        dataSource {
            //dbCreate = "update"
            driverClassName = "org.postgresql.Driver"
            url = env['DATA_SOURCE_URL'] ?: "jdbc:postgresql://localhost:5432/aodn_portal"
            username = env['DATA_SOURCE_USERNAME'] ?: "postgres"
            password = env['DATA_SOURCE_PASSWORD'] ?: "postgres"
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
