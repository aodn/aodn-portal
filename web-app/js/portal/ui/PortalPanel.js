Ext.namespace('Portal.ui');

Portal.ui.PortalPanel = Ext.extend(Ext.Panel, {

    constructor: function(cfg) {
        this.appConfig = cfg.appConfig;
		
        this.initMapPanel(this.appConfig);
        this.rightDetailsPanel = new Portal.ui.RightDetailsPanel({
			region: 'east',
			collapsible: true,
			collapsed: true,
			stateful: false
		});

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

    registerEvents: function() {
        this.on('hide', this.onHidePanel, this);
    },
    
    registerMapPanelEvents: function() {
		this.mapPanel.on('layeradded', function(openLayer) {
			this.rightDetailsPanel.update(openLayer);
		}, this);


	},
	
    registerRightDetailsPanelEvents: function() {	
		// Until the details panel is refactored just grab a handle via Ext
		//Ext.getCmp('stopNCAnimationButton').on('click', function() {
			// Note selected layer is a global variable that also should be refactored
		//	this.mapPanel.stopAnimation(selectedLayer);
		//}, this);
	},

  onHidePanel: function() {
    // TODO: popup should belong to this component
    if (popup) {
      popup.close();
    }
  },
	
	getMapPanel: function() {
		return this.mapPanel;
	}
});