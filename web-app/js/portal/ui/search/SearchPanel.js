/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.ui.search');

Portal.ui.search.SearchPanel = Ext.extend(Ext.Panel, {

    constructor:function (cfg) {

        var defaults = {};

        Ext.apply(this, cfg || {}, defaults);

        this.searcher = new Portal.service.CatalogSearcher({
            proxyUrl:this.proxyUrl,
            catalogUrl:this.catalogUrl,
            spatialSearchUrl: this.spatialSearchUrl,
            defaultParams:{
                protocol:cfg.protocols
            }
        });

        var itemsToDisplay = [];

        var disclaimerMessage = OpenLayers.i18n('facetedSearchDisclaimer');

        if (disclaimerMessage != 'facetedSearchDisclaimer') { // Apparently if the i18n entry is the empty string then the key name is returned instead of '', so we need to test for the key to see if the message has been set
            this.disclaimerPanel = new Ext.Panel(
                {
                    region:'north',
                    cls:'faceted-search-disclaimer',
                    html:'<img src="images/information-icon.png" alt="infomation" style="position: absolute; top 4px; left: 3px;"><div style="margin-left: 18px;">' + disclaimerMessage + '</div>'
                }
            );
            itemsToDisplay.push(this.disclaimerPanel);
        }

        this.filtersPanel = new Portal.ui.search.SearchFiltersPanel({
            searcher: this.searcher,
            region: 'west',
            split: true,
            width: 340,
            bodyCssClass: 'p-header-space'
        });
        itemsToDisplay.push(this.filtersPanel);

        this.resultsStore = new Portal.data.GeoNetworkRecordStore();
        this.resultsStore.on('load', function (store, recs, opt) {
            if (this.totalLength == 0) {
                Ext.Msg.alert('Info', 'The search returned no results.');
            }
        }, this.resultsStore);

        this.resultsGrid = new Portal.search.FacetedSearchResultsGrid({
            title: "Search Results",
            region: 'center',
            split: true,
            store: this.resultsStore,
            onSearchComplete: function (response, page) {
                this.store.loadData(response);
            },
            pageSize: this.resultGridSize,
            headerCfg: {
                cls: 'x-panel-header p-header-space'
            }
        });
        itemsToDisplay.push(this.resultsGrid);

        var config = Ext.apply({
            layout:'border',
            split:false,
            items:itemsToDisplay
        }, cfg, defaults);

        Portal.ui.search.SearchPanel.superclass.constructor.call(this, config);
    },

    initComponent:function () {
        Portal.ui.search.SearchPanel.superclass.initComponent.apply(this);

        // monitor possible content size changes
        this.on('contentchange', this._checkSize, this);

        this.on('afterrender', function () {
            this.getEl().on('click', this._checkSize, this);
        }, this);

        this.mon(this.searcher, 'searchcomplete', this._checkSize, this);
        this.searcher.on('searchcomplete', this.resultsGrid.onSearchComplete, this.resultsGrid);
        this.searcher.on('summaryOnlySearchComplete', this.resultsGrid.onSearchComplete, this.resultsGrid);

        this.relayEvents(this.resultsGrid, ['adddownload', 'addlayer']);

        // react to results panel events
        this.mon(this.resultsGrid.getBottomToolbar(), 'beforechange', this.resultsGridBbarBeforeChange, this);

        // react to store events
        this.mon(this.resultsStore, {
            scope:this,
            load:this.resultsStoreLoad
        });
    },

    resultsStoreLoad:function () {
        this.resultsGrid.getBottomToolbar().onLoad(this.resultsStore, null, {params:{start:this.resultsStore.startRecord, limit:this.resultGridSize}});
    },

    onSearch:function (e) {
        this.searcher.removeFilters("any");
        this.searcher.addFilter("any", e);
        this.searcher.search();
    },

    afterRender:function () {
        Portal.ui.search.SearchPanel.superclass.afterRender.apply(this);

        this.filtersPanel.themeFilter.on('collapse', this.doResize, this);
        this.filtersPanel.themeFilter.on('expand', this.doResize, this);

        this.resultsGrid.getBottomToolbar().onLoad(this.resultsStore, null, {params:{start:1, limit:this.resultGridSize}});
    },

    doResize:function () {

        this.ownerCt.syncSize();
        this.ownerCt.doLayout(false, true);
    },

    _checkSize:function () {
        // force container/children width to be recalculated to take into account
        // any vertical scroll that may have been added to prevent a
        // horizontal scrollbar being added as well
//		this.syncSize.defer(100, this);
    },

    resultsGridBbarBeforeChange:function (bbar, params) {

        this.resultsGrid.showMask();
        this.searcher.goToPage(params.start + 1, params.limit);
        this.resultsStore.startRecord = params.start;
        this.resultsGrid.hideMask();
        //Stop paging control from doing anything itself for the moment
        // TODO: replace with store driven paging
        return false;
    }
});
