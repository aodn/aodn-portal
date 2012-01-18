package au.org.emii.portal

/*
Configuration domain for the portal
*/

class Config {
    String name
    String applicationBaseUrl
    String proxy
    Integer proxyPort
    String catalogUrl
    // Map behaviour
    String initialBbox
    Boolean autoZoom
    // Depth service database configuration
    Boolean useDepthService
    String depthUrl
    String depthUser
    String depthPassword
    String depthSchema
    String depthTable
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
    
    String metadataLinkProtocols
    String metadataLayerProtocols
    Integer mapGetFeatureInfoBuffer    
    String baselayerList    
    List defaultLayers
    String wmsScannerBaseUrl
    
    static hasMany = [defaultLayers:Layer]    
        
    static transients = [ 
        "baselayerList" // baselayerMenu can be expanded to baselayers
    ] 
    static mapping = {
        footerContent type:'text'
    }
    
    static constraints = {
        name(size:5..255,nullable:true)
        applicationBaseUrl(url: true)
        proxy(nullable:true)
        proxyPort(nullable:true)
        initialBbox(size:10..50)
        autoZoom()    
        enableMOTD(nullable:true)
        motd(nullable:true,maxSize: 4000)
        motdStart(nullable:true)
        motdEnd(nullable:true)
        footerContent(nullable:true,maxSize: 4000)        
        footerContentWidth(nullable:true,size: 150..1000)
        useDepthService(nullable:true)
        depthUrl(nullable:true)
        depthUser(nullable:true)
        depthPassword(nullable:true)
        depthSchema(nullable:true)
        depthTable(nullable:true)
        catalogUrl(url: true)
        baselayerMenu()
        defaultMenu()
        contributorMenu()
        regionMenu()
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
        metadataLinkProtocols(size: 0..255)
        metadataLayerProtocols(size: 0..255)
        mapGetFeatureInfoBuffer(min: 0)
        wmsScannerBaseUrl()
    }
    
    static Config activeInstance() {
        return Config.list()[0]
    }
}