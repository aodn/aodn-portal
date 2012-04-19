Ext.namespace('Portal.search');

Portal.search.SearchTabPanel = Ext.extend(Ext.Panel, {
	layout:'border',
	cls: 'p-search',
	title: 'Search',
	HITS_PER_PAGE: 15,

	initComponent: function() {	 
		this.resultsStore = Portal.data.CatalogResultsStore();
		// Callback to run after the resultsStore is loaded
		this.resultsStore.on('load',	function(store, recs, opt) {
			if (this.totalLength == 0) {
				Ext.Msg.alert('Info', 'The search returned no results.');
			}
		}, this.resultsStore);
		this.catalogue = new GeoNetwork.Catalogue({hostUrl: Portal.app.config.catalogUrl});
		this.catalogue.metadataStore = this.resultsStore;
		this.catalogue.services.xmlSearch = appConfigStore.getById('spatialsearch.url').data.value;
		this.searchDefaults = {E_protocol: Portal.app.config.metadataLayerProtocols.split("\n").join(' or ')};

		this.items = [
		{
			 region: 'east',
			 collapseMode: 'mini',
			 split: true,
			 width: 400,
			 maxWidth: 500,
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
						 xtype: 'panel'
					 }
				 ]
		},
		{
			region: 'center',
			layout: 'border',
			xtype: 'container',
			ref: 'searchPanel',
			items: [
					{
					region: 'north',
					ref: '../searchContainer',
					height: 120,
					autoScroll: true,

					items: {
						xtype: 'portal.search.searchform',
						ref: '../../searchForm',
						border: false,
						bodyStyle: 'padding:5px 5px 0',
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

		// react to search requested by search form
		this.mon(this.searchForm, {
			scope: this,
			search: this.onSearch,
			bboxchange: this.onBBoxChange
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

		// set size of search form based on its content when its content is created and/or
		// changed or the region containing the search is resized
		// Ext isn't good at handling panels resizing based on content and scroll bars

		this.mon(this.searchContainer, {
			scope: this,
			resize: this.setSearchContainerHeight
		});

		this.mon(this.searchForm, {
			scope: this,
			contentchange: this.setSearchContainerHeight,
			afterrender: this.setSearchContainerHeight
		});

	 	// relay add layer event
	 	this.relayEvents(this.resultsGrid, ['addlayer']);
	},
	
	afterRender: function() {
		Portal.search.SearchTabPanel.superclass.afterRender.call(this);
		// Update paging toolbar manually for the moment 
		this.resultsGrid.getBottomToolbar().onLoad(this.resultsStore, null, {params: {start: 0, limit: 15}});
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
	
	onBBoxChange: function(bounds) {
	  this.minimap.setExtent(bounds);
	},
	
	setSearchContainerHeight: function() {
		// wait a bit for new sizes to be reflected (there's no consistent
		// resize event on elements across browsers or provided by Ext!)
		this.setSearchContainerHeightDeferred.defer(50, this);
	},

	setSearchContainerHeightDeferred: function() {
		var searchFormHeight = this.searchForm.getHeight();
		var searchFormWidth = this.searchForm.getWidth();
		var searchContainerWidth = this.searchContainer.getWidth();
		var newHeight = searchFormHeight;
		// add space for scroll bar if required
		if (searchContainerWidth < searchFormWidth) {
			newHeight += 20;
		}
		this.searchContainer.setSize(searchContainerWidth, newHeight);
		this.searchPanel.doLayout();
	},

	resultsGridBbarBeforeChange: function(bbar, params) {

        this.runSearch(this.lastSearch, parseInt(params.start) + 1);
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
			this.resultsGrid.hideMask();

			// This makes sure that the paging toolbar updates on a zero result set
			this.resultsStore.fireEvent('load', this.resultsStore, this.resultsStore.data.items, this.resultsStore.lastOptions);
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
		queryParams.push("from=" + startRecord);
		queryParams.push("to=" + (startRecord + this.HITS_PER_PAGE - 1));
		
		var query = GeoNetwork.util.SearchTools.buildQueryGET(queryParams, startRecord, GeoNetwork.util.SearchTools.sortBy, this.resultsStore.fast);
		
		GeoNetwork.util.SearchTools.doQuery(query, this.catalogue, startRecord, Ext.createDelegate(onSuccess, this), Ext.createDelegate(onFailure,this), updateStore, this.resultsStore);

		this.resultsStore.startRecord = startRecord - 1;
		this.lastSearch = filters;
	},
	
	onSearch: function () {
		this.resultsStore.totalLength = 0; // This makes sure that the paging toolbar updates on a zero result set
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
		return this.addSearchFilters(this.searchForm, []);
	},
	
	addSearchFilters: function(delegate, filters) {
		return delegate.addSearchFilters(filters);
	}
	
});

Ext.reg('portal.search.searchtabpanel', Portal.search.SearchTabPanel);
