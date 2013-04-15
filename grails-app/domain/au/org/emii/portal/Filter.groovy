
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

class Filter {

    String label //This is the human readable name
    FilterType type  //String, time, etc, etc.
    String name  //note that this is the CQL name
    static belongsTo = [layer: Layer]
    static hasMany = [possibleValues: String]
    List<String> possibleValues
    boolean enabled
    boolean downloadOnly

	static mapping = {
		sort "name"
	}

    public Filter(){
        possibleValues = []
        downloadOnly = false   //default
    }

    static constraints = {
        name(blank: false)
        type()
        layer(nullable: false)
        label(blank: false)
        downloadOnly(nullable: false)
        possibleValues(validator:{ val, obj ->
            if(obj.type != FilterType.Boolean && obj.type != FilterType.BoundingBox && obj.type != FilterType.Date){
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
        filterData["enabled"] = this.enabled
        return filterData
     }

    boolean equals(o){
        return o.id == this.id && o.name.equals(this.name)
    }

}
