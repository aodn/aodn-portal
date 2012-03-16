Ext.namespace('Portal.ui');

Portal.ui.ActiveLayersPanel = Ext.extend(Ext.Panel, {
	
	constructor: function(cfg) {
		var config = Ext.apply({
			title: "Active layers",
		    id: 'activeLayersPanel',
		    items : [
		        new Ext.Container({
			        autoEl: 'div',  // This is the default
			        cls: 'emptyActiveLayerTreePanelText',
			        html: "<p>Choose a layer from the layer chooser above, or use the search feature.</p>"        
			    }),
		        this.initActiveLayers(cfg.layerStore)
		    ]
		}, cfg);
		Portal.ui.ActiveLayersPanel.superclass.constructor.call(this, config);
		this.addEvents('removelayer', 'zoomtolayer', 'togglevisibility');
		this.bubbleEvents = ['add', 'remove', 'removelayer', 'zoomtolayer', 'togglevisibility'];
	},
	
	initActiveLayers: function(layerStore) {
		this.initLayerActionsMenu();
		this.activeLayers = new Ext.tree.TreePanel({
	        id: 'activeLayerTreePanel',
	        enableDD: true,
	        rootVisible: false,
	        root: new GeoExt.tree.OverlayLayerContainer({        
	            layerStore: layerStore, 
	            leaf: false,
	            expanded: true
	        })
		});
		
		this.activeLayers.on("contextmenu", function(node, event) {
			this.activeLayers.getSelectionModel().select(node);
	        this.layerActionsMenu.showAt(event.getXY());
	    }, this);
		
		this.activeLayers.on("click", function(node, event) {
			this.setNodeChecked(node, true);
			updateDetailsPanel(node.layer);
	    }, this);
		
		return this.activeLayers;
	},
	
	initLayerActionsMenu: function() {
		this.layerActionsMenu = new Ext.menu.Menu({
	        plain: true,
	        floating: true,
	        showSeparator: false,
	        items: [
                {text: 'Remove layer', scope: this, handler: this.removeLayer},
                {text: 'Zoom to layer', scope: this, handler: this.zoomToLayer},
                {text: 'Toggle Visibility', scope: this, handler: this.toggleLayerVisibility}
	        ]
	    });
		return this.layerActionsMenu;
	},
	
	getActiveLayerNodes: function() {
		var leafNodes = [];
		this.addLeafNodes(this.activeLayers.getRootNode(), leafNodes);
		return leafNodes;
	},
	
	addLeafNodes: function (node, leafNodes) {
		Ext.each(node.childNodes, function(child, index, all) {
			if (child.leaf) {
				leafNodes.push(child);
			}
			else {
				this.addLeafNodes(child, leafNodes);
			}
		}, this);
	},
	
	getSelectedNode: function() {
		return this.activeLayers.getSelectionModel().getSelectedNode();
	},
	
	getSelectedLayer: function () {
		return this.getSelectedNode().layer;
	},
	
	removeLayer: function() {
		if (this.fireEvent('removelayer', this.getSelectedLayer())) {
			
		}
	},
	
	zoomToLayer: function() {
		if (this.fireEvent('zoomtolayer', this.getSelectedLayer())) {
			
		}
	},
	
	toggleLayerVisibility: function() {
		if (this.fireEvent('togglevisibility', this.getSelectedLayer())) {
			this.setNodeChecked(this.getSelectedNode(), !this.getSelectedNode().getUI().isChecked());
		}
	},
	
	setNodeChecked: function(node, checked) {
		node.getUI().toggleCheck(checked);
	}
});
