package au.org.emii.portal

/*
Configuration domain for the portal
*/

class Config {
    String name
    String proxy
    Integer proxyPort
    String initialBbox
    String catalogUrl
    Menu defaultMenu
    Menu contributorMenu
    Menu regionMenu
    Motd motd
    Date motdStart
    Date motdEnd
    Boolean enableMOTD  //toggle
    Integer westWidth
    Integer headerHeight
    Integer footerHeight
    String downloadCartFilename
    Integer downloadCartMaxNumFiles
    Integer downloadCartMaxFileSize
    String downloadCartMimeTypeToExtensionMapping

    List defaultLayers
    static hasMany = [defaultLayers:Layer]
    
    static constraints = {
        name(size:5..25,unique:true)
        proxy(nullable:true)
        proxyPort(nullable:true)
        initialBbox(size:10..50)
        catalogUrl(url: true)
        defaultMenu()
        contributorMenu()
        regionMenu()
        headerHeight()
        footerHeight()
        westWidth()
        defaultLayers(nullable:true)
        downloadCartFilename(blank: false)
        downloadCartMaxNumFiles(min: 1)
        downloadCartMaxFileSize(min: 1)
        downloadCartMimeTypeToExtensionMapping(minSize: 3)
    }
    
    static Config activeInstance() {
        return Config.list()[0]
    }
}

