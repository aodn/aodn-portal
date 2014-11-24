
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal.config

class PortalInstance {

    def grailsApplication

    def name() {
        return grailsApplication.config.portal.instance.name
    }

    def code() {
        if (name()) {
            return name().toLowerCase()
        }
        return null
    }
}
