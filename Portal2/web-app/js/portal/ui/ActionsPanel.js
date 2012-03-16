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
