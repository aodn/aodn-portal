Ext.namespace('Portal.ui');

Portal.ui.ActiveLayersPanel = Ext.extend(Ext.Panel, {
	
	constructor: function(cfg) {
		
		var config = Ext.apply({
			title: "Active Layers",
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
		this.addEvents('removelayer', 'zoomtolayer', 'selectedactivelayerchanged');
		// Not sure what these all are:  this.bubbleEvents = ['add', 'remove', 'removelayer', 'zoomtolayer'];
	},

	initActiveLayers: function(layerStore) {
		this.initLayerActionsMenu();
		
		this.activeLayers = new Ext.tree.TreePanel({
	        id: 'activeLayerTreePanel',
//	        enableDD: true,
	        rootVisible: false,
	        root: new GeoExt.tree.OverlayLayerContainer({        
	            layerStore: layerStore, 
	            leaf: false,
	            expanded: true,
	            loader: Ext.applyIf({
					filter: function(record){
						var layer = record.getLayer();
						if(layer.isAnimatedSlice == undefined){
							return layer.displayInLayerSwitcher === true && layer.isBaseLayer === false;
						}
						return false;
					}
				}),
				listeners: {
					// fake the selected node
					// initial loading
					scope: this,
					append: function( tree, thisNode, node, index ) {
							node.setCls('x-tree-selected');
					},
					// subsequent tree nodes
					insert: function( tree, thisNode, node, refNode ) {
						this.setActiveNode(node);
					}
				}
	        })
		});
		
		this.activeLayers.on("contextmenu", function(node, event) {
			this.activeLayers.getSelectionModel().select(node);
	        this.layerActionsMenu.showAt(event.getXY());
	    }, this);
		
		this.activeLayers.on("click", this.activeLayersTreePanelClickHandler, this);
		this.activeLayers.on("checkchange", this.activeLayersTreePanelCheckChangeHandler, this);
		this.activeLayers.getSelectionModel().on("selectionchange", this.activeLayersTreePanelSelectionChangeHandler, this);
		
		return this.activeLayers;
	},
	
	initLayerActionsMenu: function() {
		
		this.zoomToLayerMenuItem = new Ext.menu.Item({
        	text: 'Zoom to layer', 
        	scope: this, 
        	handler: this.zoomToLayer
        });
		
		this.layerActionsMenu = new Ext.menu.Menu({
	        plain: true,
	        floating: true,
	        showSeparator: false,
	        items: [
                {
                	text: 'Remove layer', 
                	scope: this, 
                	handler: this.removeLayer
                },
                this.zoomToLayerMenuItem
	        ],
	        listeners:
	        {
        		scope: this,
        		beforeshow: this.updateZoomToLayerMenuItemVisibility								
	        }
	    });
		return this.layerActionsMenu;
	},


	
	setActiveNode: function(node) {		
		this.activeLayers.getRootNode().eachChild(function(n) {
			if (n === node) {	
				n.setCls('x-tree-selected');	
			}
			else {		
				n.setCls('');
				n.unselect(true);
			}
		});
	},	

	activeLayersTreePanelClickHandler: function(node, event) {		
		this.setActiveNode(node);
		node.getUI().toggleCheck(true);		
		
	},
	activeLayersTreePanelCheckChangeHandler: function(node, checked) {	
		
		var selectedNode = this.activeLayers.getSelectionModel().select(node);			
		var checkedLayers = this.activeLayers.getChecked();

		if (checkedLayers.length == 0) {
			this.setActiveNode(null); // makes nothing active
			Ext.getCmp('rightDetailsPanel').collapseAndHide(); //Hide details panel if there are no checked active layers
		}
		//Commenting the following bit of code out, as it updates the right details panel twice whenever a layer
		//is selected in the active layers panel, thus, making twice as many AJAX calls to get layer metadata.
		//else {
			//this.activeLayersTreePanelSelectionChangeHandler(null, selectedNode);
		//}
	},
		
	activeLayersTreePanelSelectionChangeHandler: function(selectionModel, node)	{
		if(node != null){
			this.fireEvent('selectedactivelayerchanged'); // zoom to layer call
			Ext.getCmp('rightDetailsPanel').update(node.layer);
			Ext.getCmp('map').updateAnimationPanel(node.layer);
	    } 
	},

	updateZoomToLayerMenuItemVisibility: function()
	{
		this.zoomToLayerMenuItem.setVisible(this.layerHasBoundingBox(this.getSelectedNode().layer));
	},
	
	layerHasBoundingBox: function(layer)
	{
		// TODO: move "hasBoundingBox" to somewhere common (i.e. not MapPanel).
		// Or, can "hasBoundingBox" be made static?
		return this.mapScope.hasBoundingBox(layer);
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
		var node = this.getSelectedNode();
		return (node != null) ? this.getSelectedNode().layer : null;
	},
	
	removeLayer: function() {
		var selectedLayer = this.getSelectedLayer();
		var checkedLayers = this.activeLayers.getChecked();
		//Decide which layer to show in details panel
		var newDetailsPanelLayer = null;
		if (checkedLayers.length > 0) {
			if (checkedLayers[0].layer != selectedLayer) {
				newDetailsPanelLayer = checkedLayers[0].layer;
			} else if (checkedLayers.length > 1) {
				newDetailsPanelLayer = checkedLayers[1].layer;
			}
		} 
		
	    if (this.fireEvent('removelayer', selectedLayer, newDetailsPanelLayer)) {
			
		}
	},
	
	zoomToLayer: function() {
		if (this.fireEvent('zoomtolayer', this.getSelectedLayer())) {
			
		}
	}
});
