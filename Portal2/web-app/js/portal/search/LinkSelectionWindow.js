Ext.namespace('Portal.search');

Portal.search.LinkSelectionWindow = Ext.extend(Ext.Window, {
	width: 400,
	autoHeight: true,
	
   initComponent: function() {
	   this.items = {
			ref: 'listView',
		    xtype: 'listview',
			store: this.store,
			hideHeaders: true,
		    columns: [{
		        width: 1,
		        dataIndex: 'title'
		    }]
	   };
	   
	   Portal.search.LinkSelectionWindow.superclass.initComponent.apply(this, arguments); 
	   
	   this.relayEvents(this.listView, ['click']);
   }
});

Ext.reg('portal.search.linkselectionwindow', Portal.search.LinkSelectionWindow);