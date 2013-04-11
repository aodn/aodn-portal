
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

/**
 * Types of filters a layer can take.
 *
 * To add a new type:
 *
 * 1) Make a new value for the filtertype enumeration.  Note that all possible values are stored
 * as strings in the database.
 * 2) Create an appropriate type in the Javascript, i.e., in web-app/js/portal/filter
 */
public enum FilterTypes {
    String, Date, Number, Double, Boolean, BoundingBox

    static def stringTypeMapping = [
        "string": FilterTypes.String,
        "date": FilterTypes.Date,
        "double": FilterTypes.Number,
        "boolean": FilterTypes.Boolean,
        "pointpropertytype": FilterTypes.BoundingBox
    ]

    static FilterTypes typeFromString(String s) {

        s = s.toLowerCase()

        if (s.startsWith("geometry"))
            return BoundingBox
        else if(s.startsWith("multiline"))
            return BoundingBox
        return stringTypeMapping[s]
    }

    String getKey() { name() }
}
