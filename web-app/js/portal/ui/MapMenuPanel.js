Ext.namespace('Portal.ui');

Portal.ui.MapMenuPanel = Ext.extend(Ext.TabPanel, {

	constructor: function(cfg) {
		
		this.defaultMenuTree = new Portal.ui.MenuPanel({ menuId: cfg.menuId });
		
		var config = Ext.apply({
			defaults: {
	            padding: 5
	        },
	        id: 'leftTabMenuPanel',
	        minHeight: 170,        
	        boxMaxHeight: 200,
	        stateful: false,        
	        split: true,
	        collapseMode: 'mini',
	        border: false,
	        enableTabScroll: true,
	        activeTab: 0,
	        items: [
	            this.defaultMenuTree
	        ]
		}, cfg);
		
		Portal.ui.MapMenuPanel.superclass.constructor.call(this, config);
		
		this.relayEvents(this.defaultMenuTree, ['click']);
	},
	
	toggleLayerNodes: function(id, enable, node) {
		this.defaultMenuTree.toggleLayerNodes(id, enable, node);
	}
});

Portal.ui.MenuPanel = Ext.extend(Ext.tree.TreePanel, {
	
	constructor: function(cfg) {
		
		var config = Ext.apply({
			title: 'WMS Layers',
	        id: 'defaultMenuTree',
	        loader: new Portal.data.MenuTreeLoader({
	            menuId: cfg.menuId
	        }),
	        root: new Ext.tree.AsyncTreeNode({ draggable: false }),
	        collapsible: false,
	        autoHeight: true,
	        rootVisible: false,
	        listeners: {
	            // add layers to map or expand discoveries
	            click: function(node) {
                    if (node.attributes.grailsLayerId) {
                        node.disable();
                    }
                    else {                        
                        //this should be a folder
                        node.expand(); 
                    }
	            },
	            bodyresize: function(panel) {
                    panel.doLayout();
                    this.doLayout();
	            },
	            beforeexpandnode: function(node) {
                    if(node != this.getRootNode()) {
                    	// TODO tommy
                        // This disables the node in the active layers panel menu
                    	// needs to be refactored to elsewhere
                    	//checkDefaultMenuTreeNodeStatus(node);
                    }
	            },
	            expandnode: function(node) {
	            	if (node.attributes.grailsServerId) {
	            		Portal.data.ServerNodeLayerDescriptorStore.HandleServerLayerDescriptorStoreLoad(node, this);
	                }
	            }
	        }
		}, cfg);
		
		Portal.ui.MenuPanel.superclass.constructor.call(this, config);
	},
	
	toggleLayerNodes: function(id, enable, node) {
		if (enable === undefined) {
			enable = false;
		}
		if (node === undefined) {
			node = this.getRootNode();
		}
		if (node.attributes.grailsLayerId == id) {
			if (enable) {
				node.enable();
			}
			else {
				node.disable();
			}
		}
		Ext.each(node.childNodes, function(node, all, index) {
			this.toggleLayerNodes(id, enable, node);
		}, this);
	}
});