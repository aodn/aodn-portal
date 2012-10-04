package au.org.emii.portal

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
        name()
        type()
        layer()
        label()
        possibleValues(nullable:  true)
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

}
