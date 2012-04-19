Ext.namespace('Portal.search');

Portal.search.SavedSearchComboBox = Ext.extend(Ext.form.ComboBox, {
	
	initComponent: function()
	{
    	var config = 
	 		{
				editable: false,
		 		emptyText: OpenLayers.i18n('chooseSavedSearch'),
		 		valueField: 'id',
		 	    displayField: 'name',
		 	    triggerAction: 'all',
		 	    listeners: {
		        	scope: this,
		            'select': this.onSelectSavedSearch
		        }
		 	};
    	
    	Ext.apply(this, Ext.apply(this.initialConfig, config));
    	Portal.search.SavedSearchComboBox.superclass.initComponent.apply(this, arguments);
    	
    	this.addEvents('loadsavedsearch');
	},

	onSelectSavedSearch: function(combo, record, index) 
    {
		this.fireEvent('loadsavedsearch', record.id, record.name);
    }
});

Ext.reg('portal.search.savedsearchcombobox', Portal.search.SavedSearchComboBox);
