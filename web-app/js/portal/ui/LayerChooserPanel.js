Ext.namespace('Portal.ui');

Portal.ui.LayerChooserPanel = Ext.extend(Ext.Panel, {
	
    constructor: function(cfg) {
        this.appConfig = cfg.appConfig;
        this.mapPanel = cfg.mapPanel;
        this.initActionsPanel(this.appConfig, this.mapPanel);
        this.initLeftTabMenuPanel(this.appConfig);
		
        var config = Ext.apply({
            id: "leftMenus",
            minWidth: 260,
            maxWidth: 450,
            collapsible: true,
            collapseMode: 'mini',
            stateful: false,
            split: true,
            headerCfg:  {
                cls: 'menuHeader',
                html: 'Message'
            },
            title: 'Layer Chooser',
            layout: 'vbox',
            layoutConfig: {
              align: 'stretch'
            },
            autoScroll: true,
            items: [
                this.leftTabMenuPanel,
                this.actionsPanel
            ],
            cls: 'leftMenus'
        }, cfg);
	
        Portal.ui.LayerChooserPanel.superclass.constructor.call(this, config);
        this.registerEvents();
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
    
    initLeftTabMenuPanel: function(appConfig) {
        this.leftTabMenuPanel = new Portal.ui.MapMenuPanel({ 
            menuId: appConfig.defaultMenu.id
        });
    },
    
    registerEvents: function() {
    	this.registerOwnEvents();
    	this.registerMapPanelEvents();
        this.registerActionPanelEvents();
        this.registerLeftTabMenuPanelEvents();
        this.registerMonitoringEvents();
    },
    
    registerOwnEvents: function() {
        
        this.on('beforeexpand', function() {
            this.layerSwitcher.destroy();
        }, this);
        	
        this.on('beforecollapse', function() {
            this.layerSwitcher = new OpenLayers.Control.LayerSwitcher({
                roundedCornerColor: '#34546E'
            });
            this.mapPanel.map.addControl(this.layerSwitcher);
        }, this);
    },
    
    registerMapPanelEvents: function() {
        this.mapPanel.on('baselayersloaded', function() {
            this.actionsPanel.initBaseLayerCombo();
        }, this);
		
		this.mapPanel.on('layeradded', function(openLayer) {
			this.leftTabMenuPanel.toggleLayerNodes(openLayer.grailsLayerId, false);
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
	
    registerLeftTabMenuPanelEvents: function() {
        this.leftTabMenuPanel.on('serverloaded', function(node) {
            Ext.each(this.actionsPanel.getActiveLayerNodes(), function(node, index, all) {
                this.leftTabMenuPanel.toggleLayerNodes(node.layer.grailsLayerId, false);
            }, this);
        }, this);
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
    
    onMenuNodeClick: function(node) {
        if (node.attributes.grailsLayerId) {
        	setViewPortTab(1);
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
    
    autoZoomCheckboxHandler: function(box, checked) {
        Portal.app.config.autoZoom = checked;
        this.mapPanel.autoZoom = checked;
    },
	
    layerOptionsCheckboxHandler: function(box, checked) {
        Portal.app.config.hideLayerOptions = checked;
        this.mapPanel.hideLayerOptions = checked;
    },

    addMapLayer: function(layerDescriptor, showLoading) {
            this.mapPanel.addLayer(this.mapPanel.getOpenLayer(layerDescriptor), showLoading);
    },
    
    showActions: function() {
      this.actionsPanel.show();
      this.doLayout();
    },
    
    hideActions: function() {
      this.actionsPanel.hide();
    }
});