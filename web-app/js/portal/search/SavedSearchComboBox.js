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
		 	    triggerAction: 'all'
		 	};
    	
    	Ext.apply(this, Ext.apply(this.initialConfig, config));
    	Portal.search.SavedSearchComboBox.superclass.initComponent.apply(this, arguments);
	}

});

Ext.reg('portal.search.savedsearchcombobox', Portal.search.SavedSearchComboBox);
