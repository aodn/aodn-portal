
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.search');

Portal.search.RightSearchTabPanel = Ext.extend(Ext.TabPanel, {
  
  constructor: function(cfg) {
    var loggedOut = !Portal.app.config.currentUser;
    
    this.savedSearchPanel = new Portal.search.SavedSearchPanel({
      searchController: cfg.searchController,
      hidden: loggedOut
    });
    
    this.registerToSaveMessage = new Ext.form.Label({
      text: OpenLayers.i18n('registerToSave'),
      cls: 'emptyactivelayertreepaneltext',
      hidden: !loggedOut
    });
    
    this.savedSearchTab = new Ext.Container({
      title: OpenLayers.i18n('mySearches'),
      items: [this.savedSearchPanel, this.registerToSaveMessage]
    });
    
    var config = Ext.apply({
        activeTab: 0,
        padding: 5,
        items: [this.savedSearchTab]
      }, cfg);
    
    Portal.search.RightSearchTabPanel.superclass.constructor.call(this, config);
  }
  
});
  
