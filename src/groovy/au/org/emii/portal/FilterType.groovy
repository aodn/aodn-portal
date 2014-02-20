/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import org.slf4j.Logger
import org.slf4j.LoggerFactory

/**
 * Types of filters a layer can take.
 *
 * To add a new type:
 *
 * 1) Make a new value for the filtertype enumeration.  Note that all possible values are stored
 * as strings in the database.
 * 2) Create an appropriate type in the Javascript, i.e., in web-app/js/portal/filter
 */
public enum FilterType {

    String(true),
    Date(),
    DateRange(),
    Number(),
    Double(),
    Boolean(),
    BoundingBox()

    static final Logger log = LoggerFactory.getLogger(this)

    def expectsPossibleValues

    FilterType(expectsPossibleValues = false) {
        this.expectsPossibleValues = expectsPossibleValues
    }

    static FilterType typeFromString(String s) {

        switch (s.toLowerCase()) {
            case "string":
                return String

            case "boolean":
                return Boolean

            case ["date", "datetime"]:
                return Date

            case ["double", "float", "integer", "int", "long", "short", "decimal"]:
                return Number

            case ["pointpropertytype", "geometrypropertytype", "multilinepropertytype", "surfacepropertytype"]:
                return BoundingBox

            default:
                log.info "Unable to find FilterType for '$s'"
                return null
        }
    }

    String getKey() {
        name()
    }
}
