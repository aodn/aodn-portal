Ext.namespace('Portal.ui');

//TODO: add something here to hide/show 'no layer selected' if there are no active layers on the map
Portal.ui.RightDetailsPanel = Ext.extend(Ext.Panel, {
	id: 'rightDetailsPanel',
	region: 'east',
	collapsed: true,
	stateful: false,
	padding:  '0px 20px 5px 20px',
	split: true,
	width: 350,
	minWidth: 250,

	initComponent: function(){
		this.detailsPanelItems = new Portal.details.DetailsPanel();
	    this.items = [
			this.detailsPanelItems
		];

        Portal.ui.RightDetailsPanel.superclass.initComponent.call(this);
	},

	getDetailsPanelItems: function(){
		return this.detailsPanelItems;
	},

	update: function(openlayer){
		this.detailsPanelItems.updateDetailsPanel(openlayer);
		this.text = openlayer.name;
		this.setTitle("Layer Options: " + openlayer.name);
        this.doLayout.defer(50, this); // wait for browser to resize autoHeight elements before doing layout

		if(this.collapsed) {
			this.expand();
		}
	},

	closeNHideDetailsPanel: function() {
		if (Portal.app.config.hideLayerOptions === true) {
			if(this.getEl() != undefined){
				this.collapse(true);
			}
		}
		else {
			if(this.getEl() != undefined){
				this.expand(true);
			}
		}
	}
});