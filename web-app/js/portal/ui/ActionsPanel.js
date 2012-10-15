Ext.namespace('Portal.ui');

Portal.ui.ActionsPanel = Ext.extend(Ext.Panel, {

    constructor: function(cfg) {
        this.mapOptionsPanel = new Portal.ui.MapOptionsPanel(cfg);
        this.activeLayersPanel = new Portal.ui.ActiveLayersPanel(cfg);
        var config = Ext.apply({
            id: 'activeMenuPanel',
		    padding: '0px 0px 20px 0px',
		    autoHeight: true,
		    items:[
		        this.mapOptionsPanel,
		        this.activeLayersPanel
		    ]
		}, cfg);
		Portal.ui.ActionsPanel.superclass.constructor.call(this, config);
	},

	loadSnapshot: function(id) {
		this.mapOptionsPanel.loadSnapshot(id);
	}
});
