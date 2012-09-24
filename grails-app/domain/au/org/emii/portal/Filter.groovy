package au.org.emii.portal

import java.beans.PropertyDescriptor
import org.springframework.beans.BeanUtils
import java.lang.reflect.Method
import javax.swing.text.LayeredHighlighter

class Filter {

    String label //This is the human readable name
    FilterTypes type  //String, time, etc, etc.
    String name  //note that this is the CQL name
    String filterValues //a comma separated string of values, instead of a separate table of individual values
    static belongsTo = [layer: Layer]

    static constraints = {
        name()
        type()
        layer()
        label()
        filterValues(nullable:  true)
    }

    def beforeDelete(){
        layer.filters.remove(this);
    }

     def toLayerData(){
        def filterData = [:]
        filterData["label"] = this.label
        filterData["type"] = this.type.toString()
        filterData["name"] = this.name
        filterData["filterValues"] = this.filterValues
        filterData["layerId"] = this.layer.id
        return filterData
     }

}
