Ext.namespace('Portal.ui');

//TODO: add something here to hide/show 'no layer selected' if there are no active layers on the map
Portal.ui.RightDetailsPanel = Ext.extend(Ext.Panel, {
	id: 'rightDetailsPanel',
	region: 'east',
	title: OpenLayers.i18n('noActiveLayersSelected'),
	//collapsed: true,
	stateful: false,
	padding:  '10px 10px 5px 20px',
	split: true,
	width: 350,
	minWidth: 250,
	layout: 'fit',

	// check whether the panel has been rendered before calling the default expand method
	expand: function() {
	  if (this.rendered) {
		Portal.ui.RightDetailsPanel.superclass.expand.call(this, arguments);
	  }
	},

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
	// a new layer has been added
	update: function(openlayer){
		
		// show new layer unless user requested 'hideLayerOptions' or
		// check if the map is still in focus - not the search
		if (!(Portal.app.config.hideLayerOptions === true || !viewport.isMapVisible() )) {
			if(this.collapsed) {
				this.expand();
				//	wait for the expansion for the benefit of the opacity slider		
				this.detailsPanelItems.updateDetailsPanel.defer(1500,this.detailsPanelItems,[openlayer]);
			}
			else {
				this.detailsPanelItems.updateDetailsPanel(openlayer);
			}		

			this.text = openlayer.name;
			this.setTitle(openlayer.name);
		}
		else {
			this.collapseAndHide();			
		}

		
	},

	collapseAndHide: function(){
			this.setTitle(OpenLayers.i18n('noActiveLayersSelected'));
			this.collapse(true);			
			this.detailsPanelItems.hideDetailsPanelContents();
	}
});