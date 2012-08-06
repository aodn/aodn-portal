Ext.namespace('Portal.data');

Portal.data.LayerDataPanelStore = Ext.extend(Ext.data.JsonStore, {
	
	constructor: function(cfg) {
		var config = Ext.apply({
			autoLoad: true,
			root: 'data',
	        fields: ['id', 'title', 'name', 'server', 'isBaseLayer'],
	    	baseParams: {}
		}, cfg);
		
		Portal.data.LayerDataPanelStore.superclass.constructor.call(this, config);
	}
});