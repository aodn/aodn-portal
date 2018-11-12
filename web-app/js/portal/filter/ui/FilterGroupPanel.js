Ext.namespace('Portal.filter.ui');

Portal.filter.ui.FilterGroupPanel = Ext.extend(Portal.filter.ui.GroupPanel, {

    _filtersLoaded: function(filters) {
        var filterPanels = [];
        var filterService = new Portal.filter.FilterService();
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

        Ext.MsgBus.publish(PORTAL_EVENTS.DATA_COLLECTION_MODIFIED, this.dataCollection);

    },

    _filtersUpdated: function() {

        var featureParams = this._getFeatureParams();
        if (featureParams.filter) {
            Ext.Ajax.request({
                url: "layer/getFeatureCount",
                params: featureParams,
                scope: this,
                success: this._handleGetFeatureRequestResults
            });
        }
        else {
            delete(this.dataCollection.totalFilteredFeatures);
            this._handleEmptyDownloadMsg();
        }
    },

    _handleGetFeatureRequestResults: function(results) {
        if (results.status == 200) {
            var featureCount = results.responseText;
            this.dataCollection.totalFilteredFeatures = (featureCount >= 0) ? featureCount : undefined;
        }
        else {
            this.dataCollection.totalFilteredFeatures = undefined;
        }
        this._handleEmptyDownloadMsg();

    },

    _handleEmptyDownloadMsg: function() {
        if (this.isDestroyed !== true) {
            var show = (this.dataCollection.totalFilteredFeatures != undefined && this.dataCollection.totalFilteredFeatures == 0);
            this.warningEmptyDownloadMessage.setVisible(show);
        }
    },

    _getFeatureParams: function() {

        var builder = new Portal.filter.combiner.DataDownloadCqlBuilder({
            filters: this.dataCollection.getFilters()
        });

        var selectedLayer = this.dataCollection.layerSelectionModel.selectedLayer;
        var layerName = selectedLayer.wmsName.split('#')[0];
        var serverType = selectedLayer.server.type.toLowerCase();

        return {
            server: selectedLayer.url,
            serverType: serverType,
            layer: layerName,
            filter: builder.buildCql()
        };
    }
});
