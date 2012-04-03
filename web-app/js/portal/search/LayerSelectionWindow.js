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
		    },{
		    	xtype: 'actioncolumn',
		    	width: 70,
		    	items: [{
	                iconCls: 'p-result-map-go',
	                tooltip: OpenLayers.i18n('layerSelectionWindowShowOnMinimap'),
	                width: 35,
	                height: 35,
	                handler: this.onShowOnMinimap,
	                scope: this
	             },{
	                 iconCls: 'p-result-map-add',
	                 tooltip: OpenLayers.i18n('layerSelectionWindowAddToMap'),
	                 width: 35,
	                 height: 35,
	                 handler: this.onAddToMap,
	                 scope: this
	              }]
		    }]
	   	};
	   
	   Portal.search.LayerSelectionWindow.superclass.initComponent.apply(this, arguments); 
	   
       this.addEvents('showlayer', 'addlayer');
   },
   
   onShowOnMinimap: function(grid, rowIndex, colIndex) {
      var layerRec = this.store.getLayerLink(rowIndex);
      this.fireEvent('showlayer', layerRec);
      this.close();
   },
   
   onAddToMap: function(grid, rowIndex, colIndex) {
      var layerRec = this.store.getLayerLink(rowIndex);
      this.fireEvent('addlayer', layerRec);
      this.close();
   },
   
   bindStore: function(store) {
	   this.grid.reconfigure(store, this.grid.getColumnModel());
   }
});

Ext.reg('portal.search.layerselectionwindow', Portal.search.LayerSelectionWindow);