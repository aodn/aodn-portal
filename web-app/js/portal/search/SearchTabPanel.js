Ext.namespace('Portal.search');

Portal.search.SearchTabPanel = Ext.extend(Ext.Panel, {
   layout:'border',
   cls: 'p-search',
   //TODO: create config value for map layer search filter?
   searchDefaults: {E_hitsperpage: 15, E_protocol: 'OGC:WMS-1.1.1-http-get-map or OGC:WMS-1.3.0-http-get-map'},
   title: 'Search',

   initComponent: function() {
      //TODO: move to application initialisation
      OpenLayers.ProxyHost = proxyURL;
      
      this.facetStore = new Portal.search.data.FacetStore();
      this.resultsStore = GeoNetwork.data.MetadataResultsStore();
      //TODO: move geonetwork url to application configuration
      this.catalogue =  new GeoNetwork.Catalogue({hostUrl: Portal.app.config.catalogUrl});
      this.catalogue.metadataStore = this.resultsStore;
   
      this.items = [{
	         region: 'east',
	         collapseMode: 'mini',
	         split: true,
	         width: 400,
	         layout:'border',
	         items: [{
	               region: 'north',
	               xtype: 'portal.search.minimappanel',
	               ref: '../minimap',
      				split: true,
      				height: 300
      		   }, {
      		      region: 'center',
      		      xtype: 'portal.search.refinesearchpanel',
      		      facetStore: this.facetStore,
      		      ref: '../refineSearchPanel'
      		   }]
         }, {
	         region: 'center',
	         layout: 'border',
	         xtype: 'container',
	         items: [{
		            region: 'north',
		            autoHeight: true,
		            items: {
				         xtype: 'portal.search.searchform',
				         ref: '../../searchForm',
				         border: false,
                     bodyStyle: 'padding:5px 5px 0'
				       }
               }, {
		            region: 'center',
		            store: this.resultsStore,
		            xtype: 'portal.search.resultsgrid',
		            ref: '../resultsGrid'
	            }]
         }];

      Portal.search.SearchTabPanel.superclass.initComponent.call(this);

      // react to changes on Refine Search Panel   
      this.mon(this.refineSearchPanel, {
         scope: this,
         filterchange: this.onSearch
      });
      
      // react to search requested by search form
      this.mon(this.searchForm, {
         scope: this,
         search: this.onSearch
      });
      
      // react to changes in map extent
      this.mon(this.minimap, {
         scope: this,
         extentchange: this.minimapExtentChange
      });
      
      // react to results panel events
      this.mon(this.resultsGrid.getBottomToolbar(), {
         scope: this,
         beforechange: this.resultsGridBbarBeforeChange
      });
      
      // react to store events
      this.mon(this.resultsStore, {
         scope: this,
         load: this.resultsStoreLoad
      });
      
   },
   
   afterRender: function() {
      Portal.search.SearchTabPanel.superclass.afterRender.call(this);

      // Pre-populate refinement panel
      this.runSearch({E_hitsperpage: 1, E_protocol: 'OGC:WMS-1.1.1-http-get-map or OGC:WMS-1.3.0-http-get-map'}, 1, false);
      // Update paging toolbar manually for the moment 
      this.resultsGrid.getBottomToolbar().onLoad(this.resultsStore, null, {params: {start: 0, limit: 15}});
   },
   
   minimapExtentChange: function(bounds) {
      this.searchForm.setExtent(bounds);
   },
   
   resultsGridBbarBeforeChange: function(bbar, params) {
      this.runSearch(Ext.apply(this.lastSearch, {E_hitsperpage: params.limit}), params.start);
      //Stop paging control from doing anything itself for the moment
      // TODO: replace with store driven paging 
      return false;
   },
   
   resultsStoreLoad: function() {
      this.resultsGrid.getBottomToolbar().onLoad(this.resultsStore, null, {params: {start: this.resultsStore.startRecord, limit: 15}});
   },
   
   runSearch: function(parameters, startrecord, updateStore) {
      var onSuccess = function(result) {
         var getRecordsFormat = new OpenLayers.Format.GeoNetworkRecords();
         var currentRecords = getRecordsFormat.read(result.responseText);
         var summary = currentRecords.summary;
         this.facetStore.loadData(summary);
      };
      
      var onFailure = function(response) {
         Ext.Msg.alert('Error: ' + response.status + '-' + response.statusText);
      };
      
      this.catalogue.search(parameters, Ext.createDelegate(onSuccess, this), onFailure, startrecord, updateStore, this.resultsStore, this.facetStore);

      this.resultsStore.startRecord = startrecord - 1;
      
      this.lastSearch = parameters;
   },
   
   onSearch: function () {
      var searchFilters = this.searchForm.addSearchFilters([]);
      searchFilters = this.refineSearchPanel.addSearchFilters(searchFilters);
      var searchParams = this.getCatalogueSearchParams(searchFilters);
      searchParams = Ext.apply(searchParams, {E_hitsperpage: this.resultsGrid.bbar.pageSize});
      searchParams = Ext.applyIf(searchParams, this.searchDefaults);
      this.runSearch(searchParams, 1);
   },
   
   getCatalogueSearchParams: function(searchFilters) {
      var format = function(value) {
         return Ext.isDate(value)?value.format('Y-m-d'):value;
      };
      var searchParams = {};
      for (var i = 0; i < searchFilters.length; i++) {
         var value = format(searchFilters[i].value);
         if (searchParams['E_'+searchFilters[i].name]) {
            searchParams['E_'+searchFilters[i].name] += ' or ' + value;
         } else {
            searchParams['E_'+searchFilters[i].name] = value;
         };
      }
      return searchParams;
   }
   
});

Ext.reg('portal.search.searchtabpanel', Portal.search.SearchTabPanel);

