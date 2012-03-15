Ext.namespace('Portal.ui');

Portal.ui.ActionsPanel = Ext.extend(Ext.Panel, {
	
	constructor: function(cfg) {
		this.mapOptionsPanel = new Portal.ui.MapOptionsPanel(cfg);
		this.activeLayersPanel = new Portal.ui.ActiveLayersPanel(cfg);
		var config = Ext.apply({
                    id: 'activeMenuPanel',
		    flex: 1,
		    padding: '0px 0px 20px 0px',
                      
                    autoScroll: true,
		    minHeight: 100,
		    items:[
		        this.mapOptionsPanel,
		        this.activeLayersPanel
		    ]
		}, cfg);
		Portal.ui.ActionsPanel.superclass.constructor.call(this, config);
		
		this.addEvents('removelayer', 'zoomtolayer', 'togglevisibility');
		this.relayEvents(this.activeLayersPanel, ['removelayer', 'zoomtolayer', 'togglevisibility']);
		this.relayEvents(this.mapOptionsPanel, ['removealllayers', 'resetmap', 'hidelayeroptionschecked', 'hidelayeroptionsunchecked', 'autozoomchecked', 'autozoomunchecked']);
	},
	
	initBaseLayerCombo: function() {
		this.mapOptionsPanel.initBaseLayerCombo();
	},
	
	getActiveLayerNodes: function() {
		return this.activeLayersPanel.getActiveLayerNodes();
	},
	
	layerOptionsVisible: function() {
		return this.mapOptionsPanel.layerOptionsVisible();
	},
	
	autoZoomEnabled: function() {
		return this.mapOptionsPanel.autoZoomEnabled();
	}
});

Portal.ui.MapOptionsPanel = Ext.extend(Ext.Panel, {
	
	constructor: function(cfg) {
		this.snapshotController = new Portal.snapshot.SnapshotController({
			map: cfg.map,
			addGrailsLayerFn: cfg.addGrailsLayerFn,
			mapScope: cfg.mapScope
		});
		this.snapshotController.on('snapshotLoaded', function() {
			this.fireRemoveAllLayers();
		}, this);
		this.baseLayerCombo = new GeoExt.ux.BaseLayerComboBox({
            map: cfg.map,           
            editable: false,
            width: 175,
            padding: 20,
            emptyText: 'Choose a Base Layer'
        });
		
		this.hideLayerOptionsCheckbox = new Ext.form.Checkbox({
            boxLabel: 'Hide layer options',
            inputType: 'checkbox',
            checked: cfg.hideLayerOptions 
        });
		this.hideLayerOptionsCheckbox.addEvents('hidelayeroptionschecked', 'hidelayeroptionsunchecked');
		this.hideLayerOptionsCheckbox.on('check', function(box, checked) {
			var event = checked ? 'hidelayeroptionschecked' : 'hidelayeroptionsunchecked';
			box.fireEvent(event, box, checked);
		}, this);
		
		this.autoZoomCheckbox = new Ext.form.Checkbox({
            boxLabel: 'Auto zoom to layer',
            inputType: 'checkbox',
            checked: cfg.autoZoom
        });
		this.autoZoomCheckbox.addEvents('autozoomchecked', 'autozoomunchecked');
		this.autoZoomCheckbox.on('check', function(box, checked) {
			var event = checked ? 'autozoomchecked' : 'autozoomunchecked';
			box.fireEvent(event, box, checked);
		}, this);
		
		var config = Ext.apply({
	        collapseMode : 'mini',
	        autoHeight: true,
	        region: 'north',
	        items:[
	            {
	                id : 'mapOptions',
	                items: [
	                    new Ext.Container({
	                        layout: 'hbox',
                                height: 40,
	                        items: [
                                { 
                                    flex: 3,
                                    items: [ this.hideLayerOptionsCheckbox, this.autoZoomCheckbox ]
                                },
	                            new Ext.BoxComponent({      
                                    flex: 2,
                                    border: true,
                                    padding: 4,
                                    id: 'mapSpinnerPanel',
                                    html: '<div class="extAjaxLoading"  style="display:none" >\n<div class="loading-indicator"> Loading...</div>\n</div>'
	                            })
	                        ]
	                    }),
	                    new Ext.Spacer({height: 5}),
	                    this.initButtonPanel(),
	                    new Ext.Spacer({height: 2}),
	                    new Portal.snapshot.SnapshotOptionsPanel({controller: this.snapshotController}),
	                    this.baseLayerCombo
	                ]
	            }
	        ]
		}, cfg);
		
		Portal.ui.MapMenuPanel.superclass.constructor.call(this, config);
		
		//this.addEvents('transect');
		this.relayEvents(this.buttonPanel, ['removealllayers', 'resetmap']);
		this.relayEvents(this.hideLayerOptionsCheckbox, ['hidelayeroptionschecked', 'hidelayeroptionsunchecked']);
		this.relayEvents(this.autoZoomCheckbox, ['autozoomchecked', 'autozoomunchecked']);
	},
	
	initButtonPanel: function() {
		this.buttonPanel = new Ext.Panel({        
	        border: true, 
	        flex: 1,
	        items:[
		        {
		        	xtype: 'button',
		        	text: 'Remove All Layers',
		        	cls: "floatLeft buttonPad",   
		            tooltip: "Remove all overlay layers from the map",
		            scope: this,
		            handler: this.fireRemoveAllLayers
		        },
		        {
		        	xtype: 'button',
		        	text: 'Reset Map',
		            tooltip:  'This will load the default set of map overlay layers and reset the map location and zoom level',   
		            cls: "floatLeft buttonPad",
		            scope: this,
		            handler: function() {this.fireEvent('resetmap');}
		        },
		        new Portal.snapshot.SnapshotSaveButton({controller: this.snapshotController})
	        ]
	    });
		this.buttonPanel.addEvents('removealllayers', 'resetmap');
		return this.buttonPanel;
	},
	
	initBaseLayerCombo: function() {
		this.baseLayerCombo.initComponent();
	},
	
	layerOptionsVisible: function() {
		return this.hideLayerOptionsCheckbox.getValue();
	},
	
	autoZoomEnabled: function() {
		return this.autoZoomCheckbox.getValue();
	},
	
	fireRemoveAllLayers: function() { 
		this.fireEvent('removealllayers');
	}
});

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
		return this.activeLayers.getSelectionModel().getSelectedNode()
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
