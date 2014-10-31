/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

import javax.naming.InitialContext

// locations to search for config files that get merged into the main config
// config files can either be Java properties files or ConfigSlurper scripts

// grails.config.locations = [ "classpath:${appName}-config.properties",
//                             "classpath:${appName}-config.groovy",
//                             "file:${userHome}/.grails/${appName}-config.properties",
//                             "file:${userHome}/.grails/${appName}-config.groovy"]

// if (System.properties["${appName}.config.location"]) {
//    grails.config.locations << "file:" + System.properties["${appName}.config.location"]
// }

println "Loading base Portal configuration..."

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
help {
    url = "http://help.aodn.org.au"
    downloadDatasetUrl = "${help.url}/?q=node/6"
}

// AODAAC Aggregator
aodaacAggregator {
    url = "http://aodaac.aodn.org.au"
    environment = "prod"
    allowApiCalls = true
    apiCallsConnectTimeout = 1000
    apiCallsReadTimeout = 2000
    idleJobTimeout = 1 // In hours
    errorLookup = [
        /.*java\.lang\.Exception: requested ~ [0-9]+ bytes; limit = [0-9]+/: {

            errorMessage ->

            def numBytes = (errorMessage =~ /[0-9]+/)
            assert(numBytes.count == 2): "Expecting 2 numerical values in error string: " + errorMessage
            def actualBytes = Long.valueOf(numBytes[0])
            def limitBytes = Long.valueOf(numBytes[1])

            def amountOver = Math.round(actualBytes/limitBytes)

            return "The requested job will have too much data. You have requested roughly ${amountOver} times the maximum output size."
        }
    ]
}

// Depth service
depthService.url = "https://depthservice.aodn.org.au/depth"

downloadAuth {
    // Never show a captcha to those IP addresses
    whitelistClients = [
        '127.0.0.1'
    ]

    // Treat those as usual even if they're whitelisted
    blacklistClients = []

    // Allow users to have to 2 aggregated downloads every 10 minutes without
    // displaying a challenge (captcha)
    maxAggregatedDownloadsInPeriod = 2
    maxAggregatedDownloadsPeriodMinutes = 10
}

// OpenID
openId {
    // openID provider details to support login popup etc
    providers = [
        [name: "Google", iconHref: "images/openid_icons/Google.png", providerHref: "https://www.google.com/accounts/o8/id"],
        [name: "Yahoo",  iconHref: "images/openid_icons/Yahoo.png",  providerHref: "https://me.yahoo.com/"]
        // Add your own providers here ...
    ]

    // Enable user to supply their their own OpenId url via textfield in popup list
    enableUserSuppliedProvider = true
}

featureToggles {
    pythonDownload = false
    proxyWmsRequests = true
}

// Google Analytics
googleAnalytics.trackingId = null

// set per-environment serverURL stem for creating absolute links
def env = System.getenv()

environments {

    development {
        grails.resources.debug = true

        // URLs
        grails.serverURL = env['WMS_HOST_URL'] ?: "http://${java.net.InetAddress.getLocalHost().getHostAddress()}:8080/$appName"
        wmsScanner.url = env['WMS_SCANNER_URL'] ?: "http://localhost:8100/WmsScannerGrails/"
        wfsScanner.url = env['WFS_SCANNER_URL'] ?: "http://localhost:8200/wfsScanner"
        gogoduck.url = env['GOGODUCK_URL'] ?: "http://localhost:8300/go-go-duck"
        geonetwork.url = env['GEONETWORK_URL'] ?: "https://catalogue-rc.aodn.org.au/geonetwork"

        grails.mail.disabled = true

        featureToggles.pythonDownload = true
    }

    test {

        // URLs
        grails.serverURL = "http://localhost:8080/$appName"

        grails.mail.disabled = true
        grails.plugin.databasemigration.updateOnStart = false
        aodaacAggregator.allowApiCalls = false
    }

    production {

        // URLs
        grails.serverURL = "http://myaodn.example.com"
        wmsScanner.url = "http://wmsscannerpublic.aodn.org.au/wmsscanner/"
        wfsScanner.url = "http://wfsscannerpublic.aodn.org.au/wfsscanner"
        geonetwork.url = "http://catalogue-123.aodn.org.au/geonetwork"

        grails {
            mail {
                host = "localhost"
                port = 25
                props = ["mail.smtp.auth": "false"]
            }
        }
    }
}

geonetwork.searchPath = 'xml.search.imos'

// Server configuration
baselayerServer = [
    uri: "http://geoserver-static.aodn.org.au/geoserver/baselayers/wms",
    type: "WMS-1.1.1"
]

// This array should be populated from chef config
knownServers = [
    /*
     * An example of the possible fields for a Server
     * Only url is required. All other fields have defaults (used if they are omitted)
     * Maybe WMS version might be required. Not sure about that yet. I feel that for most cases either 1.1.1 or 1.3.0 would work well as a default
    [
        uri: '', // The server URL (required) -- I would prefer to see that is url rather than uri but I have it as uri for now to match the field in the Server domain class.
        wmsVersion: '', // The version number as a string e.g. "1.1.1", "1.3.0" (not sure if we should make this required or not)
        type: '', // Identifying the specific server software. e.g. "nvWMS", "GeoServer". If omitted or blank then it is considered to just be a general WMS server without any extra functionality. Should be case insensitive.
        supportsCsvMetadataHeaderOutputFormat: true, // False if omitted. Basically this tells us whether we can use the csvWithMetadata output type on this server
        httpAuthUsername: '', // Some servers use HTTP authentication, so store the credentials here. Null be default
        httpAuthPassword: '',
        urlListDownloadPrefixToRemove: '', // For the time being these are still needed for BODAAC functionality, null by default
        urlListDownloadPrefixToSubstitue: ''
    ]*/
    [
        uri: 'http://geoserver-123.aodn.org.au/geoserver/wms',
        wmsVersion: '1.1.1',
        type: 'GeoServer',
        supportsCsvMetadataHeaderOutputFormat: true,
        urlListDownloadPrefixToRemove: '/mnt/imos-t3/',
        urlListDownloadPrefixToSubstitue: 'http://data.aodn.org.au/'
    ],
    [
        uri: 'http://ncwms.aodn.org.au/ncwms/wms',
        wmsVersion: '1.1.1',
        type: 'ncWMS',
        urlListDownloadPrefixToRemove: '/mnt/imos-t3/IMOS/opendap/',
        urlListDownloadPrefixToSubstitue: 'http://thredds.aodn.org.au/thredds/fileServer/IMOS/'
    ],
    [
        uri: 'http://rs-data1-mel.csiro.au/ncWMS/wms',
        wmsVersion: '1.1.1',
        type: 'ncWMS'
    ],
    [
        uri: 'http://catami.org/geoserver/wms?namespace=catami',
        wmsVersion: '1.3.0',
        type: 'GeoServer'
    ]
]

// Search results mini map configuration
minimap {
    baselayer {
        name = "baselayer"
        url = baselayerServer.uri
        params = [layers: 'default_bathy']
    }
}

baselayers = [
    [
        name: "default_bathy",
        title: "Bathymetry Baselayer",
        server: baselayerServer
    ],
    [
        name: "default_basemap_simple",
        title: "Simple Baselayer",
        server: baselayerServer
    ]
]

def defaultInstanceName = "IMOS"

portal {
    siteHeader = "Open Access to Ocean Data"

    logo = "images/${defaultInstanceName}_logo.png"
    header {
        externalLinks = [
            [
                linkText: "Help",
                tooltipText: "Portal help files",
                href: help.url
            ]
        ]
    }

    footerContent =
        """
        <a title="Data usage acknowledgement" target="_blank" href=" """ + help.url + """/help/?q=node/81">Acknowledgement</a> <b>|</b>
        <a title="Disclaimer information" target="_blank" href=" """ + help.url + """/help/?q=node/80">Disclaimer</a> <b>|</b>
        <a title="Integrated Marine Observing System" target="_blank" href="http://www.imos.org.au">IMOS</a>  <b>|</b>
        <a title="Australian Ocean Data Network" target="_blank" href="http://imos.org.au/aodn.html">AODN</a>
        """

    // Change authentication emails for IMOS
    systemEmail {
        fromAddress = "info@example.com"
    }
}

// MARVL project integration
marvl {
    urlList {
        prefixToRemove = "/mnt/imos-t3/"
        newUrlBase = "http://data.aodn.org.au/"
    }
}

// WFS indexed file info
indexedFile.fileSizeColumnName = "size"

// Something else is adding an appender (what?!) - get rid of it, else we end up
// with duplicate logs in production.
org.apache.log4j.Logger.rootLogger.removeAllAppenders()

// log4j configuration
def log4jConversionPattern = env['LOG4J_CONVERSION_PATTERN'] ?: "%-5p %d [%-12t] %c %X{username}- %m%n"

log4j = {

    appenders {
        console name:'stdout', layout: pattern(conversionPattern: log4jConversionPattern)
    }

    root {
        info 'stdout'
    }

    error   'org.codehaus.groovy.grails.web.servlet',  //  controllers
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

    warn    'org.mortbay.log'

    info    'grails.app.tagLib.au.org.emii.portal.UserTagLib',
        'grails.app.filters.shiro.SecurityFilters',
        'grails.app.controller.au.org.emii.portal.LayerController',
        'grails.app.controller.au.org.emii.portal.AuthController',
        'grails.app.service.au.org.emii.portal.LayerService',
        'au.org.emii.portal.display.MenuJsonCache',
        'org.apache.shiro',
        'grails.app.controller'

    debug   'grails.app.job',
        'grails.app.tagLib',
        'grails.app.service.au.org.emii.portal.AodaacAggregatorService',
        'grails.app.controller.au.org.emii.portal.SystemController',
        'grails.app.domain',
        'grails.app.realms'
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
if (!grails.config.locations || !(grails.config.locations instanceof List)) {
    grails.config.locations = []
}

try {
    configurationPath = new InitialContext().lookup('java:comp/env/aodn.configuration')
    grails.config.locations << "file:${configurationPath}"

    println "Loading external config from '$configurationPath'..."

    def startupConfig = new ConfigSlurper(grailsSettings.grailsEnv).parse(new File(configurationPath).toURI().toURL())
    System.setProperty("INSTANCE_NAME", startupConfig.portal.instance.name ?: defaultInstanceName)
}
catch (e) {

    println "Not loading external config"

    portal.instance.name = defaultInstanceName
    System.setProperty "INSTANCE_NAME", portal.instance.name
}
