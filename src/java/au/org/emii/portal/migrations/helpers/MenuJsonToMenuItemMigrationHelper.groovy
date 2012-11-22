
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal.migrations.helpers

import grails.converters.JSON;
import au.org.emii.portal.Layer;
import au.org.emii.portal.Menu;
import au.org.emii.portal.MenuItem;
import au.org.emii.portal.Server;

class MenuJsonToMenuItemMigrationHelper {
	
	def parseToMenu(id, itemJson) {
		def menu = new Menu()
		menu.menuItems = [] as SortedSet
		menu.id = id
		_parseMenu(menu, itemJson)
		return menu
	}

	def _parseMenu(menu, itemJson) {
		def itemJsonArray = JSON.use("deep") {
			JSON.parse(itemJson)
		}
		itemJsonArray.eachWithIndex { item, index ->
			def menuItem = new MenuItem()
			menuItem.childItems = [] as SortedSet
			_parseMenuItem(menuItem, item.toString(), index, null)
			menu.menuItems << menuItem
		}
	}
	
	def _parseMenuItem(menuItem, json, menuPosition, parentPosition) {
		def itemsJsonArray = JSON.use("deep") {
			JSON.parse(json)
		}
		menuItem.text = itemsJsonArray.text
		if (itemsJsonArray.grailsLayerId) {
			menuItem.layer = new Layer()
			menuItem.layer.id = itemsJsonArray.grailsLayerId?.toLong()
		}
		if (itemsJsonArray.grailsServerId) {
			menuItem.server = new Server()
			menuItem.server.id = itemsJsonArray.grailsServerId?.toLong()
		}
		menuItem.leaf = itemsJsonArray.leaf?.toBoolean()
		menuItem.menuPosition = menuPosition
		menuItem.parentPosition = parentPosition
		
		if (itemsJsonArray.children) {
			_parseChildren(menuItem, itemsJsonArray.children.toString(), menuPosition)
		}
		else if (itemsJsonArray.json) {
			_parseChildren(menuItem, itemsJsonArray.json.toString(), menuPosition)
		}
	}
	
	def _parseChildren(parent, json, menuPosition) {
		def itemsJsonArray = JSON.use("deep") {
			JSON.parse(json)
		}
		itemsJsonArray.eachWithIndex { item, index ->
			def menuItem = new MenuItem()
			menuItem.childItems = [] as SortedSet
			_parseMenuItem(menuItem, item.toString(), menuPosition, index)
			parent.childItems << menuItem
		}
	}
}
