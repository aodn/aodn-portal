Ext.namespace('Portal.search');

Portal.search.ControlPanel = Ext.extend(Ext.Panel, {
	
    flex: 1,            
    layout: 'form',
    labelWidth: 85,              
    autoHeight: true,
    padding: '0px 0px 0px 30px',
    
    initComponent: function()
    {
    	this.items =
    		[
    		 	{
    		 		ref: 'filterCombo',
    		 		xtype: 'portal.search.filter.filtercombobox',
    		 		store: this.filterStore
    		 	}
    		];
    	
    	// Only authenticated users can save (or load) searches...
		if (Portal.app.config.currentUser)
		{
			this.items.push({
		 		ref: 'saveSearchPanel',
		 		xtype: 'portal.search.savesearchpanel',
		 		filterStore: this.filterStore,
		   	  	savedSearchStore: this.savedSearchStore
		 	});
		}

		Portal.search.ControlPanel.superclass.initComponent.apply(this, arguments);

		this.relayEvents(this.filterCombo, ['filteradd']);
		
		if (this.saveSearchPanel) {
			this.relayEvents(this.saveSearchPanel, ['savesearch', 'loadsavedsearch', 'deletesavedsearch']);
		}
		
	    this.addEvents('contentchange');
	    this.enableBubble('contentchange');
    },
    
    removeFilter: function(comp)
    {
    	this.filterCombo.removeFilter(comp);
    },
    
    selectSavedSearch: function(savedSearch)
    {
    	this.saveSearchPanel.selectSavedSearch(savedSearch);
    }
});

Ext.reg('portal.search.controlpanel', Portal.search.ControlPanel);
