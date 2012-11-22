
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal.display

class MenuItemPresenter {
	
	def leaf
	def text
	def childItems
	def layer
	def server

	MenuItemPresenter(domainMenuItem, itemFilter) {
		leaf = domainMenuItem.leaf
		text = domainMenuItem.text
		childItems = []
		
		_initLayer(domainMenuItem.layer)
		_initServer(domainMenuItem.server)
		_initChildItems(domainMenuItem.childItems, itemFilter)
	}

	def isViewable(itemFilter) {
		return itemFilter(this)
	}

	def _initChildItems(domainChildItems, itemFilter) {
		domainChildItems.each { childDomainItem ->
			def item = new MenuItemPresenter(childDomainItem, itemFilter)
			if (item.isViewable(itemFilter)) {
				childItems << item
			}
		}
	}
	
	def _initLayer(domainLayer) {
		if (domainLayer) {
			layer = new LayerPresenter(domainLayer)
		}
	}
	
	def _initServer(domainServer) {
		if (domainServer) {
			server = new ServerPresenter(domainServer)
		}
	}
}
