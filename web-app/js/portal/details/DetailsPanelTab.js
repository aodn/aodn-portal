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
    	this.setActiveTab(this.stylePanel.getId());
    	this.hideTabStripItem(this.infoPanel);
    },

    update: function(layer){

    	//Update the other tab panels
        this.stylePanel.updateStyles();
        this.animationPanel.update();
    	
    	//Update the info tab panel
    	var metaUrl = null;

    	if (layer.metadataUrls && layer.metadataUrls.length > 0 && layer.metadataUrls[0].type == "other") {  //ideally there would be a MCP type in geoserver to compare with - rather than "other"
        	metaUrl = layer.metadataUrls[0].onlineResource.href;
        }


        if(metaUrl || this.selectedLayer.server.type.search("NCWMS") > -1) {
        	this.setActiveTab(this.infoPanel.getId());
        	this.unhideTabStripItem(this.infoPanel);
        	this.infoPanel.updateInfo(metaUrl);
        } else {  //Just hide it if there's nothing to display
        	this.hideInfoTab();
        }
    }

});