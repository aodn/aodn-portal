Ext.namespace('Portal.search.filter');

Portal.search.filter.FilterComboBox = Ext.extend(Ext.form.ComboBox, {
	
	initComponent: function()
	{
    	var config = 
		 	{
		        fieldLabel : OpenLayers.i18n("addCriteria"),
				submitValue : false,
				xtype : 'combo',
				width : 189,
				mode : 'local',
				editable : false,
				cls : 'p-selector',
				filters : [],
				valueField : 'xtype',
				displayField : 'displayText',
				listeners : {
					scope : this,
					'select' : this.filterComboSelect
				}
		 	};
    	
    	Ext.apply(this, Ext.apply(this.initialConfig, config));
		Portal.search.filter.FilterComboBox.superclass.initComponent.apply(this, arguments);
	      
		this.addEvents('filteradd');
	},
	
    filterComboSelect: function(combo, record) 
    {
    	this.fireEvent('filteradd', record);
        	
    	// Remove record from this.store
    	this.store.remove(record);
        
        combo.clearValue();
    }
});

Ext.reg('portal.search.filter.filtercombobox', Portal.search.filter.FilterComboBox);
