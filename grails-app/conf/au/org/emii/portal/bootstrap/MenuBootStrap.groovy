
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal.bootstrap

import au.org.emii.portal.display.MenuJsonCache
import au.org.emii.portal.config.JsonMarshallingRegistrar

class MenuBootStrap {

    def init = { servletContext ->

        JsonMarshallingRegistrar.registerJsonMarshallers()

        def configInstance = au.org.emii.portal.Config.activeInstance()
        if (configInstance && configInstance.defaultMenu) {
            configInstance.defaultMenu.cache(MenuJsonCache.instance())
        }
    }
}
