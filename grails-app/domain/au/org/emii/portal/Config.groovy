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

    Integer mapGetFeatureInfoBuffer
    String baselayerList
    List defaultLayers

    String wmsScannerCallbackPassword
    String wfsScannerCallbackPassword

    static hasMany = [defaultLayers: Layer]

    static transients = [
        "baselayerList" // baselayerMenu can be expanded to baselayers
    ]
    static mapping = {
        footerContent type: 'text'
    }

    static constraints = {
        enableMOTD(nullable: true)
        motd(nullable: true)
        motdStart(nullable: true)
        motdEnd(nullable: true)
        footerContent(nullable: true, maxSize: 4000)
        baselayerMenu(nullable: true)
        defaultMenu(nullable: true)
        contributorMenu(nullable: true)
        regionMenu(nullable: true)
        defaultLayers(nullable: true)
        mapGetFeatureInfoBuffer(min: 0)
        wmsScannerCallbackPassword(nullable: true)
        wfsScannerCallbackPassword(nullable: true)
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

    def hasCurrentMotd() {

        def now = new Date()

        return motd &&
            enableMOTD &&
            now.after(motdStart) &&
            now.before(motdEnd)
    }
}
