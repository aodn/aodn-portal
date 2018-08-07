grails.project.class.dir = "target/classes"
grails.project.test.class.dir = "target/test-classes"
grails.project.test.reports.dir = "target/test-reports"
grails.project.war.file = "target/${appName}-${appVersion}-${grails.util.Environment.current.name}.war"

forkConfig = [maxMemory: 2048, minMemory: 64, debug: false, maxPerm: 256, jvmArgs: ['-Dhttps.protocols=TLSv1.2']]
grails.project.fork = [
    test: forkConfig,
    run: forkConfig,
    war: forkConfig,
    console: forkConfig
]

grails.project.dependency.resolution = {
    // inherit Grails' default dependencies
    inherits("global") {
        excludes "xml-apis"
        excludes "catalina"
    }
    log "warn" // log level of Ivy resolver, either 'error', 'warn', 'info', 'debug' or 'verbose'
    repositories {
        grailsPlugins()
        grailsHome()
        grailsCentral()

        mavenLocal()
        mavenCentral()
        mavenRepo "https://repo.grails.org/grails/plugins"
    }
    dependencies {
        compile('org.codehaus.groovy.modules.http-builder:http-builder:0.7') {
            excludes "commons-logging", "xml-apis", "groovy"
        }
        compile('org.ocpsoft.prettytime:prettytime:3.2.7.Final')
    }

    // Allow grails commands to be run as usual, see: http://grails.org/doc/latest/guide/conf.html#mavenIntegration
    pom true
    plugins {
        compile ":joda-time:1.5"
        compile ":mail:1.0.7"
        compile ":simple-captcha:1.0.0"
        test ":code-coverage:1.2.4"
        compile ":csv:0.3.1"
        build ":tomcat:7.0.54"
    }
}

coverage {
    enabledByDefault = false
    xml = true
}

grails.war.resources = { stagingDir ->

    delete(file:"${stagingDir}/WEB-INF/lib/catalina-6.0.32.jar")
    delete(file:"${stagingDir}/WEB-INF/lib/servlet-api-2.5.jar")
    delete(file:"${stagingDir}/WEB-INF/lib/servlet-api-6.0.32.jar")

    // The jars are being inserted by the hudson/tomcat build process, and
    // are causing errors on startup for the app on tomcat6.
    delete(file:"${stagingDir}/WEB-INF/lib/commons-collections-3.1.jar")
    delete(file:"${stagingDir}/WEB-INF/lib/slf4j-api-1.5.8.jar")
}
