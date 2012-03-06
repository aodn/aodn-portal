Ext.namespace('Portal.ui');

Portal.ui.PortalPanel = Ext.extend(Ext.Panel, {

	constructor: function(cfg) {
		this.appConfig = cfg.appConfig;
		
		this.initMapPanel(this.appConfig);
		this.initActionsPanel(this.appConfig, this.mapPanel);
		this.initLeftTabMenuPanel(this.appConfig);
		this.initLeftMenuPanel(this.appConfig);
		this.initRightDetailsPanel(this.appConfig);
		
		var config = Ext.apply({
			layout: 'border',
	        id: 'mainMapPanel',
	        title: 'Map',
	        stateful: false,
	        items: [
            	this.leftMenuPanel,
                {
                    region:'center',
                    id: 'mainMapCentrePanel',
                    layout:'border',
                    stateful: false,
                    items: [                
                        this.mapPanel
                    ]
                },
                this.rightDetailsPanel
            ]
		}, cfg);
	
		Portal.ui.PortalPanel.superclass.constructor.call(this, config);
		
		this.registerEvents();
	},
	
	initMapPanel: function(appConfig) {
		this.mapPanel = new Portal.ui.Map({
			initialBbox: appConfig.initialBbox,
			autoZoom: appConfig.autoZoom,
			hideLayerOptions: appConfig.hideLayerOptions
		});
	},
	
	initActionsPanel: function(appConfig, mapPanel) {
		this.actionsPanel = new Portal.ui.ActionsPanel({
			map: mapPanel.map,
			layerStore: mapPanel.layers,
			hideLayerOptions: appConfig.hideLayerOptions,
			autoZoom: appConfig.autoZoom,
			addGrailsLayerFn: mapPanel.addGrailsLayer,
			mapScope: mapPanel
		});
	},
	
	initLeftMenuPanel: function(appConfig) {
		this.leftMenuPanel = new Ext.Panel({            
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
            width: appConfig.westWidth,
            minWidth: 260
        });
		
	},
	
	initLeftTabMenuPanel: function(appConfig) {
		this.leftTabMenuPanel = new Portal.ui.MapMenuPanel({ 
			menuId: appConfig.defaultMenu.id
		});
	},
	
	initRightDetailsPanel: function(appConfig) {
		this.rightDetailsPanel = new Ext.Panel({
            id: 'rightDetailsPanel',
            region: 'east',
            collapsible: true,            
            stateful: false,
            split: true,
            width: 350,
            minWidth: 250,
            collapseMode: 'mini'
		});
	},
	
	registerEvents: function() {
		this.registerMapPanelEvents();
		this.registerActionPanelEvents();
		this.registerLeftMenuPanelEvents();
		this.registerLeftTabMenuPanelEvents();
		this.registerRightDetailsPanelEvents();
		this.registerMonitoringEvents();
	},
	
	registerMonitoringEvents: function() {
		this.mon(this.leftTabMenuPanel, 'click', this.onMenuNodeClick, this);
		this.mon(this.actionsPanel, 'removelayer', this.removeLayer, this);
		this.mon(this.actionsPanel, 'zoomtolayer', this.zoomToLayer, this);
		this.mon(this.actionsPanel, 'hidelayeroptionschecked', this.layerOptionsCheckboxHandler, this);
		this.mon(this.actionsPanel, 'hidelayeroptionsunchecked', this.layerOptionsCheckboxHandler, this);
		this.mon(this.actionsPanel, 'autozoomchecked', this.autoZoomCheckboxHandler, this);
		this.mon(this.actionsPanel, 'autozoomunchecked', this.autoZoomCheckboxHandler, this);
	},
	
	registerMapPanelEvents: function() {
		this.mapPanel.on('baselayersloaded', function() {
			this.actionsPanel.initBaseLayerCombo();
		}, this);
		
		this.mapPanel.on('layeradded', function(openLayer) {
			this.leftTabMenuPanel.toggleLayerNodes(openLayer.grailsLayerId, false);
			this.addDetailsPanelItems();
			updateDetailsPanel(openLayer);
		}, this);
	},
	
	registerActionPanelEvents: function() {
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
	},
	
	registerLeftMenuPanelEvents: function() {
		this.leftMenuPanel.on('beforeexpand', function() {
			this.layerSwitcher.destroy();
		}, this);
		
		this.leftMenuPanel.on('beforecollapse', function() {
			this.layerSwitcher = new OpenLayers.Control.LayerSwitcher({roundedCornerColor: '#34546E'});
	        this.mapPanel.map.addControl(this.layerSwitcher);
		}, this);
	},
	
	registerLeftTabMenuPanelEvents: function() {
		this.leftTabMenuPanel.on('serverloaded', function(node) {
			Ext.each(this.actionsPanel.getActiveLayerNodes(), function(node, index, all) {
				this.leftTabMenuPanel.toggleLayerNodes(node.layer.grailsLayerId, false);
			}, this);
		}, this);
	},
	
	registerRightDetailsPanelEvents: function() {
		// Until the details panel is refactored just grab a handle via Ext
		Ext.getCmp('stopNCAnimationButton').on('click', function() {
			// Note selected layer is a global variable that also should be refactored
			this.mapPanel.stopAnimation(selectedLayer);
		}, this);
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
	    Portal.app.config.hideLayerOptions = checked;
	    this.mapPanel.hideLayerOptions = checked;
	    if (checked) {
	        closeNHideDetailsPanel();
	    }
	},
	
	autoZoomCheckboxHandler: function(box, checked) {
        Portal.app.config.autoZoom = checked;
        this.mapPanel.autoZoom = checked;
	},
	
	addMapLayer: function(layerDescriptor, showLoading) {
		this.mapPanel.addLayer(this.mapPanel.getOpenLayer(layerDescriptor), showLoading);
	},
	
	addDetailsPanelItems: function() {
		var itemsPanel = Ext.getCmp("detailsPanelItems");
		if (!itemsPanel.isVisible()) {
			this.rightDetailsPanel.add(itemsPanel);
			this.rightDetailsPanel.doLayout();
		}
	}
});