Ext.namespace('Portal.search');

Portal.search.SaveSearchLink = Ext.extend(Ext.ux.Hyperlink, {

  constructor: function(cfg) {
    
    var config = Ext.apply({
      text: OpenLayers.i18n("saveSearchButtonText"),
      tooltip: OpenLayers.i18n("saveSearchButtonTip"),
      iconCls: 'p-save-icon',
      listeners:
      {
        scope: this,
        'click': this.onSaveClick
      }
    }, cfg);

    Portal.search.FilterSelector.superclass.constructor.call(this, config);
    
    this.on('click', this.onSaveClick, this);
  },
  
  onSaveClick: function()
  {
    var saveSearchDialog = new Portal.search.SaveSearchDialog({
      searchController: this.searchController
    });
        
    saveSearchDialog.show();
  }
  
});
