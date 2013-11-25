/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

class WMSDimension {
    String name
    String units
    String unitSymbol
    String defaultValue
    boolean hasMultipleValues
    boolean hasNearestValue
    boolean hasCurrent
    String extent //Text content indicating available value(s) for dimension.

    static mapping = {
        //the extent can be really really REALLY long
        extent type: 'text'
    }

    static constraints = {
        name()
        units()
        unitSymbol(nullable: true)
        defaultValue(nullable: true)
        hasMultipleValues(nullable: true)
        hasNearestValue(nullable: true)
        hasCurrent(nullable: true)
        extent()
    }
}

