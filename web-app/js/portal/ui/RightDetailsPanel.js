Ext.namespace('Portal.ui');

//TODO: add something here to hide/show 'no layer selected' if there are no active layers on the map
Portal.ui.RightDetailsPanel = Ext.extend(Ext.Panel, {
	id: 'rightDetailsPanel',
	region: 'east',
	title: OpenLayers.i18n('noActiveLayersSelected'),
	collapsed: true,
	stateful: false,
	padding:  '0px 20px 5px 20px',
	split: true,
	width: 350,
	minWidth: 250,

    listeners: {
        expand: function() {
        	//Force the opacity slider to move to correct location on selection of first layer.  
        	var opacitySlider = this.detailsPanelItems.getOpacitySlider();
        	opacitySlider.setValue(0,true);
        	opacitySlider.setValue(this.detailsPanelItems.selectedLayer.opacity * 100,true);
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

	update: function(openlayer){
		this.detailsPanelItems.show(); 
		this.detailsPanelItems.updateDetailsPanel(openlayer);
		this.text = openlayer.name;
		this.setTitle(openlayer.name);
		
        this.doLayout.defer(50, this); // wait for browser to resize autoHeight elements before doing layout

		if(this.collapsed) {
			this.expand();
		}
	},
	

	collapseAndHide: function(){
			this.setTitle(OpenLayers.i18n('noActiveLayersSelected'));
			this.detailsPanelItems.hide(); 
			this.collapse(true);
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
	},
	
	// check whether the panel has been rendered before calling the default expand method
	// update the collapsed property otherwise
	expand: function() {
	  if (this.rendered) {
	    Portal.ui.RightDetailsPanel.superclass.expand.call(this, arguments);
	  } else {
	    this.collapsed = false;
	  }
	}
	
});