package au.org.emii.portal

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
	def layers = new ArrayList<Layer>()
	static hasMany = [layers: Layer]
	
	String name
	String description
	
	static mapping =
	{
		description type:'text'
		sort "name"
	}
	
    static constraints = 
	{
		description(nullable:true)
    }
	
	String toString()
	{
		name
	}
}
