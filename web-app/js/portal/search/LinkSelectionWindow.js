Ext.namespace('Portal.search');

Portal.search.LinkSelectionWindow = Ext.extend(Ext.Window, {
  title: OpenLayers.i18n('selectLink'),
  width: 400,
  autoHeight: true,
  
  initComponent: function() {
    this.items = {
        ref: 'listView',
        xtype: 'listview',
        store: this.store,
        hideHeaders: true,
        disableSelection: true,
        autoExpandColumn: 'title',
        columns: [{
          id: 'title',
          dataIndex: 'title'
        }],
        listeners: {
          click: {
            fn: this.showLink,
            scope: this
          }
        }
    };

    Portal.search.LinkSelectionWindow.superclass.initComponent.apply(this, arguments); 
  },

  showLink: function(listView, rowIndex) {
    var linkRec = this.store.getAt(rowIndex);

    Portal.common.BrowserWindow.open(linkRec.get('url'));
    
    this.close();
  },

  bindStore: function(store) {
    this.grid.reconfigure(store, this.grid.getColumnModel());
  }

});

Ext.reg('portal.search.linkselectionwindow', Portal.search.LinkSelectionWindow);