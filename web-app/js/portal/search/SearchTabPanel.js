Ext.namespace('Portal.search');

Portal.search.SearchTabPanel = Ext.extend(Ext.Panel, {
	layout:'border',
	cls: 'p-search',
	title: 'Search',
	HITS_PER_PAGE: 15,

	initComponent: function() {
	  
	  var appConfig = Portal.app.config;
	  
		this.resultsStore = Portal.data.CatalogResultsStore();
		// Callback to run after the resultsStore is loaded
		this.resultsStore.on('load',	function(store, recs, opt) {
			if (this.totalLength == 0) {
				Ext.Msg.alert('Info', 'The search returned no results.');
			}
		}, this.resultsStore);
		this.catalogue = new GeoNetwork.Catalogue({hostUrl: appConfig.catalogUrl});
		this.catalogue.metadataStore = this.resultsStore;
		this.catalogue.services.xmlSearch = appConfigStore.getById('spatialsearch.url').data.value;
		this.searchDefaults = {E_protocol: appConfig.metadataLayerProtocols.split("\n").join(' or ')};
		
    this.searchController = new Portal.search.SearchController();
		
		this.rightSearchPanel = new Portal.search.RightSearchTabPanel({
		  region: 'center',
		  searchController: this.searchController
		});
		
   this.searchForm = new Portal.search.SearchForm({            
      searchController: this.searchController,
      cls: 'p-centre-item',
      boxMaxWidth: 450,
      boxMinWidth: 280,
      border: false,
      bodyStyle: 'padding:5px 5px 0'
    });
   

   this.items = [
		{
			 region: 'east',
			 collapseMode: 'mini',
			 split: true,
			 width: 360,
			 minWidth: 320,
			 layout:'border',
			 items: [
					 {
						 region: 'north',
						 xtype: 'portal.search.minimappanel',
						 cls: 'map',
						 ref: '../minimap',
						 initialBbox: appConfig.initialBbox,
						 mainMap: this.mapPanel,
						 split: true,
						 height: 300
					 },
					 this.rightSearchPanel
				 ]
		},
		{
			region: 'center',
			layout: 'card',
			xtype: 'container',
			ref: 'searchPanel',
			activeItem: 0,
     items: [{
        xtype: 'container',
        layout: 'anchor',
         items: [{
           xtype: 'spacer',
           cls: 'x-panel-body p-header-space',
           anchor: '100% 7%'
         },{
           ref: '../../searchContainer',
           layout: 'fit',
           cls: 'p-centre',
            anchor: '100% 90%',
           items: [this.searchForm]
        }]
     },{
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
		
		this.mon(this.searchController, 'newsearch', this.handleNewSearch, this);

	 	// relay add layer event
	 	this.relayEvents(this.resultsGrid, ['addlayer']);
	},
	
	afterRender: function() {
		Portal.search.SearchTabPanel.superclass.afterRender.call(this);
		// Update paging toolbar manually for the moment 
		this.resultsGrid.getBottomToolbar().onLoad(this.resultsStore, null, {params: {start: 0, limit: 15}});
	},
	
	minimapExtentChange: function(bounds) {
	  // Don't change the search extent when the minimap extent change was generated
	  // by the user changing the search extent in the first place
	  if (!this._changingBounds) {
	    this.searchForm.setExtent(bounds);
	  }
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
	  this._changingBounds = true;
	  this.minimap.setBounds(bounds);
	  delete this._changingBounds;
	},
	
	setSearchContainerHeight: function() {
		// wait a bit for new sizes to be reflected (there's no consistent
		// resize event on elements across browsers or provided by Ext!)
		this.setSearchContainerHeightDeferred.defer(50, this);
	},

	setSearchContainerHeightDeferred: function() {
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

		var onSuccess = function(result, query) {
			if(this.currentQuery == query){

				this.resultsGrid.hideMask();
				// This makes sure that the paging toolbar updates on a zero result set
				this.resultsStore.fireEvent('load', this.resultsStore, this.resultsStore.data.items, this.resultsStore.lastOptions);
			}
			else{
				//ignoring because it has been overwritten by another query
			}
		};

		var onFailure = function(response) {
			this.resultsGrid.hideMask();
			Ext.Msg.alert( 'Error', response.status + ': ' + response.statusText );
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

		this.currentQuery = query;

		GeoNetwork.util.SearchTools.doQuery(query, this.catalogue, startRecord, Ext.createDelegate(onSuccess, this), Ext.createDelegate(onFailure,this), updateStore, this.resultsStore);

		this.resultsStore.startRecord = startRecord - 1;
		this.lastSearch = filters;
	},

	onSearch: function () {
	  this.changeLayout();
		this.resultsStore.totalLength = 0; // This makes sure that the paging toolbar updates on a zero result set
		var searchParams = this.getCatalogueSearchParams(this.getSearchFilters());
		this.runSearch(searchParams, 1);
	},
	
	handleNewSearch: function() {
    var searchForm = this.searchForm;
    this.rightSearchPanel.remove(searchForm, false);
    this.rightSearchPanel.setActiveTab(0);
    this.searchPanel.getLayout().setActiveItem(0);
    this.searchContainer.add(searchForm);
    searchForm.setTitle('');
    searchForm.setActionSide('left');
    this.doLayout();
	},
	
	getCatalogueSearchParams: function(searchFilters) {
		var format = function(value) {
			value = Ext.isDate(value)?value.format('Y-m-d'):value;
			value = value.substring?value.replace("&","%26"):value;
			return value;
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
	},
	
	// Move search form to refine search tab and display results grid instead
	
	changeLayout: function() {
	  var searchForm = this.searchForm;
    this.searchContainer.remove(searchForm, false);
    searchForm.setTitle(OpenLayers.i18n('refineSearch'));
    searchForm.setActionSide('left');
    this.rightSearchPanel.add(searchForm);
    this.rightSearchPanel.setActiveTab(1);
    this.searchPanel.getLayout().setActiveItem(1);
    this.doLayout();
	}
	
});

Ext.reg('portal.search.searchtabpanel', Portal.search.SearchTabPanel);
