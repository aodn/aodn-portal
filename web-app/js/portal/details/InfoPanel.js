Ext.namespace('Portal.details');

Portal.details.InfoPanel = Ext.extend(Ext.Panel, {

    constructor: function(cfg) {
    	var config = Ext.apply({
    		id: 'infoPanel',
    	    title: 'Info',
    	    layout: 'fit',
    	    autoScroll: true,
    	    html: "Loading ..."
    	}, cfg);
        
        Portal.details.InfoPanel.superclass.constructor.call(this, config);
    },

	initComponent: function(cfg){
		Portal.details.InfoPanel.superclass.initComponent.call(this);
	},


	setSelectedLayer: function(layer){
		this.selectedLayer = layer;
	},
	
	update: function(show, hide, target) {
        if (this._showBody()) {
        	this._updateBody();
        	show.call(target, this);
        }
        else {
        	hide.call(target, this);
        }
	},
	
	_showBody: function() {
		return this.selectedLayer.getMetadataUrl();
	},

	_updateBody: function() {
		this.body.update("Loading...");
		if (this.selectedLayer.getMetadataUrl()) {
			Ext.Ajax.request({
				url: 'layer/getFormattedMetadata?metaURL=' + this.selectedLayer.getMetadataUrl(),
				scope: this,
				success: function(resp, options) {
					this.body.update(resp.responseText);
				},
				failure: function(resp) {
					this.body.update("No information available at this time.");
				}
			});
		}
	}
});