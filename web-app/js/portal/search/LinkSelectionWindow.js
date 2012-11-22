
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.search');

Portal.search.LinkSelectionWindow = Ext.extend(Ext.Window, {
  title: OpenLayers.i18n('selectLink'),
  width: 400,
  autoHeight: true,
  
  initComponent: function() {
    this.items = {
        ref: 'grid',
        xtype: 'grid',
        store: this.store,
        hideHeaders: true,
        disableSelection: true,
        autoExpandColumn: 'title',
        columns: [{
          id: 'title',
          dataIndex: 'title',
          renderer: this.linkDescRenderer
        }],
        listeners: {
          rowclick: {
            fn: this.showLink,
            scope: this
          }
        }
    };

    Portal.search.LinkSelectionWindow.superclass.initComponent.apply(this, arguments);
    
  },
  
  linkDescRenderer: function(val, x, rec){
    return val.trim()!=''?val:rec.get('name');
  },

  showLink: function(grid, rowIndex) {
    var linkRec = this.store.getAt(rowIndex);

    Portal.common.BrowserWindow.open(linkRec.get('url'));
    
    this.close();
  },

  bindStore: function(store) {
    this.grid.reconfigure(store, this.grid.getColumnModel());
  }

});

Ext.reg('portal.search.linkselectionwindow', Portal.search.LinkSelectionWindow);
