Ext.namespace('Portal.ui');

Portal.ui.PortalPanel = Ext.extend(Ext.Panel, {

    constructor: function(cfg) {
        this.appConfig = cfg.appConfig;
		
        this.initMapPanel(this.appConfig);
        this.initRightDetailsPanel(this.appConfig);
		
        var config = Ext.apply({
            layout: 'border',
            id: 'mainMapPanel',
            title: 'Map',
            stateful: false,
            items: [
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
	
    initRightDetailsPanel: function(appConfig) {
        this.rightDetailsPanel = new Ext.Panel({
            id: 'rightDetailsPanel',
            region: 'east',
            collapsible: true, 
            collapsed: true,
            stateful: false,
            padding:  '0px 20px 5px 20px',
            split: true,
            width: 350,
            minWidth: 250,
            collapseMode: 'mini'
        });
    },
	
    registerEvents: function() {
        this.registerMapPanelEvents();
    	this.registerRightDetailsPanelEvents();
    },
    
    registerMapPanelEvents: function() {
		this.mapPanel.on('layeradded', function(openLayer) {
			this.addDetailsPanelItems();
			updateDetailsPanel(openLayer);
		}, this);
	},
	
    registerRightDetailsPanelEvents: function() {	
		// Until the details panel is refactored just grab a handle via Ext
		Ext.getCmp('stopNCAnimationButton').on('click', function() {
			// Note selected layer is a global variable that also should be refactored
			this.mapPanel.stopAnimation(selectedLayer);
		}, this);
	},
	
	addDetailsPanelItems: function() {
		var itemsPanel = Ext.getCmp("detailsPanelItems");
		if (!itemsPanel.isVisible()) {
			this.rightDetailsPanel.add(itemsPanel);
			this.rightDetailsPanel.doLayout();
		}
	},
	
	getMapPanel: function() {
		return this.mapPanel;
	}
});