/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import org.slf4j.Logger
import org.slf4j.LoggerFactory

class Filter implements Comparable {

    static final Logger log = LoggerFactory.getLogger(this)

    String label //This is the human readable Filter title
    FilterType type  //String, time, etc, etc.
    String name  // this is the WFS name
    String wmsStartDateName // WMS name
    String wmsEndDateName  // WMS name
    static belongsTo = [layer: Layer]
    static hasMany = [possibleValues: String]
    List<String> possibleValues
    boolean enabled
    boolean downloadOnly

    static mapping = {
        sort "name"
    }

    public Filter() {
        possibleValues = []
        downloadOnly = false   //default
    }

    static constraints = {
        name(blank: false)
        wmsStartDateName(nullable: true, validator: dateRangeFieldValidator)
        wmsEndDateName(nullable: true, validator: dateRangeFieldValidator)
        type(nullable: false, blank: false)
        layer(nullable: false)
        label(blank: false)
        downloadOnly(nullable: false)
        possibleValues(validator: possibleValuesFieldValidator)
    }

    def beforeDelete() {
        layer.filters.remove(this);
    }

    def toLayerData() {

        def filterData = [:]
        filterData["label"] = label
        filterData["type"] = type.toString()
        filterData["name"] = name
        filterData["wmsStartDateName"] = wmsStartDateName
        filterData["wmsEndDateName"] = wmsEndDateName
        filterData["layerId"] = layer.id
        filterData["enabled"] = enabled
        filterData["possibleValues"] = type.expectsPossibleValues ? possibleValues.sort() : []
        filterData["downloadOnly"] = downloadOnly

        return filterData
    }

    boolean equals(other) {
        return other.id == this.id && other.name.equals(this.name)
    }

    @Override
    String toString() {

        return label == name ? label : "$label ($name)"
    }

    @Override
    int compareTo(other) {

        label.toLowerCase() <=> other.label.toLowerCase()
    }

    static def dateRangeFieldValidator = { val, obj ->

        if (obj.type == FilterType.DateRange) {

            if (val?.size()) {
                return true
            }

            return ['invalid.wmsDateName']
        }
    }

    static def possibleValuesFieldValidator = { val, obj ->

        if (obj.type.expectsPossibleValues) {
            if (val.size() == 0) {
                log.debug "Filter with type ${obj.type} should have possible values, but doesn't"
                return ['invalid.possibleValues']
            }
        }
        else {
            if (val && !val.isEmpty()) {
                log.debug "Filter with type ${obj.type} shouldn't have possible values, but has: $val"
                return ['invalid.possibleValues']
            }
        }
    }
}
