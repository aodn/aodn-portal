
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import au.org.emii.portal.config.JsonMarshallingRegistrar
import au.org.emii.portal.display.MenuPresenter
import grails.converters.JSON
import groovy.time.TimeCategory
import org.apache.commons.lang.builder.EqualsBuilder

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

		def startTime = new Date()

		def displayableMenu = toDisplayableMenu()
		def cachedJson = theCache.get(displayableMenu)
		if (cachedJson) {
			_cache(theCache, displayableMenu)
		}

		use(TimeCategory) {
			log.debug "recache() on '$this' took ${new Date() - startTime}"
		}
	}

	def cache(theCache) {

		def startTime = new Date()

		_cache(theCache, toDisplayableMenu())

		use(TimeCategory) {
			log.debug "cache() on '$this' took ${new Date() - startTime}"
		}
	}

	def _cache(theCache, displayableMenu) {
        //NoSuchFieldException getting thrown is a known problem with grails 1.3.7
        //it's caused by the use of a grails hack which trys to access no existent String properties
        //There for disable the hack beforehand and reenable after.
        //see http://stackoverflow.com/questions/14510805/grails-1-3-7-java-7-compatibility
        //and http://grails.org/doc/1.1.1/api/org/codehaus/groovy/grails/web/util/StringCharArrayAccessor.html
        System.setProperty("stringchararrayaccessor.disabled", "true")

        theCache.add(displayableMenu, JSON.use(JsonMarshallingRegistrar.MENU_PRESENTER_MARSHALLING_CONFIG) {
            displayableMenu as JSON
        }.toString())

        System.setProperty("stringchararrayaccessor.disabled", "false")
	}
}
