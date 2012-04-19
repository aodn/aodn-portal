Ext.namespace('Portal.search');

Portal.search.SearchController = Ext.extend(Ext.Component, {
	
	initComponent: function()
	{
		Portal.search.SearchController.superclass.initComponent.apply(this, arguments);
		
		this.mon(this.searchControlPanel, 'loadsavedsearch', this.onLoadSavedSearch, this);
		this.mon(this.searchControlPanel, 'deletesavedsearch', this.onDeleteSavedSearch, this);
		this.mon(this.searchControlPanel, 'filteradd', this.onFilterAdd, this);
	    this.mon(this.searchControlPanel, 'savesearch', this.onSaveSearch, this);
	    
		this.mon(this.searchFiltersPanel, 'filterremove', this.onFilterRemove, this);
	},

	onFilterAdd: function(record)
	{
		this.activeFilterStore.add(record);
	},
	
	onFilterRemove: function(record)
	{
		this.inactiveFilterStore.add(record);
		this.inactiveFilterStore.sort('sortOrder');
	},
	
	onLoadSavedSearch: function(id, name)
	{
		// Load the saved search (in full).
		Ext.Ajax.request({
			url: 'search/show',
			params: { id: id },
			success: this.onSuccessfulShow,
			failure: this.onFailedShow,
			scope: this
		});
	},
	
	onDeleteSavedSearch: function(record)
	{
		Ext.Ajax.request({
			url: 'search/delete',
			params: { id: record.get('id') },
			success: this.onSuccessfulDelete,
			failure: this.onFailedDelete,
			scope: this
		});
	},
	
	onSaveSearch: function(savedSearchName) 
	{
		var filtersArray = [];
		
		Ext.each(this.activeFilterStore.data.items, function(record, index, array) {
			   
			filtersArray.push(record.get('asJson')());
		});
		
		var jsonArray = 
		{
			name: savedSearchName,
			owner: { id: Portal.app.config.currentUser.id },
			filters: filtersArray
		};
		
		Ext.Ajax.request({
			url: 'search/save',
		    jsonData: Ext.encode(jsonArray),
			success: this.onSuccessfulSave,
			failure: this.onFailedSave,
			scope: this
		});
	},
	
	onSuccessfulSave: function(response, options)
	{
		console.log(response);
		var savedSearch = Ext.decode(response.responseText);
		this.searchControlPanel.selectSavedSearch(savedSearch);
	},
	
	onFailedSave: function(response, options)
	{
		console.log(response);
	},
	
	onSuccessfulShow: function(response, options)
	{
		var savedSearch = Ext.decode(response.responseText);

		// Make every filter inactive.
		this.activeFilterStore.each(function(record) {
			this.inactiveFilterStore.add(record);
		}, this);
		this.activeFilterStore.removeAll();
		
		Ext.each(savedSearch.filters, function(filter) {
			
			var recordIndex = this.inactiveFilterStore.find('type', filter.type);
			
			if (recordIndex == -1)
			{
				// error
				// TODO
				return
			}
			
			var record = this.inactiveFilterStore.getAt(recordIndex);

			// Update value.
			record.filterValue = filter.value;
			
			// Move to active store...
			this.inactiveFilterStore.remove(record);
			this.activeFilterStore.add(record);
			
		}, this);
	},
	
	onFailedShow: function(response, options)
	{
		console.log(response);
	},
	
	onSuccessfulDelete: function(response, options)
	{
		this.savedSearchStore.reload();
	},
	
	onFailedDelete: function(response, options)
	{
		// TODO
	}
	
});