
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import org.springframework.context.annotation.FilterType

class Filter {

    String label //This is the human readable name
    FilterTypes type  //String, time, etc, etc.
    String name  //note that this is the CQL name
    static belongsTo = [layer: Layer]
    static hasMany = [possibleValues: String]
    List<String> possibleValues

    public Filter(){
        possibleValues = []
    }

    static constraints = {
        name(blank: false)
        type()
        layer(nullable: false)
        label(blank: false)
        possibleValues(validator:{ val, obj ->
            if(obj.type != FilterTypes.Boolean && obj.type != FilterTypes.BoundingBox){
                if(val.size() > 0)
                    return true
            }
            else
                return true
            return ['invalid.possibleValues']
        })
    }

    def beforeDelete(){
        layer.filters.remove(this);
    }

     def toLayerData(){
        def filterData = [:]
        filterData["label"] = this.label
        filterData["type"] = this.type.toString()
        filterData["name"] = this.name
        filterData["possibleValues"] = this.possibleValues
        filterData["layerId"] = this.layer.id
        return filterData
     }

    boolean equals(o){
        return o.id == this.id && o.name.equals(this.name)
    }

}
