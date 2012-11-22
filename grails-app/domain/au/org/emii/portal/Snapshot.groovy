
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

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
	List layers
	static hasMany = [layers: SnapshotLayer]
	
	String name
	String description
    
    //Bounding box
    Float minX
    Float minY
    Float maxX
    Float maxY
	
	static mapping =
	{
		description type:'text'
		sort "name"
        layers cascade: 'all-delete-orphan'
	}
	
    static constraints = 
	{
		name(unique: ['owner'])
		description(nullable:true)
        maxX(validator: {val, obj -> obj.minX < val})
        maxY(validator: {val, obj -> obj.minY < val})
    }

	String toString()
	{
		name
	}
}
