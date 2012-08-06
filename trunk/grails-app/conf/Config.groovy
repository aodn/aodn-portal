import grails.util.Environment

import javax.naming.InitialContext

// locations to search for config files that get merged into the main config
// config files can either be Java properties files or ConfigSlurper scripts

// grails.config.locations = [ "classpath:${appName}-config.properties",
//                             "classpath:${appName}-config.groovy",
//                             "file:${userHome}/.grails/${appName}-config.properties",
//                             "file:${userHome}/.grails/${appName}-config.groovy"]

// if(System.properties["${appName}.config.location"]) {
//    grails.config.locations << "file:" + System.properties["${appName}.config.location"]
// }

grails.project.groupId = appName // change this to alter the default package name and Maven publishing destination
grails.mime.file.extensions = true // enables the parsing of file extensions from URLs into the request format
grails.mime.use.accept.header = false
grails.mime.types = [ html: ['text/html','application/xhtml+xml'],
                      xml: ['text/xml', 'application/xml'],
                      text: 'text/plain',
                      js: 'text/javascript',
                      rss: 'application/rss+xml',
                      atom: 'application/atom+xml',
                      css: 'text/css',
                      csv: 'text/csv',
                      all: '*/*',
                      json: ['application/json','text/json'],
                      form: 'application/x-www-form-urlencoded',
                      multipartForm: 'multipart/form-data'
                    ]

// The default codec used to encode data with ${}
grails.views.default.codec = "none" // none, html, base64
grails.views.gsp.encoding = "UTF-8"
grails.converters.encoding = "UTF-8"
// enable Sitemesh preprocessing of GSP pages
grails.views.gsp.sitemesh.preprocess = true
// scaffolding templates configuration
grails.scaffolding.templates.domainSuffix = 'Instance'

// Set to false to use the new Grails 1.2 JSONBuilder in the render method
grails.json.legacy.builder = false
// This is required to avoid org.codehaus.groovy.grails.web.json.JSONException: Misplaced key.
grails.converters.json.circular.reference.behaviour = "INSERT_NULL"
// enabled native2ascii conversion of i18n properties files
grails.enable.native2ascii = true
// whether to install the java.util.logging bridge for sl4j. Disable for AppEngine!
grails.logging.jul.usebridge = true
// packages to include in Spring bean scanning
grails.spring.bean.packages = []

// request parameters to mask when logging exceptions
grails.exceptionresolver.params.exclude = ['password']

// Database migration.
grails.plugin.databasemigration.updateOnStart = true
grails.plugin.databasemigration.updateOnStartFileNames = ['changelog.groovy']

// Portal help site
help.url = "http://portalhelp.aodn.org.au/"

// AODAAC Aggregator
aodaacAggregator.url = "http://vm-115-33.ersa.edu.au/"
aodaacAggregator.environment = "test"

// Depth service
depthService.url = "http://depthservice.aodn.org.au/"

// set per-environment serverURL stem for creating absolute links
environments {

    development {
		grails.resources.debug = true

        // URLs
		grails.serverURL = "http://${java.net.InetAddress.getLocalHost().getHostAddress()}:8080/$appName"
        spatialsearch.url = "http://spatialsearchtest.emii.org.au/search/search/index"
        wmsScanner.url = "http://wmsscannerdev.aodn.org.au/wmsscanner/"
		openIdProvider.url = "https://devid.emii.org.au"

        grails {
            mail {
                host = "localhost"
                port = 25

                username = "username"
                props = ["mail.smtp.auth":"false"]
            }
        }
    }

    test {

        // URLs
        grails.serverURL = "http://localhost:8080/$appName"
        spatialsearch.url = "http://spatialsearchtest.emii.org.au/search/search/index"

        grails.mail.disabled = true

        grails.plugin.databasemigration.updateOnStart = false
    }

    prerelease {

        /*
         * URLs handled by instance-specific configs:
         * -grails.serverURL
         * -spatialsearch.url
         * -wmsScanner.url
         * -openIdProvider.url
         */

        grails {
            mail {
                host = "localhost"
                port = 25
                username = "info@aodn.org.au"
                props = ["mail.smtp.auth":"false"]
            }
        }
    }

    production {

        /*
         * URLs handled by instance-specific configs:
         * -grails.serverURL
         * -spatialsearch.url
         * -wmsScanner.url
         * -openIdProvider.url
         */

        grails {
            mail {
                host = "postoffice.utas.edu.au"
                port = 25
                username = "info@aodn.org.au"
                props = ["mail.smtp.auth":"false"]
            }
        }
    }
}

/**
 * Instance specific customisation, clearly stolen from:
 * http://phatness.com/2010/03/how-to-externalize-your-grails-configuration/
 *
 * To use set for a specific instance, either set the environment variable "INSTANCE_NAME", or add this in the grails
 * commandline like so:
 *
 * grails -DINSTANCE_NAME=WA run-app
 *
 * Instance specific config files are located in $project_home/instances/
 *
 * Any configuration found in these instance specific file will OVERRIDE values set in Config.groovy and
 * application.properties.
 *
 * NOTE: app.name and version is ignored in external application.properties
 */
if(!grails.config.locations || !(grails.config.locations instanceof List)) {
    grails.config.locations = []
}

if (Environment.current == Environment.PRODUCTION || Environment.current.name == "prerelease") {
	try {
		instanceName = new InitialContext().lookup('java:comp/env/aodn.instance')
	}
	catch (e) {
		// This is currently consumed silently and I know that is bad but until I can find a way to stop it from
		// printing the stacktrace during a war then I'd rather not see it as a misconfiguration should become apparent
		// when you visit the app
		println("WARNING: Could not load instance information from Context. This is ok if this is build output or the instance has been passed to JVM")
	}
}
else {
	println "Instance information will not be loaded from Context"
}

def INSTANCE_NAME = "INSTANCE_NAME"
if (!instanceName) {
	// Determine instance name
	instanceName = System.getenv(INSTANCE_NAME) ?: System.getProperty(INSTANCE_NAME)
	instanceName = instanceName ?: "AODN" // "AODN" is default if none set
}

// In case the property wasn't pulled from system properties put it there so
// migration scripts run correctly
System.setProperty INSTANCE_NAME, instanceName

// Load config file by environment
def configFilePath = "file:./instance/${instanceName}/${instanceName}-config.groovy"
println "Including configuration file based on environment: $configFilePath"
grails.config.locations << "classpath:instance/${instanceName}/${instanceName}-config.groovy"
grails.config.locations << configFilePath

// Instance configuration
portal.header.logo = "AODN_logo.png"
portal.header.organisationLink.linkText = "AODN"
portal.header.organisationLink.tooltipText = "Australian Ocean Data Network"
portal.header.organisationLink.url = "http://imos.org.au/aodn.html"
portal.systemEmail.fromAddress = "info@aodn.org.au"

// log4j configuration
log4j = {
    appenders {

        console name:'stdout', layout: pattern(conversionPattern: "%d [%-12t] [%-5p] %30.30c %X{userInfoForFile}- %m%n")

        def md = grails.util.Metadata.current
        def mailLayoutPattern = """\
Timestamp: %d
Site: $grails.serverURL
Instance name: $instanceName
Environment: ${Environment.current.name}
Version: ${md.'app.version'}
Build date: ${md.'app.build.date'}
Build: #${md.'app.build.number'}
SVN revision: #${md.'app.svn.revision'}
SVN URL: ${md.'app.svn.url'}
Thread: %t
%X{userInfoForEmail}Level: %p
Logger: %c
Message: %m\
""".replaceAll( "\n", "%n" )

        def emailAppender = new org.apache.log4j.net.SMTPAppender(
                name: 'mail',
                from: "sys.admin@emii.org.au",
                SMTPHost: "localhost",
                bufferSize: 1,
                // SMTPDebug: true,
                layout: pattern( conversionPattern: mailLayoutPattern ) )

        production {

            emailAppender.subject = "Error on Portal production instance ${grails.serverURL}"
            emailAppender.to = "developers@emii.org.au"
            appender emailAppender
        }

        if ( Environment.current.name == "prerelease" ) {

            emailAppender.subject = "Error on Portal pre-release instance ${grails.serverURL}"
            emailAppender.to = "dnahodil@utas.edu.au" // To reduce spam for other developers
            appender emailAppender
        }
    }

    root {
        error 'stdout', 'mail'
    }

    error  'org.codehaus.groovy.grails.web.servlet',  //  controllers
            'org.codehaus.groovy.grails.web.pages', //  GSP
            'org.codehaus.groovy.grails.web.sitemesh', //  layouts
            'org.codehaus.groovy.grails.web.mapping.filter', // URL mapping
            'org.codehaus.groovy.grails.web.mapping', // URL mapping
            'org.codehaus.groovy.grails.commons', // core / classloading
            'org.codehaus.groovy.grails.plugins', // plugins
            'org.codehaus.groovy.grails.orm.hibernate', // hibernate integration
            'org.springframework',
            'org.hibernate',
            'net.sf.ehcache.hibernate',
            'org.grails.plugin.resource.ResourceMeta'

    warn   'org.mortbay.log'

    info    'grails.app.tagLib.au.org.emii.portal.UserTagLib',
            'grails.app.filters.shiro.SecurityFilters',
            'grails.app.controller.au.org.emii.portal.LayerController',
            'grails.app.service.au.org.emii.portal.LayerService',
            'org.apache.shiro'

    debug   'grails.app.controller',
            'grails.app.job',
            'grails.app.service',
            'grails.app.tagLib',
            'grails.app.domain',
            'grails.app.realms',
            'au.org.emii.portal'
            //'au.org.emii.portal.display'
		    //'org.hibernate.SQL',
		    //'org.hibernate.type',
		    //'liquibase',
		    //'grails'
}
