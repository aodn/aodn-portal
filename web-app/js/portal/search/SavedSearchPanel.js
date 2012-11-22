
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.search');

Portal.search.SavedSearchPanel = Ext.extend(Ext.Panel, {
	
	layout: 'hbox',
	padding: 2,
	
	initComponent: function()
	{
		this.items =
			[		 	
		    {
			 		ref: 'savedSearchComboBox',
			 		xtype: 'portal.search.savedsearchcombobox',
			   	  	store: this.searchController.getSavedSearchStore()
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
		
		Portal.search.SavedSearchPanel.superclass.initComponent.apply(this, arguments);
		
		this.relayEvents(this.savedSearchComboBox, ['loadsavedsearch']);
		
		this.deleteButton.disable();
    this.mon(this.searchController, 'searchsaved', this.onSearchSaved, this);
    this.mon(this.savedSearchComboBox, 'select', this.onSavedSearchComboBoxSelect, this);
	},
	
    onSearchSaved: function(searchId)
    {   	
      this.savedSearchComboBox.setValue(searchId);
    	this.deleteButton.enable();
    },

	onDeleteClick: function()
	{
		var selectedVal = this.savedSearchComboBox.getValue();
		var selectedRecord = this.savedSearchComboBox.store.getById(selectedVal);
		
		this.savedSearchComboBox.clearValue();
		
		this.deleteButton.disable();
		
		this.searchController.deleteSavedSearch(selectedRecord);
		
	},
	
	onSavedSearchComboBoxSelect: function(combo, record, index)
	{
	  this.searchController.loadSavedSearch(record.id, record.name);
		this.deleteButton.enable();
	}
});

Ext.reg('portal.search.savedsearchpanel', Portal.search.SavedSearchPanel);
