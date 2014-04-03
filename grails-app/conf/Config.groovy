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
help.url = "http://help.aodn.org.au/"

// AODAAC Aggregator
aodaacAggregator {
    url = "http://aodaac.emii.org.au/"
    environment = "prod"
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
depthService.url = "http://depthservice.aodn.org.au/depth"

// Search results mini map configuration
minimap {
    baselayer {
        name = "baselayer"
        url = "http://geoserver-static.aodn.org.au/geoserver/baselayers/wms"
        params = [layers: 'default_bathy']
    }
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

// set per-environment serverURL stem for creating absolute links
def env = System.getenv()

environments {

    development {
        // debug true then JS files are separate and not bundled
        grails.resources.debug = true

        // URLs
        grails.serverURL = "http://${java.net.InetAddress.getLocalHost().getHostAddress()}:8080/$appName"
        spatialsearch.url = "http://search.aodn.org.au/aodnsearch/search/index"
        wmsScanner.url = env['WMS_SCANNER_URL'] ?: "http://localhost:8100/WmsScannerGrails/"
        wfsScanner.url = env['WFS_SCANNER_URL'] ?: "http://localhost:8200/wfsScanner"
        gogoduck.url = env['GOGODUCK_URL'] ?: "http://localhost:8300/go-go-duck"

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

        grails.mail.disabled = true

        grails.plugin.databasemigration.updateOnStart = false
    }

    production {

        // URLs
        grails.serverURL = "http://myaodn.example.com"
        spatialsearch.url = "http://search.aodn.org.au/search/search/index"
        wmsScanner.url = "http://wmsscannerpublic.aodn.org.au/wmsscanner/"
        wfsScanner.url = "http://wfsscannerpublic.aodn.org.au/wfsscanner"

        grails {
            mail {
                host = "localhost"
                port = 25
                props = ["mail.smtp.auth":"false"]
            }
        }
    }
}

def defaultInstanceName = "IMOS"

portal {
    header {
        logo = "${defaultInstanceName}_logo.png"
        externalLinks = [
            [
                linkText: "eMII",
                tooltipText: "e-Marine Information Infrastructure",
                href: "http://www.emii.org.au"
            ],
            [
                linkText: "AODN",
                tooltipText: "Australian Ocean Data Network",
                href: "http://imos.org.au/aodn.html"
            ],
            [
                linkText: "Help",
                tooltipText: "Portal help files",
                href: help.url
            ]
        ]
    }
    // Change authentication emails for IMOS
    systemEmail {
        fromAddress = "info@example.com"
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

// MARVL project integration
marvl {
    urlList {
        prefixToRemove = "/mnt/imos-t3/"
        newUrlBase = "http://data.aodn.org.au/"
    }
}

// WFS indexed file info
indexedFile.fileSizeColumnName = "size"

// log4j configuration
log4j = {
    appenders {

        console name:'stdout', layout: pattern(conversionPattern: "%-5p %d [%-12t] %30.30c %X{userInfoForFile}- %m%n")
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
            'grails.app.service.au.org.emii.portal.AodaacAggregatorService',
            'au.org.emii.portal.display.MenuJsonCache',
            'org.apache.shiro',
            'grails.app.controller'

    debug   'grails.app.job',
            'grails.app.tagLib',
            'grails.app.controller.au.org.emii.portal.SystemController',
            'grails.app.domain',
            'grails.app.realms'
}


grails.resources.modules = {

    helpers {

        resource url:"js/jquery/jquery-1.4.1.min.js", disposition:'head'
        resource url:"js/portal/jquery.js", disposition:'head'
        resource url:"js/jquery/jquery-autocomplete1.1.js", disposition:'head'
        resource url:"js/jquery/jquery.rotate.1-1.js", disposition:'head'
        resource url:"js/log4javascript-1.4.6/log4javascript_uncompressed.js", disposition:'head'
        resource url:"js/portal/utils/Logging.js", disposition:'head'
        resource url:"js/portal/common/helpers.js", disposition:'head'
    }

    geonetwork {

        dependsOn 'extJsbundle'

        resource url:"js/Geonetwork/lib/OpenLayers/addins/Format/GeoNetworkRecords.js", disposition:'head'
        resource url:"js/Geonetwork/lib/GeoNetwork/Util.js", disposition:'head'
        resource url:"js/Geonetwork/lib/GeoNetwork/Catalogue.js", disposition:'head'
        resource url:"js/Geonetwork/lib/GeoNetwork/util/SearchTools.js", disposition:'head'
        resource url:"js/Geonetwork/lib/GeoNetwork/data/OpenSearchSuggestionReader.js", disposition:'head'
        resource url:"js/Geonetwork/lib/GeoNetwork/data/OpenSearchSuggestionStore.js", disposition:'head'
        resource url:"js/Geonetwork/lib/GeoNetwork/map/ExtentMap.js", disposition:'head'
        resource url:"js/Geonetwork/lib/GeoNetwork/map/Ext.ux/form/DateTime.js", disposition:'head'
        resource url:"js/Geonetwork/lib/GeoNetwork/lang/en.js", disposition:'head'
        resource url:"js/ext-ux/SuperBoxSelect/SuperBoxSelect.js", disposition:'head'
        resource url:"js/ext-ux/Hyperlink/Hyperlink.js", disposition:'head'
        resource url:"js/ext-ux/util/MessageBus.js", disposition:'head'
    }

    openLayers {
        resource url:"js/OpenLayers-2.10/OpenLayers.js", disposition:'head'
    }

    extJsbundle {

        dependsOn 'openLayers'

        if (env == "development") {
            resource url:"js/ext-3.3.1/adapter/ext/ext-base-debug.js", disposition:'head'
            resource url:"js/ext-3.3.1/ext-all-debug.js", disposition:'head'
            //GeoExt (Has to be after Openlayers and ExJS)
            resource url:"js/GeoExt1.1/lib/GeoExt.js", disposition:'head'
        }
        else {
            resource url:"js/ext-3.3.1/adapter/ext/ext-base.js", disposition:'head'
            resource url:"js/ext-3.3.1/ext-all.js", disposition:'head'
            //GeoExt (Has to be after Openlayers and ExJS)
            resource url:"js/GeoExt1.1/script/GeoExt.js", disposition:'head'
        }
    }

    common {


        resource url:"js/portal/ui/openlayers/control/SpatialConstraint.js", disposition:'head'
        resource url:"js/portal/utils/geo/GeoUtil.js", disposition:'head'
        resource url:"js/portal/utils/Browser.js", disposition:'head'
        resource url:"js/portal/portal.js", disposition:'head'
        resource url:"js/portal/ObjectFactory.js", disposition:'head'
        resource url:"js/portal/PortalEvents.js", disposition:'head'
        resource url:"js/portal/prototypes/Array.js", disposition:'head'
        resource url:"js/portal/prototypes/Object.js", disposition:'head'
        resource url:"js/portal/prototypes/String.js", disposition:'head'
        resource url:"js/portal/prototypes/OpenLayers.js", disposition:'head'
        resource url:"js/portal/lang/en.js", disposition:'head'
        resource url:"js/portal/common/LayerDescriptor.js", disposition:'head'
        resource url:"js/portal/common/BrowserWindow.js", disposition:'head'
        resource url:"js/portal/common/ActionColumn.js", disposition:'head'
        resource url:"js/portal/common/AppConfigStore.js", disposition:'head'
        resource url:"js/portal/common/SaveDialog.js", disposition:'head'
        resource url:"js/portal/common/MapPanel.js", disposition:'head'
        resource url:"js/portal/common/Controller.js", disposition:'head'
        resource url:"js/portal/config/PortalConfigLoader.js", disposition:'head'
        resource url:"js/portal/data/LayerStore.js", disposition:'head'
        resource url:"js/portal/data/MenuTreeLoader.js", disposition:'head'
        resource url:"js/portal/data/SuggestionStore.js", disposition:'head'
        resource url:"js/portal/search/data/LinkStore.js", disposition:'head'
        resource url:"js/portal/search/data/FacetStore.js", disposition:'head'
        resource url:"js/portal/search/field/FreeText.js", disposition:'head'
        resource url:"js/portal/search/field/DateRange.js", disposition:'head'
        resource url:"js/portal/search/field/FacetedDateRange.js", disposition:'head'
        resource url:"js/portal/search/field/MultiSelectCombo.js", disposition:'head'
        resource url:"js/portal/search/field/CheckBox.js", disposition:'head'
        resource url:"js/portal/search/field/ValueCheckBox.js", disposition:'head'
        resource url:"js/portal/search/GeoFacetMapToolbar.js", disposition:'head'
        resource url:"js/portal/search/FacetMapPanel.js", disposition:'head'
        resource url:"js/portal/search/FacetedSearchResultsMiniMap.js", disposition:'head'
        resource url:"js/portal/search/FacetedSearchResultsPanel.js", disposition:'head'
        resource url:"js/portal/search/FacetedSearchResultsDataView.js", disposition:'head'
        resource url:"js/portal/search/DateSelectionPanel.js", disposition:'head'
        resource url:"js/portal/search/GeoSelectionPanel.js", disposition:'head'
        resource url:"js/portal/search/MetadataExtent.js", disposition:'head'
        resource url:"js/portal/data/ServerNodeLayerDescriptorStore.js", disposition:'head'
        resource url:"js/portal/data/MenuItemToNodeBuilder.js", disposition:'head'
        resource url:"js/portal/ui/ActiveLayersTreeNodeUI.js", disposition:'head'
        resource url:"js/portal/ui/ActionsPanel.js", disposition:'head'
        resource url:"js/portal/ui/ActiveLayersPanel.js", disposition:'head'
        resource url:"js/portal/utils/FormUtil.js", disposition:'head'
        resource url:"js/portal/utils/TimeUtil.js", disposition:'head'
        resource url:"js/portal/utils/moment.min.js", disposition:'head'
        resource url:"js/portal/prototypes/Moment.js", disposition:'head'
        resource url:"js/portal/details/BoxDisplayPanel.js", disposition:'head'
        resource url:"js/portal/details/PolygonDisplayPanel.js", disposition:'head'
        resource url:"js/portal/details/SpatialConstraintDisplayPanel.js", disposition:'head'
        resource url:"js/portal/details/SpatialSubsetControlsPanel.js", disposition:'head'
        resource url:"js/portal/details/TimeComboBox.js", disposition:'head'
        resource url:"js/portal/filter/BaseFilterPanel.js", disposition:'head'
        resource url:"js/portal/filter/ComboFilterPanel.js", disposition:'head'
        resource url:"js/portal/filter/ConfigPage.js", disposition:'head'
        resource url:"js/portal/filter/DateFilterPanel.js", disposition:'head'
        resource url:"js/portal/filter/DateRangeFilterPanel.js", disposition:'head'
        resource url:"js/portal/filter/BoundingBoxFilterPanel.js", disposition:'head'
        resource url:"js/portal/filter/BooleanFilterPanel.js", disposition:'head'
        resource url:"js/portal/filter/NumberFilterPanel.js", disposition:'head'
        resource url:"js/portal/filter/FilterGroupPanel.js", disposition:'head'
        resource url:"js/portal/form/UtcExtentDateTime.js", disposition:'head'
        resource url:"js/portal/form/PolygonTypeComboBox.js", disposition:'head'
        resource url:"js/portal/details/NCWMSColourScalePanel.js", disposition:'head'
        resource url:"js/portal/details/StylePanel.js", disposition:'head'
        resource url:"js/portal/details/DetailsPanel.js", disposition:'head'
        resource url:"js/portal/details/NcWmsPanel.js", disposition:'head'
        resource url:"js/portal/details/DetailsPanelTab.js", disposition:'head'
        resource url:"js/portal/details/InfoPanel.js", disposition:'head'
        resource url:"js/portal/details/SubsetPanel.js", disposition:'head'
        resource url:"js/portal/ui/openlayers/ClickControl.js", disposition:'head'
        resource url:"js/portal/ui/openlayers/LayerOptions.js", disposition:'head'
        resource url:"js/portal/ui/openlayers/LayerParams.js", disposition:'head'
        resource url:"js/portal/ui/openlayers/MapActionsControl.js", disposition:'head'
        resource url:"js/portal/ui/openlayers/MapOptions.js", disposition:'head'
        resource url:"js/portal/ui/openlayers/TemporalMap.js", disposition:'head'
        resource url:"js/portal/ui/openlayers/SpatialConstraintMap.js", disposition:'head'
        resource url:"js/portal/ui/openlayers/layer/NcWMS.js", disposition:'head'
        resource url:"js/portal/ui/MapPanel.js", disposition:'head'
        resource url:"js/portal/ui/MapOptionsPanel.js", disposition:'head'
        resource url:"js/portal/ui/VisualisePanel.js", disposition:'head'
        resource url:"js/portal/ui/MainToolbar.js", disposition:'head'
        resource url:"js/portal/ui/NavigableCardLayout.js", disposition:'head'
        resource url:"js/portal/ui/MainPanel.js", disposition:'head'
        resource url:"js/portal/ui/FeatureInfoPopup.js", disposition:'head'
        resource url:"js/portal/ui/Viewport.js", disposition:'head'
        resource url:"js/portal/ui/SelectionPanel.js", disposition:'head'
        resource url:"js/portal/ui/TimeRangeLabel.js", disposition:'head'
        resource url:"js/portal/ui/search/SearchBodyPanel.js", disposition:'head'
        resource url:"js/portal/ui/search/SearchPanel.js", disposition:'head'
        resource url:"js/portal/ui/search/FreeTextSearchPanel.js", disposition:'head'
        resource url:"js/portal/service/CatalogSearcher.js", disposition:'head'
        resource url:"js/portal/ui/search/SearchFiltersPanel.js", disposition:'head'
        resource url:"js/portal/data/TopTermStoreSortOrder.js", disposition:'head'
        resource url:"js/portal/data/TopTermStore.js", disposition:'head'
        resource url:"js/portal/ui/TermSelectionPanel.js", disposition:'head'
        resource url:"js/portal/data/ChildElementsField.js", disposition:'head'
        resource url:"js/portal/data/GeoNetworkRecord.js", disposition:'head'
        resource url:"js/portal/data/GeoNetworkRecordStore.js", disposition:'head'
        resource url:"js/portal/data/ActiveGeoNetworkRecordStore.js", disposition:'head'
        resource url:"js/portal/ui/EmptyDropZonePlaceholder.js", disposition:'head'
        resource url:"js/portal/mainMap/map.js", disposition:'head'
        resource url:"js/portal/common/GeoExt.ux.BaseLayerCombobox.js", disposition:'head'
        resource url:"js/portal/common/LayerOpacitySliderFixed.js", disposition:'head'
        resource url:"js/portal/cart/DownloadPanelItemTemplate.js", disposition:'head'
        resource url:"js/portal/cart/DownloadPanelBody.js", disposition:'head'
        resource url:"js/portal/cart/DownloadPanel.js", disposition:'head'
        resource url:"js/portal/cart/DownloadConfirmationWindow.js", disposition:'head'
        resource url:"js/portal/cart/InsertionService.js", disposition:'head'
        resource url:"js/portal/cart/NoDataInjector.js", disposition:'head'
        resource url:"js/portal/cart/WmsInjector.js", disposition:'head'
        resource url:"js/portal/cart/NcwmsInjector.js", disposition:'head'
        resource url:"js/portal/cart/DownloadEstimator.js", disposition:'head'
        resource url:"js/portal/visualise/animations/TemporalExtent.js", disposition:'head'
        resource url:"js/portal/visualise/animations/TemporalExtentParser.js", disposition:'head'
        resource url:"js/portal/openId/Popup.js", disposition:'head'
    }
}
