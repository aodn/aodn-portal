Ext.namespace('Portal.search');

Portal.search.SearchBodyPanel = Ext.extend(Ext.Panel, {

    constructor: function (cfg) {

        this.resultsStore = cfg.resultsStore;
        this.loadingResultsStore = false;
        this.searcher = cfg.searcher;

        this.searchResultsPanel = new Portal.search.FacetedSearchResultsPanel({
            searchResultsPanel: this,
            searcher: this.searcher,
            store: this.resultsStore,
            dataCollectionStore: cfg.dataCollectionStore,
            classificationStore: cfg.classificationStore
        });

        this.resultsStatus = new Ext.Panel();

        var config = Ext.apply({
            autoScroll: true,
            bodyCssClass: "faceted-search-results",
            tbar: this._buildToolBar(),
            activeItem: this.searchResultsPanel,
            items: [this.searchResultsPanel]
        }, cfg);

        Portal.search.SearchBodyPanel.superclass.constructor.call(this, config);

        this.resultsStore.on('load', function() {
            this._onResultsStoreLoad();
        }, this);

        this.on('render', function() {
            var that = this;
            this.getEl().down('div').down('.faceted-search-results').on('scroll', function (evt, c) {
                that.handleScroll(evt, c);
            });
        }, this);

    },

    _onResultsStoreLoad: function() {
        if (this.resultsStore.getTotalCount() == 0) {
            this._displayNoResultsAlert();
        }
        var that = this;
        setTimeout(function () {
            that.loadingResultsStore = false;
        }, 2000);

        this.setResultsStatus();
        this.hideSpinnerText();
    },

    setResultsStatus: function() {
        this.resultsStatus.update(this.getResultCounts());
    },

    _canLoadMore: function() {
        return ((this.resultsStore.getTotalCount() > this.resultsStore.data.items.length) && !this.loadingResultsStore);
    },

    _displayNoResultsAlert: function() {
        Ext.Msg.alert('Info', 'The search returned no results.');
    },

    handleScroll: function() {
        var fSRDiv = this.body.dom;
        var pixelsFromBottom = fSRDiv.scrollHeight -  (fSRDiv.clientHeight + fSRDiv.scrollTop);
        if (this._canLoadMore() && pixelsFromBottom < 500  ) {
            this.loadMoreResults();
        }
    },

    loadMoreResults: function() {
        this.searcher.goToPage(this.resultsStore.data.length + 1);
        this.loadingResultsStore = true;
        this.showSpinnerText();
    },

    _buildToolBar: function() {
        return new Ext.Toolbar({
            cls: 'search-results-toolbar',
            defaults: {bodyStyle:'padding-bottom:10px'},
            width: 840,
            border: false,
            frame: false,
            items: [
                "->",
                this._buildSpinner(),
                new Ext.Spacer({
                    cls: 'block',
                    width: 30
                }),
                this.resultsStatus]
        });
    },

    _buildSpinner: function() {
        this.spinner = new Ext.Panel({
            html: this._makeSpinnerText(OpenLayers.i18n('loadingResourceMessage', {'resource': ''})),
            hidden: false
        });

        return this.spinner;
    },

    getResultCounts: function() {
        return String.format("<span>Loaded <b>{0}</b> of <b>{1}</b> matching collections </span>", this.resultsStore.data.length, this.resultsStore.getTotalCount() );
    },

    _makeSpinnerText: function(text) {
        return '<span class=\"fa fa-spin fa-spinner \"></span> ' + text;
    },

    hideSpinnerText: function() {
        this.spinner.hide();
        this.setResultsStatus();
        this.resultsStatus.show();
    },

    showSpinnerText: function() {
        this.spinner.show();
        this.resultsStatus.hide();
    },

    setScrollPosition: function(pixelsFromTop) {
        this.body.dom.scrollTop = ((pixelsFromTop > 0) ? pixelsFromTop: 0);
    },
});
