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
		this.addEvents('removelayer', 'zoomtolayer', 'selectedactivelayerchanged');
		this.bubbleEvents = ['add', 'remove', 'removelayer', 'zoomtolayer'];
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
		
		this.activeLayers.on("click", this.activeLayersTreePanelClickHandler, this);
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

	activeLayersTreePanelClickHandler: function(node, event) 
	{
		// Only toggle if the node is already selected.
		if (this.getSelectedNode() === node)
		{
			node.getUI().toggleCheck();
		}
	},
	
	activeLayersTreePanelSelectionChangeHandler: function(selectionModel, node)
	{
	    if(node != null){
	        this.fireEvent('selectedactivelayerchanged');
            Ext.getCmp('detailsPanelItems').updateDetailsPanel(node.layer);
	    }
	    else if(this.activeLayers.getRootNode().childNodes.length == 1){

	        Ext.getCmp('rightDetailsPanel').collapse(true); // nothing to see now
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
		return new Portal.ui.Map().hasBoundingBox(layer);
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
	}
});
