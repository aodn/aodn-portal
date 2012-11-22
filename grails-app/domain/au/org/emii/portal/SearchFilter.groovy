
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

class SearchFilter
{
	static belongsTo = [search: Search]

	String type
	Map value

	static SearchFilter fromJson(json) throws IllegalArgumentException
	{
		if (!json.type)
		{
			throw new IllegalArgumentException("Filter type must be specified.")
		}

		if (!json.value)
		{
			throw new IllegalArgumentException("Filter value must be specified.")
		}

		SearchFilter filter = new SearchFilter(type: json.type)
		filter.value = [:]
		json.value.each
		{
			k, v ->

			filter.value.put(k, String.valueOf(v))
		}

		return filter
	}

	@Override
	public String toString() {
		return "type: ${type}, value: ${value}"
	}
}
