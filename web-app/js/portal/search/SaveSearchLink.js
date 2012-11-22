
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.search');

Portal.search.SaveSearchLink = Ext.extend(Ext.ux.Hyperlink, {

  constructor: function(cfg) {
    
    var config = Ext.apply({
      text: OpenLayers.i18n("saveSearchButtonText"),
//      tooltip: OpenLayers.i18n("saveSearchButtonTip"),   // Not supported
      iconCls: 'p-save-icon'
    }, cfg);

    Portal.search.SaveSearchLink.superclass.constructor.call(this, config);
    
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
