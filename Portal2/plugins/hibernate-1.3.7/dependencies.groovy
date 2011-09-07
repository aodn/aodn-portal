grails.project.class.dir = "target/classes"
grails.project.test.class.dir = "target/test-classes"
grails.project.test.reports.dir	= "target/test-reports"
grails.project.dependency.resolution = {
    inherits "global" // inherit Grails' default dependencies
    log "warn" // log level of Ivy resolver, either 'error', 'warn', 'info', 'debug' or 'verbose'
	repositories {
		grailsCentral()
	}
    dependencies {
        compile('org.slf4j:slf4j-api:1.5.8') {}

        // specify dependencies here under either 'build', 'compile', 'runtime', 'test' or 'provided' scopes eg.
        compile( 'org.hibernate:hibernate-core:3.3.1.GA') {
			excludes 'ehcache', 'xml-apis', 'commons-logging', 'slf4j-api'
		}
		compile('org.hibernate:hibernate-commons-annotations:3.1.0.GA') {
			excludes 'hibernate', 'slf4j-api'
		}
        compile 'org.hibernate:hibernate-annotations:3.4.0.GA' {
            excludes 'slf4j-api'
        }
				
		runtime('org.hibernate:hibernate-validator:3.1.0.GA') {
			excludes 'sl4j-api', 'hibernate.core', 'hibernate-commons-annotations', 'hibernate-entitymanager'
		}				
		runtime 'javassist:javassist:3.11.0.GA' {
            excludes 'sl4j-api'
        }
		runtime 'antlr:antlr:2.7.6' {
            excludes 'sl4j-api'
        }
		runtime( 'dom4j:dom4j:1.6.1' ) {
			excludes 'xml-apis', 'slf4j-api'
		}				
		runtime( 'org.hibernate:hibernate-ehcache:3.3.1.GA' ) {
			excludes 'ehcache', 'hibernate-core', 'slf4j-api'
		}
		
    }

}
