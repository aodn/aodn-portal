package au.org.emii.portal

import org.apache.jasper.compiler.Node.ParamsAction;
import org.codehaus.groovy.grails.web.servlet.mvc.GrailsParameterMap

/**
 * A snapshot represents the state of a saved map (i.e. the zoom and extent, as well as 
 * all of the selected layers).
 * 
 * @author jburgess
 */
class Snapshot 
{
	static belongsTo = [owner: User]
	
	// Ordering is important.
	List layers
	static hasMany = [layers: SnapshotLayer]
	
	String name
	String description
    
    //Bounding box
    Integer minX
    Integer minY
    Integer maxX
    Integer maxY
	
	static mapping =
	{
		description type:'text'
		sort "name"
	}
	
    static constraints = 
	{
		description(nullable:true)
        maxX(validator: {val, obj -> obj.minX < val})
        maxY(validator: {val, obj -> obj.minY < val})
    }
	
	String toString()
	{
		name
	}
    
}
