
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import org.codehaus.groovy.grails.web.json.JSONObject;

import grails.converters.JSON

class Search 
{
	static belongsTo = [owner: User]
	
	List<SearchFilter> filters
	static hasMany = [filters: SearchFilter]
	
	String name
	
    static constraints = {
		name(nullable: false, unique: ['owner'])
    }
	
	@Override
	public String toString() {

		return "${name} ${filters})"
	}
	
	static Search fromJson(JSONObject json) throws IllegalArgumentException
	{
		if (!json.owner || !json.owner?.id)
		{
			throw new IllegalArgumentException("Owner ID must be specified.")
		}
		
		if (!json.name)
		{
			throw new IllegalArgumentException("Name must be specified.")
		}
		
		def owner = User.get(json.owner.id)
		if (!owner)
		{
			throw new IllegalArgumentException("Invalid owner ID (${json.owner.id}).")
		}
		
		def search = new Search()
		search.owner = owner
		search.name = json.name
		
		json.filters.each(
		{
			search.addToFilters(SearchFilter.fromJson(it))
		})
		
		return search
	}
	
	static Search parseJson(String jsonString) throws IllegalArgumentException
	{
		return fromJson(new JSONObject(jsonString))
	}
}
