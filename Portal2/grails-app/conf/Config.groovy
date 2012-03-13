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

// URL Mapping Cache Max Size, defaults to 5000
//grails.urlmapping.cache.maxsize = 1000

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
// The new way to deeply convert
//grails.converters.json.default.deep = true
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

// set per-environment serverURL stem for creating absolute links
environments {
    production {
        grails.serverURL = "http://portaldev.aodn.org.au/$appName"
        spatialsearch.url = "http://spatialsearchtest.emii.org.au/search/search/index"

        grails {
            mail {
                authenticationFromEmailAddress = "info@aodn.org.au"

                host = "postoffice.utas.edu.au"
                port = 25
                username = "info@aodn.org.au"
                props = ["mail.smtp.auth":"false"]
            }
        }
    }

    waodn {
        grails.config.locations = [ "file:${basedir}/waodn-application.properties"]
        grails.config.locations = [ "file:${basedir}/waodn-config.groovy"]
        grails.serverURL = "http://localhost:8080/${appName}"
        spatialsearch.url = "http://localhost:8090/spatialsearch/search/index"

        grails
                {
                    mail
                            {
                                authenticationFromEmailAddress = "pauline.mak@utas.edu.au"

                                host = "postoffice.utas.edu.au"
                                port = 25

                                username = "username"
                                props = ["mail.smtp.auth":"false"]
                            }
                }
    }
    preview {
        grails.serverURL = "http://preview.emii.org.au/$appName"
        spatialsearch.url = "http://spatialsearchtest.emii.org.au/search/search/index"
    }

    development {
        grails.serverURL = "http://localhost:8000/${appName}"
        spatialsearch.url = "http://spatialsearchtest.emii.org.au/search/search/index"

        grails
                {
                    mail
                            {
                                authenticationFromEmailAddress = "info@aodn.org.au"

                                host = "localhost"
                                port = 25

                                username = "username"
                                props = ["mail.smtp.auth":"false"]
                            }
                }
    }
    test {
        grails.serverURL = "http://localhost:8080/${appName}"
        spatialsearch.url = "http://spatialsearchtest.emii.org.au/search/search/index"
        grails.mail.disabled = true
        grails.plugin.databasemigration.updateOnStart = false
    }
}

// log4j configuration
log4j = {
    appenders {

        console name:'stdout', layout:pattern(conversionPattern: '%d [%-12t] [%-5p] %30.30c - %m%n')

        production {
            appender new org.apache.log4j.net.SMTPAppender(
                    name: 'mail',
                    from: "sys.admin@emii.org.au",
                    to: "dnahodil@utas.edu.au",
                    subject: "Error from Portal (${grails.serverURL} | ${Environment.current})",
                    SMTPHost: "localhost",
                    bufferSize: 1,
                    // SMTPDebug: true,
                    layout: pattern( conversionPattern: "Site: ${grails.serverURL} (environment: ${Environment.current})%nTimestamp: %d%nThread: %t%nLevel: %p%nLogger: %c%nMessage: %m" ) )
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

    info   'grails.app.filters.SecurityFilters',
            'org.apache.shiro'

    debug  'grails.app.controller',
            'grails.app.job',
            'grails.app.service',
            'grails.app.tagLib',
            'grails.app.domain',
            'grails.app.realm'
    //'org.hibernate.SQL',
    //'org.hibernate.type',
    //'liquibase',
    'grails.app.realm'
    //'grails'
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

def INSTANCE_NAME = "INSTANCE_NAME"

def instanceName = "AODN" //default

if(!grails.config.locations || !(grails.config.locations instanceof List)) {
    grails.config.locations = []
}
if(System.getenv(INSTANCE_NAME)) {
    instanceName = System.getenv(INSTANCE_NAME)
    println "Including configuration file specified in environment: " + System.getenv(INSTANCE_NAME);
    grails.config.locations << "file:${basedir}/instance/${instanceName}/${instanceName}-application.properties"
    grails.config.locations << "file:${basedir}/instance/${instanceName}/${instanceName}-config.groovy"

} else if(System.getProperty(INSTANCE_NAME)) {
    instanceName = System.getProperty(INSTANCE_NAME)
    println "Including configuration file specified on command line: " + System.getProperty(INSTANCE_NAME);
    grails.config.locations << "file:${basedir}/instance/${instanceName}/${instanceName}-application.properties"
    grails.config.locations << "file:${basedir}/instance/${instanceName}/${instanceName}-config.groovy"

} else {
    println "No external configuration file defined."
}
