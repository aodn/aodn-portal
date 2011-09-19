Ext.namespace('Portal.search');

Portal.search.SearchTabPanel = Ext.extend(Ext.Panel, {
   layout:'border',
   searchDefaults: {E_hitsperpage: 10},
   title: 'Search',

   initComponent: function() {
      //TODO: move to application initialisation
      OpenLayers.ProxyHost = proxyURL;
      
      this.facetStore = new Portal.data.FacetStore();
      this.resultsStore = GeoNetwork.data.MetadataResultsStore();
      //TODO: move geonetwork url to application configuration
      this.catalogue =  new GeoNetwork.Catalogue({hostUrl: 'http://asdddev.emii.org.au/geonetwork'});
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
		            layout: 'fit',
		            html: 'results',
//                  xtype: 'gn_metadataresultsview',
//                  catalogue: this.catalogue,
//                  tpl: GeoNetwork.Templates.SIMPLE,
		            ref: '../resultsView'
	            }]
         }];

      Portal.search.SearchTabPanel.superclass.initComponent.call(this);

      // react to changes on Refine Search Panel   
      this.mon(this.refineSearchPanel, {
         scope: this,
         filterchange: this.refineSearchPanelFilterChange
      });
      
      // react to search requested by search form
      this.mon(this.searchForm, {
         scope: this,
         search: this.searchFormSearch
      });
      
      // react to changes in map extent
      this.mon(this.minimap, {
         scope: this,
         extentchange: this.minimapExtentChange
      });
      
   },
   
   afterRender: function() {
      Portal.search.SearchTabPanel.superclass.afterRender.call(this);

      // Pre-populate refinement panel
      this.runSearch({E_hitsperpage: 1}, false);
   },
   
   minimapExtentChange: function(bounds) {
      this.searchForm.setExtent(bounds);
   },
   
   runSearch: function(parameters, updateStore) {
      var onSuccess = function(result) {
         var getRecordsFormat = new OpenLayers.Format.GeoNetworkRecords();
         var currentRecords = getRecordsFormat.read(result.responseText);
         var summary = currentRecords.summary;
         this.facetStore.loadData(summary);
      };
      
      var onFailure = function(response) {
         Ext.Msg.alert('Error: ' + response.status + '-' + response.statusText);
      };
      
      this.catalogue.search(parameters, Ext.createDelegate(onSuccess, this), onFailure, null, updateStore, this.resultsStore, this.facetStore);
   },
   
   refineSearchPanelFilterChange: function (filterParams) {
      // Re-run search with modified selections
      this.runSearch(Ext.apply(filterParams, this.searchDefaults), true);      
   },
   
   searchFormSearch: function () {
      var searchFilters = this.searchForm.addSearchFilters([]);
      searchFilters = this.refineSearchPanel.addSearchFilters(searchFilters);
      var searchParams = this.getCatalogueSearchParams(searchFilters);
      this.runSearch(Ext.apply(searchParams, this.searchDefaults));
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

