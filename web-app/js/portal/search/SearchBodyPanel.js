Ext.namespace('Portal.search');

// TODO: note that this panel is probably redundant now that it has only one child - we can just use
// FacetedSearchResultsGrid where this panel is used - however, waiting for Phil's latest changes
// to be merged before getting rid of this (else there will be conflicts).
Portal.search.SearchBodyPanel = Ext.extend(Ext.Panel, {

    constructor: function (cfg) {

        this.resultsStore = cfg.resultsStore;
        this.searcher = cfg.searcher;

        this.searchResultsPanel = new Portal.search.FacetedSearchResultsPanel({
            searchResultsPanel: this,
            searcher: this.searcher,
            store: this.resultsStore,
            dataCollectionStore: cfg.dataCollectionStore,
            classificationStore: cfg.classificationStore
        });

        var config = Ext.apply({
            autoScroll: true,
            bodyCssClass: "faceted-search-results",
            activeItem: this.searchResultsPanel,
            items: [this.searchResultsPanel]
        }, cfg);

        Portal.search.SearchBodyPanel.superclass.constructor.call(this, config);

        this.resultsStore.on('load', function() {
            this._onResultsStoreLoad();
        }, this);

        this.searchResultsPanel.pagingBar.on('beforechange', this._onResultsGridBbarBeforeChange, this);
    },

    _onResultsStoreLoad: function() {
        if (this.resultsStore.getTotalCount() == 0) {
            this._displayNoResultsAlert();
        }

        // We want to reset scroll position to top on load, in case we were
        // previously not at the top.
        // Ref: https://github.com/aodn/aodn-portal/issues/464
        // Ref: https://github.com/aodn/aodn-portal/issues/1834
        this._resetScrollPositionToTop();
    },

    _resetScrollPositionToTop: function() {
        this.body.dom.scrollTop = 0;
    },

    _displayNoResultsAlert: function() {
        Ext.Msg.alert('Info', 'The search returned no results.');
    },

    _onResultsGridBbarBeforeChange: function (bbar, params) {
        this.searcher.goToPage(params.start + 1, params.limit);
        //Stop paging control from doing anything itself for the moment
        // TODO: replace with store driven paging
        return false;
    }
});
