package au.org.emii.portal

import org.apache.commons.lang.builder.EqualsBuilder;
import org.springframework.jdbc.core.JdbcTemplate;

import grails.converters.JSON

class Menu {
	
	def dataSource
    
    String title
    Boolean active 
    Date editDate
	SortedSet menuItems
	
    static constraints = {
        title(
            nullable:false,
            blank: false, 
            maxSize: 40, 
            unique:true
        )
		
		menuItems cascade: 'all-delete-orphan'
    }
	
	static hasMany = [menuItems: MenuItem]
	
	static mapping = {
		sort "title"
		menuItems fetch: 'join'
	}
	
	Menu() {
		menuItems = [] as SortedSet
	}
	
	boolean equals(Object o) {
		if (is(o)) {
			return true
		}
		if (!(o instanceof Menu)) {
			return false
		}
		
		Menu rhs = (Menu)o
		return new EqualsBuilder()
			.append(id, rhs.id)
			.isEquals()
	}
	
    String toString() {
        return "${title}"
    }
	
	def edited() {
		editDate = new Date()
	}
	
	def getBaseLayers() {
		def baseLayers = []
		getMenuItems().each { item ->
			baseLayers.addAll(item.getBaseLayers())
		}
		return baseLayers
	}
	
	def parseJson(json) {
		def menuJsonArray = JSON.use("deep") {
			JSON.parse(json)
		}
		title = menuJsonArray.title ?: menuJsonArray.text
		if (menuJsonArray.children) {
			_parseMenuItems(menuJsonArray.children.toString())
		}
		else if (menuJsonArray.json) {
			_parseMenuItems(menuJsonArray.json.toString())
		}
	}
	
	def _parseMenuItems(itemJson) {
		def tmpItems = [] as Set
		def itemJsonArray = JSON.use("deep") {
			JSON.parse(itemJson)
		}
		itemJsonArray.eachWithIndex { item, index ->
			def menuItem = _findItem(item.id)
			//menuItem.menu = this
			menuItem.parseJson(item.toString(), index)
			tmpItems << menuItem
			if (!menuItem.id) {
				addToMenuItems(menuItem)
			}
		}
		_purge(tmpItems)
	}
	
	def _findItem(id) {
		def item
		if (id && !getMenuItems().isEmpty()) {
			item = getMenuItems().find { it.id == id }
		}
		return item ?: new MenuItem()
	}
	
	def _purge(keepers) {
		def discards = [] as Set
		getMenuItems().each { item ->
			if (!keepers.contains(item)) {
				discards << item
			}
		}
		discards.each { item ->
			removeFromMenuItems(item)
		}
	}
	
	def toDisplayableMenu() {
		def ids = getServerIdsWithAvailableLayers()
		
		for (def iterator = menuItems.iterator(); iterator.hasNext();) {
			def item = iterator.next()
			if ((item.layer && !item.layer.isViewable()) || (item.server && !ids.contains(item.server.id))) {
				iterator.remove()
			}
		}
		return this
	}
	
	def getServerIdsWithAvailableLayers() {
		// We don't explicitly map layers to servers so dropping to JDBC
		def template = new JdbcTemplate(dataSource)
		def query =
"""\
select server.id
from server
join layer on layer.server_id = server.id
where not layer.blacklisted and layer.active_in_last_scan
group by server.id\
"""
		
		return template.queryForList(query, Long.class)
	}
}
