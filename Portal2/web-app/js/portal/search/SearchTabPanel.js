Ext.namespace('Portal.search');

Portal.search.SearchTabPanel = Ext.extend(Ext.Panel, {
	layout:'border',
	cls: 'p-search',
	title: 'Search',
	HITS_PER_PAGE: 15,

	initComponent: function() {	 
		this.facetStore = new Portal.search.data.FacetStore();
		this.resultsStore = Portal.data.CatalogResultsStore();
		this.catalogue = new GeoNetwork.Catalogue({hostUrl: Portal.app.config.catalogUrl});
		this.catalogue.metadataStore = this.resultsStore;
		this.catalogue.services.xmlSearch = appConfigStore.getById('spatialsearch.url').data.value;
		this.searchDefaults = {E_protocol: Portal.app.config.metadataLayerProtocols.split('\n').join(' or ')};

		this.items = [
		{
			 region: 'east',
			 collapseMode: 'mini',
			 split: true,
			 width: 400,
			 layout:'border',
			 items: [
			     {
			    	 region: 'north',
			    	 xtype: 'portal.search.minimappanel',
			    	 ref: '../minimap',
			    	 split: true,
			    	 height: 300
			     },
			     {
			    	 region: 'center',
			    	 xtype: 'portal.search.refinesearchpanel',
			    	 facetStore: this.facetStore,
			    	 ref: '../refineSearchPanel'
			     }
		     ]
		},
		{
			region: 'center',
			layout: 'border',
			xtype: 'container',
			items: [
			    {
			    	region: 'north',
					autoHeight: true,
					items: {
						xtype: 'portal.search.searchform',
						ref: '../../searchForm',
						border: false,
						bodyStyle: 'padding:5px 5px 0'
					}
				},
				{
					region: 'center',
					store: this.resultsStore,
					xtype: 'portal.search.resultsgrid',
					ref: '../resultsGrid'
				}
			]
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
		
		// react to results grid events
		this.mon(this.resultsGrid, {
			scope: this,
			showlayer: this.onShowLayer,
			mouseenter: this.onResultEnter,
			mouseleave: this.onResultLeave
		});

	 	// relay add layer event
	 	this.relayEvents(this.resultsGrid, ['addlayer']);
	},
	
	afterRender: function() {
		Portal.search.SearchTabPanel.superclass.afterRender.call(this);
		// Pre-populate refinement panel
		this.runSearch(["summaryOnly=true", "protocol=" + escape(Portal.app.config.metadataLayerProtocols.split('\n').join(' or '))], 1, false);
		// Update paging toolbar manually for the moment 
		this.resultsGrid.getBottomToolbar().onLoad(this.resultsStore, null, {params: {start: 0, limit: 15}});
		// This results in correct layout of the search form
		this.syncSize();
		this.doLayout();
	},
	
	minimapExtentChange: function(bounds) {
		this.searchForm.setExtent(bounds);
	},
	
	onShowLayer: function(layer) {
		this.minimap.showLayer(layer);
	},
	
	onResultEnter: function(grid, rowIndex, rec) {
		this.minimap.showBBox(rec.get('bbox'));
	},
	
	onResultLeave: function(grid, rowIndex, rec) {
		this.minimap.clearBBox();
	},
	
	resultsGridBbarBeforeChange: function(bbar, params) {
		this.runSearch(this.lastSearch, params.start + 1);
		//Stop paging control from doing anything itself for the moment
		// TODO: replace with store driven paging 
		return false;
	},
	
	resultsStoreLoad: function() {
		this.resultsGrid.getBottomToolbar().onLoad(this.resultsStore, null, {params: {start: this.resultsStore.startRecord, limit: 15}});
	},
	
	runSearch: function(filters, startRecord, updateStore) {
		this.resultsGrid.showMask();

		var onSuccess = function(result) {
			var getRecordsFormat = new OpenLayers.Format.GeoNetworkRecords();
			var currentRecords = getRecordsFormat.read(result.responseText);
			var summary = currentRecords.summary;
			this.facetStore.loadData(summary);
			this.resultsGrid.hideMask();
		};
		
		var onFailure = function(response) {
			this.resultsGrid.hideMask();
			Ext.Msg.alert('Error', response.status + ': ' + response.statusText + '<br />' + response.responseText);
		};
		
		if (updateStore !== false) {
			updateStore = true;
		};

		if (updateStore) {
			this.resultsStore.removeAll();
		};
		
		var queryParams = filters.slice(0);

		// Add paging params
		
		var to = startRecord + this.HITS_PER_PAGE - 1;
		
		queryParams.push("from=" + startRecord);
		queryParams.push("to=" + to);
		
		var query = GeoNetwork.util.SearchTools.buildQueryGET(queryParams, startRecord, GeoNetwork.util.SearchTools.sortBy, this.resultsStore.fast);
		
		GeoNetwork.util.SearchTools.doQuery(query, this.catalogue, startRecord, Ext.createDelegate(onSuccess, this), Ext.createDelegate(onFailure,this), updateStore, this.resultsStore, this.facetStore);

		this.resultsStore.startRecord = startRecord - 1;
		this.lastSearch = filters;
	},
	
	onSearch: function () {
		var searchParams = this.getCatalogueSearchParams(this.getSearchFilters());
		this.runSearch(searchParams, 1);
	},
	
	getCatalogueSearchParams: function(searchFilters) {
		var format = function(value) {
			return Ext.isDate(value)?value.format('Y-m-d'):value;
		};
		var searchParams = [];
		for (var i = 0; i < searchFilters.length; i++) {
			searchParams.push(searchFilters[i].name + "=" + escape(format(searchFilters[i].value)));
		}
		return searchParams;
	},
	
	getSearchFilters: function() {
		return this.addSearchFilters(this.refineSearchPanel, this.addSearchFilters(this.searchForm, []));
	},
	
	addSearchFilters: function(delegate, filters) {
		return delegate.addSearchFilters(filters);
	}
	
});

Ext.reg('portal.search.searchtabpanel', Portal.search.SearchTabPanel);

