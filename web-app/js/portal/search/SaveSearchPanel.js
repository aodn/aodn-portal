Ext.namespace('Portal.search');

Portal.search.SaveSearchPanel = Ext.extend(Ext.Panel, {
	
	layout: 'hbox',
	padding: 2,
	
	initComponent: function()
	{
		this.items =
			[
			 	{
			 		ref: 'saveButton',
			 		xtype: 'button',
			 		text: OpenLayers.i18n("saveSearchButtonText"),
			 		tooltip: OpenLayers.i18n("saveSearchButtonTip"),
	                listeners:
	                {
	                	scope: this,
	                    'click': this.onSaveClick
	                }
			 	},
		        new Ext.Spacer({width: 7}),
		        {
			 		ref: 'savedSearchComboBox',
			 		xtype: 'portal.search.savedsearchcombobox',
			   	  	store: this.savedSearchStore
		        },
		        new Ext.Spacer({width: 7}),
			 	{
			 		ref: 'deleteButton',
			 		xtype: 'button',
			 		text: OpenLayers.i18n("deleteSavedSearchButtonText"),
			 		tooltip: OpenLayers.i18n("deleteSavedSearchButtonTip"),
			 		listeners:
			 		{
			 			scope: this,
			 			'click': this.onDeleteClick
			 		}
			 	}
			];
		
		Portal.search.SaveSearchPanel.superclass.initComponent.apply(this, arguments);
		
		this.addEvents('deletesavedsearch');
		this.relayEvents(this.savedSearchComboBox, ['loadsavedsearch']);
		
		this.deleteButton.disable();
		this.mon(this.savedSearchComboBox, 'select', this.onSavedSearchComboBoxSelect, this);
	},
	
    selectSavedSearch: function(savedSearch)
    {
    	// Can't simply call "setValue()" on the combo box, as the new value won't be in the
    	// combo box's store yet.
    	var store = this.savedSearchComboBox.getStore();
    	store.load({
    		// The new "saved search" should now be in the store.
    		callback: function(records, options, success) {
    			if (success) {
    				this.savedSearchComboBox.setValue(savedSearch.id);
    			}
    		},
    		scope: this
    	});
    	
    	this.deleteButton.enable();
    },

	onSaveClick: function()
	{
	    var saveSearchDialog = new Portal.search.SaveSearchDialog({
	    	filterStore: this.filterStore
	      });
	      
		this.relayEvents(saveSearchDialog, ['savesearch']);
	    saveSearchDialog.show();
	},

	onDeleteClick: function()
	{
		var selectedVal = this.savedSearchComboBox.getValue();
		var selectedRecord = this.savedSearchComboBox.store.getById(selectedVal);
		
		this.savedSearchComboBox.clearValue();
		
		this.deleteButton.disable();
		
		this.fireEvent('deletesavedsearch', selectedRecord);
		
	},
	
	onSavedSearchComboBoxSelect: function(combo, record, index)
	{
		this.deleteButton.enable();
	}
});

Ext.reg('portal.search.savesearchpanel', Portal.search.SaveSearchPanel);