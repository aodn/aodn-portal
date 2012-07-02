grails.project.class.dir = "target/classes"
grails.project.test.class.dir = "target/test-classes"
grails.project.test.reports.dir = "target/test-reports"
grails.project.war.file = "target/${appName}-${appVersion}-${grails.util.Environment.current.name}.war"

grails.project.dependency.resolution = {
    // inherit Grails' default dependencies
    inherits("global") {
        // uncomment to disable ehcache
        // excludes 'ehcache'
    }
    log "warn" // log level of Ivy resolver, either 'error', 'warn', 'info', 'debug' or 'verbose'
    repositories {
        grailsPlugins()
        grailsHome()
        grailsCentral()

        // uncomment the below to enable remote dependency resolution
        // from public Maven repositories
        mavenLocal()
        mavenCentral()
        //mavenRepo "http://snapshots.repository.codehaus.org"
        //mavenRepo "http://repository.codehaus.org"
        //mavenRepo "http://download.java.net/maven/2/"
        //mavenRepo "http://repository.jboss.com/maven2/"
    }
    dependencies {
        // specify dependencies here under either 'build', 'compile', 'runtime', 'test' or 'provided' scopes eg.

        // runtime 'mysql:mysql-connector-java:5.1.13'
    }
	
	// Allow grails commands to be run as usual, see: http://grails.org/doc/latest/guide/conf.html#mavenIntegration
	pom true


    inherits("global") {
        excludes "xml-apis"
    }

	
	plugins {
		compile ":build-test-data:1.1.2"
	}
}

coverage {
    enabledByDefault = false
    xml = true
}

grails.war.resources = { stagingDir ->
    
    delete(file:"${stagingDir}/WEB-INF/lib/slf4j-api-1.5.2.jar")
	copy(toDir: "${stagingDir}/WEB-INF/classes/instance") {
		fileset(dir: "instance")
	}
}
