
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

class OrganisationType {

    String description
    
    static constraints = {
        description(blank: false, nullable: false)
    }
    
    String toString() {
        return description
    }
}
