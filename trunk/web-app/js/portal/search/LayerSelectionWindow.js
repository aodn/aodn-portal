Ext.namespace('Portal.search');

Portal.search.LayerSelectionWindow = Ext.extend(Ext.Window, {
	title: OpenLayers.i18n('datasetLayers'),
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
		        dataIndex: 'title'
		    }],
        listeners: {
          rowclick: {
            fn: this.onAddToMap,
            scope: this
          }
        }
	   	};
	   
	   Portal.search.LayerSelectionWindow.superclass.initComponent.apply(this, arguments); 
	   
       this.addEvents('addlayer');
   },
   
   onAddToMap: function(grid, rowIndex) {
      var layerRec = this.store.getLayerLink(rowIndex);
      this.fireEvent('addlayer', layerRec);
      this.close();
   },
   
   bindStore: function(store) {
	   this.grid.reconfigure(store, this.grid.getColumnModel());
   }
});

Ext.reg('portal.search.layerselectionwindow', Portal.search.LayerSelectionWindow);