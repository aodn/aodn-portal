Ext.namespace('Portal.ui');

Portal.ui.ActionsPanel = Ext.extend(Ext.Panel, {
	
	constructor: function(cfg) {
		this.mapOptionsPanel = new Portal.ui.MapOptionsPanel(cfg);
		this.activeLayersPanel = new Portal.ui.ActiveLayersPanel(cfg);
		var config = Ext.apply({
			id: 'activeMenuPanel',
		    flex: 1,
		    padding: '0px 0px 20px 0px',
		    minHeight: 100,
		    items:[
		        this.mapOptionsPanel,
		        this.activeLayersPanel
		    ]
		}, cfg);
		Portal.ui.ActionsPanel.superclass.constructor.call(this, config);
		
		this.addEvents('removelayer', 'zoomtolayer', 'togglevisibility');
		this.relayEvents(this.activeLayersPanel, ['removelayer', 'zoomtolayer', 'togglevisibility']);
	}
});

Portal.ui.MapOptionsPanel = Ext.extend(Ext.Panel, {
	
	constructor: function(cfg) {
		this.snapshotController = new Portal.snapshot.SnapshotController({map: cfg.map});
		
		var config = Ext.apply({
	        collapseMode : 'mini',
	        autoHeight: true,
	        region: 'north',        
	        items:[
	            {
	                // place the map options into a panel so that margin can be placed on the inner mapOptions
	                id : 'mapOptions',
	                items: [
	                    new Ext.Container({
	                        layout: 'hbox',
	                        items: [                
	                            new Ext.Panel({
	                                items: [ 
	                                    // hideLayerOptions
	                                    new Ext.form.Checkbox({
									        boxLabel  : 'Hide layer options',
									        inputType : 'checkbox',
									        listeners: {
									        	// TODO tommy
									            //check: function(thisCheckbox, newValue)  {
									            //    Portal.app.config.hideLayerOptions = newValue;
									            //    if (newValue == true) {
									            //        closeNHideDetailsPanel();
									            //    }
									            //}
									        }
									    }),
	                                    // zoomToLayerChooser 
									    new Ext.form.Checkbox({
									        boxLabel  : 'Auto zoom on layer select',
									        inputType : 'checkbox',
									        // TODO tommy
									        //checked: (Portal.app.config.autoZoom) ? Portal.app.config.autoZoom : false,
									        //listeners: {
									        //    check: function(thisCheckbox, newValue)  {                
									        //        Portal.app.config.autoZoom = newValue;
									        //    }
									        //}
									    })
	                                ]
	                            }),
	                            // mapSpinnerPanel
	                            new Ext.BoxComponent({        
	                                border: true,
	                                id: 'mapSpinnerPanel',
	                                html: '<div class="extAjaxLoading"><div class="loading-indicator"> Loading...</div></div>'
	                            })
	                        ]
	                    }),
	                    new Ext.Spacer({height: 5}),
	                    this.initButtonPanel(),
	                    new Ext.Spacer({height: 2}),
	                    new Portal.snapshot.SnapshotOptionsPanel({controller: this.snapshotController}),
	                    new GeoExt.ux.BaseLayerComboBox({
	                        map: cfg.map,           
	                        editable: false,
	                        width: 175,
	                        padding: 20,
	                        emptyText: 'Choose a Base Layer'
	                    })
	                ]
	            }
	        ]
		}, cfg);
		
		Portal.ui.MapMenuPanel.superclass.constructor.call(this, config);
		
		//this.addEvents('transect');
	},
	
	initButtonPanel: function() {
		this.buttonPanel = new Ext.Panel({        
	        border: true, 
	        flex: 1,
	        items:[
		        // removeAll
		        {
		        	xtype: 'button',
		        	text: 'Remove All Layers',
		        	cls: "floatLeft buttonPad",   
		            tooltip: "Remove all overlay layers from the map",
		            listeners: {
		            	// TODO tommy
		                //click: function(button, event) {
		                //    removeAllLayers();
		                //}
		            }
		        },
		        // resetLayers
		        {
		        	xtype: 'button',
		        	text: 'Reset Map',
		            tooltip:  'This will load the default set of map overlay layers and reset the map location and zoom level',   
		            cls: "floatLeft buttonPad",
		            listeners: {
		            	// TODO tommy
		                //click: function(button, event) {
		                //    removeAllLayers();
		                //    reloadDefaultLayers();
		                //}
		            }
		        },
		        // snapshotSaveButton
		        new Portal.snapshot.SnapshotSaveButton({controller: this.snapshotController})
	        ]
	    });
		return this.buttonPanel;
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
	        }),
	        listeners: {
	        	// TODO tommy
//	            append: function(tree, parent, node){                
//	                // run this once only
//	                // seems to run again when animated images are added
//	                if (!tree.root.hashadtheclickactionadded) {                    
//	                
//	                    //console.log(node.layer.id);
//	                    tree.on("click", function(node,event){
//	                        tree.show(node.ui.getAnchor());
//	                        if(node.isSelected())
//	                        {
//	                            updateDetailsPanel(node.layer);
//	                            node.ui.toggleCheck(true);
//	                        }
//	                    });
//	                    tree.root.hashadtheclickactionadded = true;
//	                }
//	            }
	        }
		});
		
		this.activeLayers.on("contextmenu", function(node, event) {
			this.activeLayers.getSelectionModel().select(node);
	        this.layerActionsMenu.showAt(event.getXY());
	    }, this);
		
		return this.activeLayers;
	},
	
	initLayerActionsMenu: function() {
		this.layerActionsMenu = new Ext.menu.Menu({
	        plain: true,
	        floating: true,
	        showSeparator: false,
	        items: [
                { text: 'Remove layer', scope: this, handler: this.removeLayer },
                { text: 'Zoom to layer', scope: this, handler: this.zoomToLayer },
                { text: 'Toggle Visibility', scope: this, handler: this.toggleLayerVisibility }
	        ]
	    });
		return this.layerActionsMenu;
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
			this.getSelectedNode().getUI().toggleCheck(!this.getSelectedNode().getUI().isChecked());
		}
	}
});