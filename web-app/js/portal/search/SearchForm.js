Ext.namespace('Portal.search');

Portal.search.SearchForm = Ext.extend(Ext.FormPanel, {
   url: '',
   defaultType: 'textfield',
   resultsGrid: null,
   padding: '15px 0px 0px 15px',
   layout: 'hbox',
   autoHeight: true,
   buttonAlign: 'left',
   footerStyle: 'padding:5px 0px 10px 10px',
   
   setResultsGridText: function(){
        if(this.resultsGrid != null)
           this.resultsGrid.getBottomToolbar().afterPageText = "of ...?";
      },
   resetResultsGridText: function(){
        if(this.resultsGrid != null)
            this.resultsGrid.getBottomToolbar().afterPageText = "of {0}";
      },

   initComponent: function() {
   
	   	var activeFilterStore = Portal.search.filter.newDefaultActiveFilterStore();
	   	var inactiveFilterStore = Portal.search.filter.newDefaultInactiveFilterStore(this);
	   	
	   	var savedSearchStore = new Ext.data.JsonStore({
        	autoLoad: Portal.app.config.currentUser,
        	autoDestroy: true,
        	remote: true,
        	url: 'search/list',
        	baseParams: {
        		'owner.id': Portal.app.config.currentUser ? Portal.app.config.currentUser.id : null
            },
            fields: ['id','name']
        });
	   	
		this.items = [
		{  
			ref: 'searchFiltersPanel',
			xtype: 'portal.search.filter.filterspanel',
			store: activeFilterStore
		},
		{
			ref: 'searchControlPanel',
			xtype: 'portal.search.controlpanel',
			filterStore: inactiveFilterStore,
			savedSearchStore: savedSearchStore
		},
      ];

      this.buttons = [{
         text: OpenLayers.i18n("searchButton"),
         ref: '../searchButton'
      }];

      Portal.search.SearchForm.superclass.initComponent.apply(this, arguments);
      
      this.addEvents('search','contentchange');
      this.relayEvents(this.searchFiltersPanel, ['bboxchange']);
      
      this.enableBubble('contentchange');

      this.mon(this.searchButton, 'click', this.onSearch, this);
      this.mon(this.searchFiltersPanel, 'contentchange', this.refreshDisplay, this);
      
      this.searchController = new Portal.search.SearchController({
    	  searchControlPanel: this.searchControlPanel,
    	  searchFiltersPanel: this.searchFiltersPanel,
  	   	  activeFilterStore: activeFilterStore,
	   	  inactiveFilterStore: inactiveFilterStore,
	   	  savedSearchStore: savedSearchStore
      });
      
   },
   
   setExtent: function(bounds) {
      this.bounds = bounds;

      var bboxes = this.searchFiltersPanel.findByType('portal.search.field.boundingbox');

      for (var i = 0; i<bboxes.length; i++){
          bboxes[i].setBox(bounds);
      }      
   },

   refreshDisplay: function() {
	   
	  this.doLayout();
	  this.syncSize();
	  // let parent components know that the size of this component may have changed!
	  this.fireEvent('contentchange');
   },
   

   afterRender: function() {
      Portal.search.SearchForm.superclass.afterRender.call(this);

      // Launch search when enter key pressed in form
      new Ext.KeyMap(
         this.el,
         [{
            key: [10, 13],
            fn: this.onSearch,
            scope: this
         }]
      );
   },
   
   onSearch: function() {
      this.fireEvent("search", this);
   },
   
   addSearchFilters: function(searchFilters) {
      var fieldValues = this.getForm().getFieldValues(), protocolFilter=false;
      
      for (var fieldName in fieldValues) {
         var values = fieldValues[fieldName];
         if (Ext.isArray(values)) {
            for (var i = 0; i < values.length; i++) {
               searchFilters.push({name: fieldName, value: values[i]});
            }
         } else {
            searchFilters.push({name: fieldName, value: values});
            if (fieldName=="protocol") protocolFilter=true;
         }
      }
      
      // default is to show layers only
      if (!protocolFilter) searchFilters.push({name: "protocol", value: Portal.app.config.metadataLayerProtocols.split('\n').join(' or ')});
      
      return searchFilters;
   },

   setResultsGrid: function(rGrid){
    this.resultsGrid = rGrid;
   }
   
});
    
Ext.reg('portal.search.searchform', Portal.search.SearchForm);

