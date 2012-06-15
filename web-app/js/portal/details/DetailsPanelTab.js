Ext.namespace('Portal.details');

Portal.details.DetailsPanelTab = Ext.extend(Ext.TabPanel, {
    defaults: {
        margin: 10
    },
    id: 'detailsPanelTabs',
    ref: 'detailsPanelTabs',
    border: false,
    activeTab: 0,
    enableTabScroll: true,
    cls: 'floatingDetailsPanelContent',
    flex: 1,

    initComponent: function(){
    	this.infoPanel = new Portal.details.InfoPanel();
        this.stylePanel = new Portal.details.StylePanel();
        this.animationPanel = new Portal.details.AnimationPanel();

        this.items = [
            this.infoPanel,
            this.stylePanel,
            this.animationPanel
        ];
  
        Portal.details.DetailsPanelTab.superclass.initComponent.call(this);
    },

    setSelectedLayer: function(layer){
        this.selectedLayer = layer;
        this.infoPanel.setSelectedLayer(layer);
        this.stylePanel.setSelectedLayer(layer);
        this.animationPanel.setSelectedLayer(layer);
    },
    
    hideInfoTab: function(){
    	if(this.animationPanel.disabled)
    		this.setActiveTab(this.stylePanel.getId());

		this.hideTabStripItem(this.infoPanel);
    },

    update: function(layer){

    	//Update the other tab panels
        this.stylePanel.updateStyles();
        this.animationPanel.update();

    	//Update the info tab panel
    	var metaUrl = null;

    	if(layer.overrideMetadataUrl){
    		metaUrl = layer.overrideMetadataUrl;
    	}
    	else if (layer.metadataUrls && layer.metadataUrls.length > 0 && layer.metadataUrls[0].type == "other") {  //ideally there would be a MCP type in geoserver to compare with - rather than "other"
        	metaUrl = layer.metadataUrls[0].onlineResource.href;
        }

        if(metaUrl) {
        	this.unhideTabStripItem(this.infoPanel);
        	this.infoPanel.updateInfo(metaUrl);
        	this.infoPanel.enable();
        }
        else{
        	this.hideInfoTab();
        }


		//only find another tab if the current active tab is no longer useful
		//e.g. switching from an animated layer to, sayt,
		if(this.getActiveTab().disabled){
        	for(var i = 0; i < this.items.length; i++){
        		if(this.getActiveTab().id != i){
        			if(!this.items.get(i).disabled){
        				this.setActiveTab(i);
        				return;
        			}
        		}
        	}
		}
    }
});