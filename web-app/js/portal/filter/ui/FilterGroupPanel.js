Ext.namespace('Portal.filter.ui');

Portal.filter.ui.FilterGroupPanel = Ext.extend(Portal.filter.ui.GroupPanel, {
    constructor: function(cfg) {
        Portal.filter.ui.FilterGroupPanel.superclass.constructor.call(this, cfg);
    },

    initComponent: function() {
        Portal.filter.ui.FilterGroupPanel.superclass.initComponent.call(this);
    },

    _attachEvents: function() {
        var filters = this.dataCollection.getFilters();
        if (filters == undefined) {
            this.dataCollection.on(Portal.data.DataCollection.EVENTS.FILTERS_LOAD_SUCCESS, this._filtersLoaded, this);
            this.dataCollection.on(Portal.data.DataCollection.EVENTS.FILTERS_UPDATED, this.testGetFeaturesWithFilters, this);
            this.dataCollection.on(Portal.data.DataCollection.EVENTS.FILTERS_LOAD_FAILURE, function() { this._filtersLoaded([]); }, this);
        }
        else {
            this._filtersLoaded(filters);
        }
    },

    _filtersLoaded: function(filters) {
        var filterPanels = [];
        var filterService  = new Portal.filter.FilterService();
        this._sortFilters(filters);

        Ext.each(filters, function(filter) {

            var filterPanel = this._createFilterPanel(filter);

            filterPanels.push(filterPanel);

            if (filterPanel.needsFilterRange()) {

                filterService.loadFilterRange(
                    filter.getName(),
                    this.dataCollection,
                    this.createSafeCallback(function(filterRange) {
                        filterPanel.setFilterRange(filterRange);
                    }),
                    this.createSafeCallback(function() {
                        filterPanel.setFilterRange([]);
                    }),
                    this
                );
            }
        }, this);

        this.filterPanels = filterPanels;

        this._organiseFilterPanels(filterPanels);

        if (this.filterPanels.length > 0) {
            this._updateAndShow();
        }
        else {
            this._handleFilterLoadFailure();
        }
    },

    testGetFeaturesWithFilters: function() {

        var wfsFullCheckUrl = this._getFeatureUrlGeneratorFunction();
        if (wfsFullCheckUrl.includes("CQL_FILTER")) {
            Ext.Ajax.request({
                url: Ext.ux.Ajax.constructProxyUrl(wfsFullCheckUrl),
                scope: this,
                success: this._handleGetFeatureRequestResults,
                failure: this._handleGetFeatureRequestResults
            });
        }
        else {
            delete(this.dataCollection.totalFilteredFeatures);
            this._handleEmptyDownloadMsg();
        }
    },

    _handleGetFeatureRequestResults: function(results) {
        if (results.status == 200) {
            var res = Ext.util.JSON.decode(results.responseText);
            this.dataCollection.totalFilteredFeatures = (res && res.totalFeatures >= 0) ? res.totalFeatures: undefined;
        }
        else {
            this.dataCollection.totalFilteredFeatures = undefined;
        }
        this._handleEmptyDownloadMsg();

    },

    _handleEmptyDownloadMsg: function() {
        if (this.isDestroyed !== true ) {
            //var show = (this.dataCollection.totalFilteredFeatures != undefined && this.dataCollection.totalFilteredFeatures == 0);
            //this.warningEmptyDownloadMessage.setVisible(show); //todo hide for now
        }
    },

    _getFeatureUrlGeneratorFunction: function() {

        var builder = new Portal.filter.combiner.FiltersWithValuesCqlBuilder({
            filters: this.dataCollection.getFilters()
        });

        var url = OpenLayers.Layer.WMS.buildGetFeatureRequestUrl(
            this.dataCollection.layerSelectionModel.selectedLayer.url,
            this.dataCollection.layerSelectionModel.selectedLayer.wmsName.split('#')[0],
            "application/json",
            builder.buildCql()
        );

        return url + "&maxFeatures=1"
    }
});
