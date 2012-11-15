Ext.namespace('Portal.ui');

Portal.ui.ActiveLayersPanel = Ext.extend(Ext.tree.TreePanel, {
	
	constructor: function(cfg) {
		
		var config = Ext.apply({
			title: "Active Layers<br><i><small>No layers added to map</small></i>",
	        id: 'activeLayerTreePanel',
	        enableDD: true,
			useArrows: true,
            rootVisible: false,
            
	        root: new GeoExt.tree.OverlayLayerContainer({        
	            layerStore: cfg.layerStore, 
	            leaf: false,
	            expanded: true,
                loader: new GeoExt.tree.LayerLoader({
					filter: function(record){
						var layer = record.getLayer();
						if(layer.isAnimatedSlice == undefined){
							return layer.displayInLayerSwitcher === true && layer.isBaseLayer === false;
						}
						return false;
					},
					
					createNode: function(attr) {
					    
	                    attr.uiProvider = Portal.ui.ActiveLayersTreeNodeUI;
                        return GeoExt.tree.LayerLoader.prototype.createNode.call(this, attr);
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
		
		}, cfg);
		Portal.ui.ActiveLayersPanel.superclass.constructor.call(this, config);
		this.addEvents('removelayer', 'zoomtolayer', 'selectedactivelayerchanged');
		// Not sure what these all are:  this.bubbleEvents = ['add', 'remove', 'removelayer', 'zoomtolayer'];
		
		this.on("click", this.activeLayersTreePanelClickHandler, this);
		this.on("checkchange", this.activeLayersTreePanelCheckChangeHandler, this);
        this.mon(this.root, 'append', this.updateTitle, this);
        this.mon(this.root, 'insert', this.updateTitle, this);
        this.mon(this.root, 'remove', this.updateTitle, this);
		this.getSelectionModel().on("selectionchange", this.activeLayersTreePanelSelectionChangeHandler, this);
	},
	
	setActiveNode: function(node) {		
		this.getRootNode().eachChild(function(n) {
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
		
		var selectedNode = this.getSelectionModel().select(node);			
		var checkedLayers = this.getChecked();

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
		if (node != null) {
			this.fireEvent('selectedactivelayerchanged'); // zoom to layer call
			Ext.MsgBus.publish("selectedLayerChanged", node.layer);
	    } 
	},

	layerHasBoundingBox: function(layer)
	{
		// TODO: move "hasBoundingBox" to somewhere common (i.e. not MapPanel).
		// Or, can "hasBoundingBox" be made static?
		return this.mapScope.hasBoundingBox(layer);
	},
	
	getActiveLayerNodes: function() {
		var leafNodes = [];
		this.addLeafNodes(this.getRootNode(), leafNodes);
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
		return this.getSelectionModel().getSelectedNode();
	},
	
	getSelectedLayer: function () {
		var node = this.getSelectedNode();
		return (node != null) ? this.getSelectedNode().layer : null;
	},
	
	removeLayer: function() {
	    
		var selectedLayer = this.getSelectedLayer();
		
		var checkedLayers = this.getChecked();
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
	},
	
	/**
	 * Bug fix, see: http://www.sencha.com/forum/showthread.php?105047-Setting-TreeNode.uiProvider-Causes-RootVisible-to-be-Ignored
	 */
	setRootNode : function(node){
       
	    node = Portal.ui.ActiveLayersPanel.superclass.setRootNode.call(this, node);
	    node.ui = new Ext.tree.RootTreeNodeUI(node);
       
	    return node;
	},

    updateTitle: function() {
        var title = 'Active Layers';
        if (!this.root.hasChildNodes()) {
            title += '</br><i><small>No layers added to map</small></i>';
        }
        this.setTitle(title);
    }
});
