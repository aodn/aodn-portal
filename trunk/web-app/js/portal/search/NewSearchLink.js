Ext.namespace('Portal.search');

Portal.search.NewSearchLink = Ext.extend(Ext.ux.Hyperlink, {

  constructor: function(cfg) {
    
    var config = Ext.apply({
      text: OpenLayers.i18n("newSearchText"),
//      tooltip: OpenLayers.i18n("newSearchTip"),   // Not supported
      iconCls: 'p-back-icon'
    }, cfg);

    Portal.search.NewSearchLink.superclass.constructor.call(this, config);
    
    this.on('click', this.onNewClick, this);
  },
  
  onNewClick: function()
  {
    this.searchController.newSearch();
  }
  
});
