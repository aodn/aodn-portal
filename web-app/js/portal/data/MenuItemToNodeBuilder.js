
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.data');

Portal.data.MenuItemToNodeBuilder = Ext.extend(Object, {

	build: function(menu) {
		if (menu && menu.menuItems) {
			return this.addDetail(menu.menuItems);
		}
		return [];
	},
	
	addDetail: function(menuItems) {
		Ext.each(
			menuItems,
			function(item, index, all) {
	    		if (item.layer) {
                    item.grailsLayerId = item.layer.id;
                }
                if (item.server) {
	    		    item.grailsServerId = item.server.id;
                }
	    		item.children = item.childItems;
	    		if (this.isLayerBlackListed(item.layer)) {
	    			item.cls = 'layer_blacklisted';
	    		}
	    		else if (!this.isLayerActive(item.layer)) {
	    			item.cls = 'layer_inactive';
	    		}
	    		if (this.isNotEmpty(item.childItems)) {
	    			this.addDetail(item.childItems)
	    		}
			},
			this
		);
		return menuItems;
	},
	
	isNotEmpty: function(collection) {
		return collection && collection.length > 0
	},
	
	isLayerBlackListed: function(layer) {
		return layer && layer.blacklisted;
	},
	
	isLayerActive: function(layer) {
		return !layer || layer.activeInLastScan; 
	}
});
