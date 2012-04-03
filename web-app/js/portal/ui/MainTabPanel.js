Ext.namespace('Portal.ui');

Portal.ui.MainTabPanel = Ext.extend(Ext.TabPanel, {
  
  constructor: function(cfg) {
    this.searchTabPanel = new Portal.search.SearchTabPanel({});
    this.portalPanel = new Portal.ui.PortalPanel({appConfig: Portal.app.config});
    this.homePanel = new Portal.ui.HomePanel({appConfig: Portal.app.config});
    
    var config = Ext.apply({
        xtype: 'tabpanel', // TabPanel itself has no title        
        autoDestroy: false, // wont destroy tab contents when switching        
        activeTab: 0,
        unstyled: true,
        // method to hide the usual tab panel header with css
        headerCfg: {
            cls: 'mainTabPanelHeader'  // Default class not applied if Custom element specified
        },
        items: [
            this.homePanel,
            this.portalPanel,
            this.searchTabPanel
        ]
    }, cfg);
    
    Portal.ui.MainTabPanel.superclass.constructor.call(this, config);

    this.mon(this.searchTabPanel, 'addLayer', this.onSearchTabPanelAddLayer, this);
  },
  
  getMapPanel: function() {
    return this.portalPanel.getMapPanel();
  },
  
  isMapVisible: function() {
    return this.isMapSelected();
  },
  
  isMapSelected: function() {
    return this.getActiveTab() === this.portalPanel;
  },
  
  onSearchTabPanelAddLayer: function(layerDef) {
    this.getMapPanel().addMapLayer(layerDef);
    this.displayLayerAddedMessage(layerDef.title);
  },
  
  displayLayerAddedMessage: function(layerDescription) {
      Ext.Msg.alert(OpenLayers.i18n('layerAddedTitle'), OpenLayers.i18n('layerAddedMsg', {layerDesc: layerDescription}));
  }
  
});
