package au.org.emii.portal

/*
Configuration domain for the portal
*/

class Config {
    String name
    String proxy
    Integer proxyPort
    String initialBbox
    Menu defaultMenu
    Menu contributorMenu
    Menu regionMenu
    Motd motd
    Date motdStart
    Date motdEnd
    Boolean enableMOTD  //toggle
    List defaultLayers
    static hasMany = [defaultLayers:Layer]
    

    static constraints = {
        name(size:5..25,unique:true)
        proxy(nullable:true)
        proxyPort(nullable:true)
        initialBbox(size:10..50)
        defaultMenu()
        contributorMenu()
        regionMenu()
        defaultLayers(nullable:true)
    }
}

