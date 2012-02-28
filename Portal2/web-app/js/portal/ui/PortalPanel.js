Ext.namespace('Portal.ui');

Portal.ui.PortalPanel = Ext.extend(Ext.Panel, {

	constructor: function(cfg) {
		this.appConfig = cfg.appConfig;
		this.mapPanel = new Portal.ui.Map({
			initialBbox: this.appConfig.initialBbox,
			autoZoom: this.appConfig.autoZoom,
			hideLayerOptions: this.appConfig.hideLayerOptions
		});
		
		this.leftTabMenuPanel = new Portal.ui.MapMenuPanel({ 
			menuId: this.appConfig.defaultMenu.id
		});
		
		this.actionsPanel = new Portal.ui.ActionsPanel({
			map: this.mapPanel.map,
			layerStore: this.mapPanel.layers,
			hideLayerOptions: this.appConfig.hideLayerOptions,
			autoZoom: this.appConfig.autoZoom
		});
		
		this.mapPanel.on('baselayersloaded', function() {
			this.actionsPanel.initBaseLayerCombo();
		}, this);
		
		this.mapPanel.on('layeradded', function(openLayer) {
			this.leftTabMenuPanel.toggleLayerNodes(openLayer.grailsLayerId, false);
		}, this);
		
		this.actionsPanel.on('removealllayers', function() {
			this.mapPanel.removeAllLayers();
			this.leftTabMenuPanel.toggleNodeBranch(true);
		}, this);
		
		this.actionsPanel.on('resetmap', function() {
			this.mapPanel.removeAllLayers();
			this.mapPanel.zoomToInitialBbox();
			this.leftTabMenuPanel.toggleNodeBranch(true);
			this.mapPanel.addDefaultLayers();
		}, this);
		
		this.leftTabMenuPanel.on('serverloaded', function(node) {
			Ext.each(this.actionsPanel.getActiveLayerNodes(), function(node, index, all) {
				this.leftTabMenuPanel.toggleLayerNodes(node.layer.grailsLayerId, false);
			}, this);
		}, this);
		
		var config = Ext.apply({
			layout: 'border',
	        id: 'mainMapPanel',
	        title: 'Map',
	        stateful: false,
	        items: [
                {            
                    region: 'west',
                    id: "leftMenus",
                    headerCfg:  {
                        cls: 'menuHeader',
                        html: 'Message'
                    },
                    title: 'Layer Chooser',
                    autoScroll: true,
                    items: [
                        this.leftTabMenuPanel,
                        this.actionsPanel
                    ],
                    cls: 'leftMenus',
                    collapsible: true,
                    collapseMode: 'mini',
                    stateful: false,
                    split: true,
                    width: this.appConfig.westWidth,
                    minWidth: 260,
                    listeners: {
                    	// TODO tommy
//                        // show the little expand button on map right.
//                        beforeexpand: function(){                    
//                            var ls = mapPanel.map.getControlsByClass('OpenLayers.Control.LayerSwitcher')[0];
//                            ls.destroy();
//                        },                
//                        beforecollapse: function(){                    
//                            mapPanel.map.addControl(new OpenLayers.Control.LayerSwitcher({
//                                roundedCornerColor: '#34546E' // bloody openlayers!!
//                            }));
//                        }
                    }
                },
                {
                    region:'center',
                    id: 'mainMapCentrePanel',
                    layout:'border',
                    stateful: false,
                    items: [                
                        this.mapPanel,    
                        {
                            region: 'south',
                            layout: 'hbox',
                            cls: 'footer',
                            padding:  '7px 0px 0px 15px',
                            unstyled: true,
                            height: this.appConfig.footerHeight,
                            items: [
                                {
                                    // this is not a configured item as wont change and will need tailoring for every instance
                                    xtype: 'container',
                                    html: "<img src=\"images/DIISRTE_Inline-PNGSmall.png\" />",
                                    width: 330
                                },
                                {
                                    xtype: 'container',
                                    html: this.appConfig.footerContent,
                                    cls: 'footerText',
                                    width: this.appConfig.footerContentWidth
                                }
                            ]
                            
                        }
                    ]
                }//,
//                {
//                    xtype: 'panel',
//                    id: 'rightDetailsPanel',
//                    region: 'east',
//                    hideMode: 'offsets',
//                    hidden: true,
//                    collapsible: false,            
//                    stateful: false,
//                    //html: 'ActiveLayers Details panel here',
//                    split: true,
//                    width: 350,
//                    minWidth: 250,
//                    closeAction: 'hide',
//                    collapseMode: 'mini',
//                    autoDestroy: false,
//                    tools:[
//                        {
//                            id:'unpin',
//                            qtip: 'Make these options appear in a popup again',
//                            // hidden:true,
//                            handler: function(event, toolEl, panel){
//
//                                toggleDetailsLocation();
//                            }
//                        },
//                        {
//                            id:'close',
//                            qtip: 'Note: select "Hide layer options" to keep this panel closed',
//                            // hidden:true,
//                            handler: function(event, toolEl, panel){
//
//                                closeNHideDetailsPanel();
//                            }
//                        }                
//                    ],
//                    listeners: {
//                        // ensure it dosent overlay the map
//                        show: function(panel) {                    
//                            mapMainPanel.doLayout();
//                        }
//                    }
//                }
            ]
		}, cfg);
	
		Portal.ui.PortalPanel.superclass.constructor.call(this, config);
		
		this.mon(this.leftTabMenuPanel, 'click', this.onMenuNodeClick, this);
		this.mon(this.actionsPanel, 'removelayer', this.removeLayer, this);
		this.mon(this.actionsPanel, 'zoomtolayer', this.zoomToLayer, this);
		this.mon(this.actionsPanel, 'hidelayeroptionschecked', this.layerOptionsCheckboxHandler, this);
		this.mon(this.actionsPanel, 'hidelayeroptionsunchecked', this.layerOptionsCheckboxHandler, this);
		this.mon(this.actionsPanel, 'autozoomchecked', this.autoZoomCheckboxHandler, this);
		this.mon(this.actionsPanel, 'autozoomunchecked', this.autoZoomCheckboxHandler, this);
	},
	
	onMenuNodeClick: function(node) {
		if (node.attributes.grailsLayerId) {
        	this.mapPanel.addGrailsLayer(node.attributes.grailsLayerId);
        }
	},
	
	removeLayer: function(openLayer) {
		this.mapPanel.removeLayer(openLayer);
		this.leftTabMenuPanel.toggleLayerNodes(openLayer.grailsLayerId, true);
	},
	
	zoomToLayer: function(openLayer) {
		this.mapPanel.zoomToLayer(openLayer);
	},
	
	layerOptionsVisible: function() {
		return this.actionsPanel.layerOptionsVisible();
	},
	
	autoZoomEnabled: function() {
		this.actionsPanel.autoZoomEnabled();
	},
	
	layerOptionsCheckboxHandler: function(box, checked) {
    	// TODO tommy
	    Portal.app.config.hideLayerOptions = checked;
	    this.mapPanel.hideLayerOptions = checked;
	    if (checked) {
	        //closeNHideDetailsPanel();
	    }
	},
	
	autoZoomCheckboxHandler: function(box, checked) {
        // TODO tommy
        //checked: (Portal.app.config.autoZoom) ? Portal.app.config.autoZoom : false,
        Portal.app.config.autoZoom = checked;
        this.mapPanel.autoZoom = checked;
	},
	
	addMapLayer: function(layerDescriptor, showLoading) {
		this.mapPanel.addLayer(this.mapPanel.getOpenLayer(layerDescriptor), showLoading);
	}
});