
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import au.org.emii.portal.display.MenuJsonCache

/*
Configuration domain for the portal
*/

class Config {
    String name
    String proxy
    Integer proxyPort

    // Search
    String catalogUrl
    Boolean searchUsingBboxByDefault

    // Map behaviour
    String initialBbox
    Boolean autoZoom
    Boolean enableDefaultDatelineZoom
    String defaultDatelineZoomBbox

    // Menus
    Menu baselayerMenu
    Menu defaultMenu
    Menu contributorMenu
    Menu regionMenu

    // Message of the day
    Boolean enableMOTD  //toggle
    Motd motd
    Date motdStart
    Date motdEnd
    String footerContent
    Integer footerContentWidth

    // heights and widths
    Integer popupWidth
    Integer popupHeight
    Integer westWidth
    Integer headerHeight
    Integer footerHeight
    Integer activeLayersHeight

    String downloadCartFilename
    Integer downloadCartMaxNumFiles
    Integer downloadCartMaxFileSize
    String downloadCartMimeTypeToExtensionMapping
    String downloadCartDownloadableProtocols
    String downloadCartConfirmationWindowContent

    String metadataLinkProtocols
    String metadataLayerProtocols
    Integer mapGetFeatureInfoBuffer
    String baselayerList
    List defaultLayers

    String wmsScannerCallbackPassword
    String wfsScannerCallbackPassword

    static hasMany = [defaultLayers:Layer]

    static transients = [
        "baselayerList" // baselayerMenu can be expanded to baselayers
    ]
    static mapping = {
        footerContent type:'text'
        downloadCartConfirmationWindowContent type: "text"
    }

    static constraints = {
        name(size:5..255,nullable:true)
        proxy(nullable:true)
        proxyPort(nullable:true)
        initialBbox(size:10..50)
        autoZoom()
        enableMOTD(nullable:true)
        motd(nullable:true)
        motdStart(nullable:true)
        motdEnd(nullable:true)
        footerContent(nullable:true,maxSize: 4000)
        footerContentWidth(nullable:true,range: 150..1000)
        catalogUrl(url: true)
        searchUsingBboxByDefault()
        baselayerMenu(nullable: true)
        defaultMenu(nullable: true)
        contributorMenu(nullable: true)
        regionMenu(nullable: true)
        headerHeight()
        footerHeight()
        activeLayersHeight()
        popupWidth()
        popupHeight()
        westWidth()
        defaultLayers(nullable:true)
        downloadCartFilename(blank: false)
        downloadCartMaxNumFiles(min: 1)
        downloadCartMaxFileSize(min: 1)
        downloadCartMimeTypeToExtensionMapping(size: 2..2000)
        downloadCartDownloadableProtocols(size: 0..255)
        downloadCartConfirmationWindowContent(blank: false)
        metadataLinkProtocols(size: 0..255)
        metadataLayerProtocols(size: 0..255)
        mapGetFeatureInfoBuffer(min: 0)
        wmsScannerCallbackPassword( nullable: true )
        wfsScannerCallbackPassword( nullable: true )
        enableDefaultDatelineZoom(nullable:true)
        defaultDatelineZoomBbox(size:10..50)
    }

    static Config activeInstance() {
        return Config.list()[0]
    }

    static def recacheDefaultMenu() {

        def configInstance = Config.activeInstance()
        if (configInstance && configInstance.defaultMenu) {
            MenuJsonCache.instance().recache(configInstance.defaultMenu)
        }
    }
}
