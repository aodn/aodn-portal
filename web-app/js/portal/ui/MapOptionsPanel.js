Ext.namespace('Portal.ui');

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

		this.autoZoomCheckbox = new Ext.form.Checkbox({
            boxLabel: OpenLayers.i18n('autozoom'),
            inputType: 'checkbox',
            checked: cfg.autoZoom
        });
		this.autoZoomCheckbox.addEvents('autozoomchecked', 'autozoomunchecked');
		this.autoZoomCheckbox.on('check', function(box, checked) {
			var event = checked ? 'autozoomchecked' : 'autozoomunchecked';
			box.fireEvent(event, box, checked);
		}, this);
				
		this.hideDetailsPanelCheckbox = new Ext.form.Checkbox({
			
            boxLabel: OpenLayers.i18n('hideDetailsPanel'),
            inputType: 'checkbox',
            checked: (Portal.app.config.hideLayerOptions != undefined)? Portal.app.config.hideLayerOptions: false,
			listeners: {
				check: function(thisThingy,checked) {
					Portal.app.config.hideLayerOptions = checked; // change the global option not a copy
					if (checked) {
						Ext.getCmp('rightDetailsPanel').collapse();
					}
					viewport.mainTabPanel.getPortalPanel().doLayout();
					
				}
			}
        });
		
		
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
                                    items: [ 
										this.autoZoomCheckbox,
										this.hideDetailsPanelCheckbox
									]
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

	autoZoomEnabled: function() {
		return this.autoZoomCheckbox.getValue();
	},
	
	fireRemoveAllLayers: function() { 
		this.fireEvent('removealllayers');
	},

	loadSnapshot: function(id){
        this.snapshotController.loadSnapshot(id, null, function(errors){
        	Ext.MessageBox.show({
			 title:'Saved Map',
			 msg: 'The map you are attempting to view is not available.'
		  });
        });
	}
});
