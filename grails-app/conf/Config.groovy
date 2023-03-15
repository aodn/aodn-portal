import javax.naming.InitialContext

// locations to search for config files that get merged into the main config
// config files can either be Java properties files or ConfigSlurper scripts

grails.config.locations = []

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

// Portal help site
help {
    url = "https://help.aodn.org.au/"
}

oceanCurrent.url = "http://oceancurrent.aodn.org.au"

// Depth service
depthService.url = "http://geoserver-123.aodn.org.au/geoserver/wfs?typeName=world_depth_data&SERVICE=WFS&REQUEST=GetFeature&VERSION=1.0.0&outputFormat=application/json&viewparams="

downloadAuth {
    // Never show a captcha to those IP addresses
    whitelistClients = [
        '127.0.0.1', '0:0:0:0:0:0:0:1'
    ]

    // Treat those as usual even if they're whitelisted
    blacklistClients = []

    // Allow users to have to 2 aggregated downloads every 10 minutes without
    // displaying a challenge (captcha)
    maxAggregatedDownloadsInPeriod = 2
    maxAggregatedDownloadsPeriodMinutes = 10
}

featureToggles {
    geonetworkLinkMonitor = false
    cognitoAuthentication = false
}

auth {
    awsUserPoolID = System.getenv("AWS_USER_POOL_ID")
    awsClientID = System.getenv("AWS_CLIENT_ID")
}

enabledFacets = [
    [
        name: 'parameterFilter',
        key: 'parameterCategories'
    ],
    [
        name: 'organisationFilter',
        key: 'orgUnitCategories'
    ],
    [
        name: 'platformFilter',
        key: 'platformCategories'
    ],
    [
        classId: 'Portal.search.DateSelectionPanel',
        name: 'dateFilter'
    ],
    [
        classId: 'Portal.search.GeoSelectionPanel',
        name: 'geoFilter'
    ],
    [
        classId: 'Portal.search.FreeTextSearchPanel',
        name: 'freetextFilter',
        key: 'freetextFilter',
        collapsedByDefault: false
    ]
]

// Google Analytics
googleAnalytics.trackingId = null

// Hotjar
hotjar.trackingId = null

// Let's be careful about not being open to spamming.
// This must be specifically enabled in order for emails to be sent from the app.
// This can be changed once we have some other form of protection in place (e.g. apache locking
// down which IP address are allowed to access certain email-producing URLs).
grails.mail.disabled = true

grails.app.context = "/"

environments {

    development {
        grails.config.locations << "file:grails-app/conf/Config.local.groovy"
        grails.resources.debug = true

        // URLs
        def localhostAddress = java.net.InetAddress.getLocalHost().getHostAddress()
        grails.serverURL = "http://${localhostAddress}:9090"
        gogoduck.url = "http://${localhostAddress}:8300/go-go-duck"
        geonetwork.url = "https://catalogue-imos.aodn.org.au/geonetwork"
        gogoduck.filenamePrepend = "IMOS_aggregation"
    }

    test {

        // URLs
        grails.serverURL = "http://localhost:8080"
    }

    production {

        // overwritten by Chef in production
        grails.serverURL = "http://myaodn.example.com"
        geonetwork.url = "https://catalogue-portal.aodn.org.au/geonetwork"
    }
}


geonetwork.searchPath = 'xml.search.imos'
geonetwork.imageBucket = "https://content.aodn.org.au/Documents/Images/Logos/AODN_Partner/"
geonetwork.iconNamespace = "portal:"
geonetwork.pageSize = 30

// ExternalRequest.groovy connect timeout value in milliseconds
proxyConnectTimeout = 2000

filtering {
    baseUrl = "https://raw.githubusercontent.com/aodn/filter-config/test"
}

// This array should be populated from chef config
knownServers = [
    [
        uri: 'http://geoserver-portal.aodn.org.au/geoserver/wms',
        wmsVersion: '1.1.1',
        type: 'GeoServer',
        csvDownloadFormat: 'csv-with-metadata-header',
        urlListDownloadSubstitutions: [
            '^': 'http://data.aodn.org.au/'
        ]
    ],
    [
        uri: 'http://geoserver-123.aodn.org.au/geoserver/wms',
        wmsVersion: '1.1.1',
        type: 'GeoServer',
        csvDownloadFormat: 'csv-with-metadata-header',
        urlListDownloadSubstitutions: [
                '^': 'http://data.aodn.org.au/'
        ]
    ],
    [
        uri: 'http://geoserver-rc.aodn.org.au/geoserver/wms',
        wmsVersion: '1.1.1',
        type: 'GeoserverCore',
        csvDownloadFormat: 'csv-with-metadata-header',
        filtersDir: "imos-geoserver",
        wpsUrl: 'http://geoserver-rc.aodn.org.au/geoserver/wps'
    ],
    [
        uri: 'http://nonprod.marine.ga.gov.au/geoserver/wms',
        wmsVersion: '1.1.1',
        type: 'GeoserverFilterConfig',
        filtersDir: "ga-geoserver",
        wpsUrl: 'http://nonprod.marine.ga.gov.au/geoserver/wps'
    ],
    [
        uri: 'http://marine.ga.gov.au/geoserver/wms',
        wmsVersion: '1.1.1',
        type: 'GeoserverCore'
    ],
    [
        uri: 'http://nonprod.marine.ga.gov.au/api/',
        type: 'GaDownload'
    ],
    [
        uri: 'https://www.cmar.csiro.au/geoserver/wms',
        wmsVersion: '1.1.1',
        type: 'GeoserverFilterConfig',
        filtersDir: "csiro-datatrawler",
        wpsUrl: 'http://www.cmar.csiro.au/geoserver/wps'
    ],
    [
        uri: 'https://www.marine.csiro.au/data/trawler/broker.cfm',
        wmsVersion: '1.1.1',
        type: 'GeoserverFilterConfig',
        filtersDir: "csiro-datatrawler",
        wpsUrl: 'http://www.cmar.csiro.au/geoserver/wps'
    ],
    [
        uri: 'https://geoserver.apps.aims.gov.au/aims/wms',
        wmsVersion: '1.1.1',
        type: 'GeoserverFilterConfig',
        filtersDir: "aims-geoserver",
        wpsUrl: 'https://geoserver.data.aims.gov.au/wps'
    ],
    [
        uri: 'http://geoserver-123.aodn.org.au/geoserver/ncwms',
        wmsVersion: '1.3.0',
        type: 'ncWMS'
    ],
    [
        uri: 'https://www.cmar.csiro.au/geoserver/ncwms',
        wmsVersion: '1.3.0',
        type: 'ncWMS'
    ],
    [
        uri: 'https://biocache.ala.org.au/ws',
        wmsVersion: '1.1.1',
        type: 'ALA'
    ],
    [
        uri: 'https://biocache-test.ala.org.au/ws',
        wmsVersion: '1.1.1',
        type: 'ALA'
    ],
    [
        uri: 'http://data2.tpac.org.au/geoserver/ncwms',
        wmsVersion: '1.3.0',
        type: 'ncWMS'
    ],
    [
        uri: 'https://tilecache.aodn.org.au/geowebcache/service/wms',
        wmsVersion: '1.1.1',
        type: 'GeoServer'

    ],
    [
        uri: 'https://geoserver.imas.utas.edu.au/geoserver/wms',
        wmsVersion: '1.1.1',
        type: 'GeoServer'
    ],
    [
        uri: 'http://ncwms.aodn.org.au/ncwms/wms',
        wmsVersion: '1.1.1',
        type: 'ncWMS',
        urlListDownloadSubstitutions: [
            '^/mnt/imos-t3/IMOS/opendap/': 'http://thredds.aodn.org.au/thredds/fileServer/IMOS/'
        ]
    ],
    [
        uri: 'http://rs-data1-mel.csiro.au/ncWMS/wms',
        wmsVersion: '1.1.1',
        type: 'ncWMS'
    ],
    [
        uri: 'http://catami.org/geoserver/catami/wms',
        wmsVersion: '1.3.0',
        type: 'GeoServer'
    ]
]

// Server configuration
baselayerServer = [
        uri: "https://geoserver-static.aodn.org.au/geoserver/wms",
        wmsVersion: '1.1.1'
]
baselayers = [
    [
        name: "baselayers:default_bathy",
        title: "Bathymetry Baselayer",
        server: baselayerServer
    ],
    [
        name: "baselayers:default_basemap_simple",
        title: "Simple Baselayer",
        server: baselayerServer
    ]
]

datalayerServer = [
        uri: "https://geoserver-static.aodn.org.au/geoserver/wms",
        wmsVersion: '1.1.1'
]
datalayers = [
    [
            name: "datalayers:Australian_Marine_Parks",
            title: "Australian Marine Parks",
            server: datalayerServer
    ]
]

// Search results mini map configuration
minimap {
    baselayer {
        name = "baselayer"
        url = baselayerServer.uri
        params = [
            layers: 'baselayers:default_bathy',
            format: 'image/png'
        ]
    }
}

portal {
    siteHeader = "Open Access to Ocean Data"
    motdUrl = "https://static.emii.org.au/motd"
    logo = "https://static.emii.org.au/images/logo/AODN_logo_fullText.png"
    secondaryLogo = "https://static.emii.org.au/images/logo/IMOS_logo-stacked-reversed-Converted.png"
    icon = "https://static.emii.org.au/images/aodn/favicon.ico"
    localThemeCss = "AODNTheme.css"

    contactEmail = "info@aodn.org.au"
    siteAcronym = "AODN"
    emailSignature = "Kind regards,\nThe AODN Team."
    emailFooter = "The AODN Portal provides access to all available Australian marine and climate science data and provides the primary access to IMOS data including access to the IMOS metadata. \n" +
        "IMOS is supported by the Australian Government through the National Collaborative Research Infrastructure Strategy and the Super Science Initiative."
    conditionOfUse = "http://imos.org.au/imostermsofuse0.html"

    /*logo = "images/favicon.ico"*/
    header {
        externalLinks = [
            [
                linkText: "Help",
                tooltipText: "Portal help files",
                href: help.url
            ]
        ]
    }

    // WPS result expiration period (48 hrs by default)
    wpsResourceExpirationTimeout = 172800

    footerContent =
        """
        <a title="Email us for help in using this site" class="external" href="mailto:${portal.contactEmail}?subject=Portal enquiry - ">Contact</a> <b>|</b>
        <a title="Data usage acknowledgement" target="_blank" class="external" href="${help.url}user-guide-introduction/aodn-portal/data-use-acknowledgement">Acknowledgement</a> <b>|</b>
        <a title="Disclaimer information" target="_blank" class="external" href="${help.url}user-guide-introduction/aodn-portal/disclaimer">Disclaimer</a> <b>|</b>
        <a title="Australian Ocean Data Network" target="_blank" class="external" href="http://imos.org.au/aodn.html">AODN</a> <b>|</b>
        <a title="Integrated Marine Observing System" target="_blank" class="external" href="http://www.imos.org.au/">IMOS</a> <b>|</b>
        <a title="AODN Portal User Guide" target="_blank" class="external" href="${help.url}contributing-data">Contributing</a>
        """

    initialBbox = "110,-50,160,-3"
    defaultDatelineZoomBbox = "110,-50,160,-3"
    earliestDate = "1900"
    latestDate = "3000"

    popupWidth = 550
    popupHeight = 325

    // Various metadata record protocols in which the portal is interested.
    metadataProtocols {
        wms = [
            "OGC:WMS-1.1.1-http-get-map",
            "OGC:WMS-1.3.0-http-get-map",
            "OGC:WMS",
            "IMOS:NCWMS--proto"
        ]

        wfs = [
            "OGC:WFS-1.0.0-http-get-capabilities",
            "OGC:WFS"
        ]

        dataFile = [
            "WWW:DOWNLOAD-1.0-http--download",
            "WWW:DOWNLOAD-1.0-http--downloadother",
            "WWW:DOWNLOAD-1.0-http--downloaddata",
            "WWW:LINK-1.0-http--downloaddata"
        ]

        supplementary = [
            "WWW:LINK-1.0-http--link",
            "WWW:LINK-1.0-http--downloaddata",
            "WWW:LINK-1.0-http--related",
            "WWW:DOWNLOAD-1.0-ftp--download"
        ]

        metadataRecord = [
            "WWW:LINK-1.0-http--metadata-URL"
        ]
    }

    // Download handler config (online resource protocol -> DownloadHandler class)
    downloadHandlersForProtocol = [
        [ 'handler': 'WfsDownloadHandler',                 'protocol': 'OGC:WFS-1.0.0-http-get-capabilities' ],
        [ 'handler': 'WfsDownloadHandler',                 'protocol': 'OGC:WFS' ],
        [ 'handler': 'GogoduckDownloadHandler',            'protocol': 'OGC:WPS--gogoduck'                   ],
        [ 'handler': 'DataTrawlerDownloadHandler',         'protocol': 'WWW:DOWNLOAD-1.0-http--csiro-oa-app' ],
        [ 'handler': 'PointCSVDownloadHandler',            'protocol': 'OGC:WPS--gogoduck'                   ],
        [ 'handler': 'PythonDownloadHandler',              'protocol': 'OGC:WFS-1.0.0-http-get-capabilities' ],
        [ 'handler': 'PythonDownloadHandler',              'protocol': 'OGC:WFS' ],
        [ 'handler': 'BodaacDownloadHandler',              'protocol': 'IMOS:AGGREGATION--bodaac'            ],
        [ 'handler': 'FileListDownloadHandler',            'protocol': 'AODN:FILE-list'                      ],
        [ 'handler': 'ShapeFileDownloadHandler',           'protocol': 'OGC:WFS-1.0.0-http-get-feature--shapefile'],
        [ 'handler': 'AlaDownloadHandler',                 'protocol': 'ALA:Occurrence-download'],
        [ 'handler': 'GaDownloadHandler',                  'protocol': 'GA:Download']
    ]

    mapGetFeatureInfoBuffer = 10
}

// Atlas of Australia
ala {
    aodnAlaId = '2003'
    url = "https://biocache-test.ala.org.au/ws/autocomplete/search"
    index = 'species_habitats:"Marine"'
    gfi_endpoint = "http://biocache.ala.org.au/ws/ogc/getFeatureInfo"
}

csiro {
    url = "https://www.cmar.csiro.au/data/trawler"
}

// MARVL project integration
marvl {
    urlList {
        substitutions = [
            '/mnt/imos-t3/': 'http://data.aodn.org.au/'
        ]
    }
}

// WFS indexed file info
indexedFile.fileSizeColumnName = "size"

// log4j configuration
def log4jConversionPattern = "%-5p %d [%t] %c - %m%n"

log4j.main = {

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
        'org.springframework',
        'org.grails.plugin.resource.ResourceMeta'

    warn    'org.mortbay.log'

    info    'grails.app.controller.au.org.emii.portal.LayerController',
        'au.org.emii.portal.HostVerifier',
        'grails.app.tagLib.au.org.emii.portal.MessageOfTheDayTagLib',
        'grails.app.controller'

    debug   'grails.app.job',
        'grails.app.tagLib',
        'grails.app.controller.au.org.emii.portal.SystemController',
        'grails.plugin.mail'
}

/**
 * Instance specific customisation, clearly stolen from:
 * http://phatness.com/2010/03/how-to-externalize-your-grails-configuration/
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
}
catch (e) {
    println "Not loading external config from 'java:comp/env/aodn.configuration'..."
}

// If configurationPath unset, fall back to default path
defaultConfigPath =  "/etc/aodn-config/Portal.groovy"
defaultConfigExists = new File(defaultConfigPath).exists()
if (!configurationPath && defaultConfigExists) {
    grails.config.locations << "file:${defaultConfigPath}"
    println "Loading external config from '$defaultConfigPath'..."
} else {
    println "Not loading external config from '$defaultConfigPath'..."
}

geonetwork.searchService = "q"
