package au.org.emii.portal

import au.org.emii.portal.display.MenuPresenter
import grails.converters.JSON
import org.apache.commons.lang.builder.EqualsBuilder
import au.org.emii.portal.config.JsonMarshallingRegistrar

class Menu {

	// Referenced by the MenuPresenter class
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
		return new MenuPresenter(this)
	}

	def recache(theCache) {
		def displayableMenu = toDisplayableMenu()
		def cachedJson = theCache.get(displayableMenu)
		if (cachedJson) {
			_cache(theCache, displayableMenu)
		}
	}

	def cache(theCache) {
		_cache(theCache, toDisplayableMenu())
	}

	def _cache(theCache, displayableMenu) {
		theCache.add(displayableMenu, JSON.use(JsonMarshallingRegistrar.MENU_PRESENTER_MARSHALLING_CONFIG) {
			displayableMenu as JSON
		}.toString())
	}
}
