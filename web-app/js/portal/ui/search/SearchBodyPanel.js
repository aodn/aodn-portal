/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.ui.search');

Portal.ui.search.SearchBodyPanel = Ext.extend(Ext.Panel, {

    constructor: function (cfg) {

        this.resultGridSize = 10;

        this.resultsStore = cfg.resultsStore;
        this.searcher = cfg.searcher;

        this.splashPanel = new Portal.ui.HomePanel({});

        this.resultsGrid = new Portal.search.FacetedSearchResultsGrid({
            hidden: true,
            store: this.resultsStore
        });

        var config = Ext.apply({
            layout: 'card',
            activeItem: this.splashPanel,
            items: [
                this.splashPanel,
                this.resultsGrid
            ]
        }, cfg);

        Portal.ui.search.SearchBodyPanel.superclass.constructor.call(this, config);

        this.resultsStore.on('load', function() {
            this._onResultsStoreLoad();
        }, this);

        this.resultsGrid.getBottomToolbar().on('beforechange', this._onResultsGridBbarBeforeChange, this);
    },

    _onResultsStoreLoad: function() {
        if (this.resultsStore.getTotalCount() == 0) {
            this._displayNoResultsAlert();
        }
        else {
            this._activateResultsGridCard();
        }
    },

    _displayNoResultsAlert: function() {
        Ext.Msg.alert('Info', 'The search returned no results.');
    },

    _activateResultsGridCard: function() {
        this.layout.setActiveItem(this.resultsGrid);
    },

    onFiltersCleared: function() {
        this._activateSplashCard();
    },

    _activateSplashCard: function() {
        this.layout.setActiveItem(this.splashPanel);
    },

    _onResultsGridBbarBeforeChange: function (bbar, params) {

        this.resultsGrid.showMask();
        this.searcher.goToPage(params.start + 1, params.limit);
        this.resultsGrid.hideMask();
        //Stop paging control from doing anything itself for the moment
        // TODO: replace with store driven paging
        return false;
    }
});
