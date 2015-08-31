/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.data.DataCollection');

Portal.data.DataCollection = function() {

    var constructor = Ext.data.Record.create([]);

    constructor.prototype.getTitle = function() {
        return this.getMetadataRecord().get('title');
    };

    constructor.prototype.getUuid = function() {
        return this.getMetadataRecord().get('uuid');
    };

    constructor.prototype.getMetadataRecord = function() {
        return this.data.metadataRecord;
    };

    constructor.prototype.getFiltersRequestParams = function() {
        var layer = this.getLayerSelectionModel().getSelectedLayer();
        var layerName = this.getDownloadLayerName();

        return {
            server: layer.url,
            layer: layerName
        };
    };

    constructor.prototype._loadFilters = function() {
        var filterService = new Portal.filter.FilterService();
        filterService.loadFilters(this, this._onFiltersLoadSuccess, this._onFiltersLoadFailure, this);
    };

    constructor.prototype._onFiltersLoadSuccess = function(filters) {
        this.filters = filters;

        Ext.each(filters, function(filter) {
            filter.on(Portal.filter.Filter.EVENTS.VALUE_CHANGED, this._onFilterValueChanged, this);
        }, this);

        this.fireEvent(Portal.data.DataCollection.EVENTS.FILTERS_LOAD_SUCCESS, filters);
    };

    constructor.prototype._onFiltersLoadFailure = function() {
        this.filters = [];

        this.fireEvent(Portal.data.DataCollection.EVENTS.FILTERS_LOAD_FAILURE);
    };

    constructor.prototype._onFilterValueChanged = function() {

        // Update layer with new values
        var layer = this.getLayerSelectionModel().getSelectedLayer();

        if (layer.updateCqlFilter) {
            layer.updateCqlFilter(this.getFilters());
        }
    };

    constructor.prototype.updateFilters = function() {

        // Update layer with new values
        var layer = this.getLayerSelectionModel().getSelectedLayer();

        if (layer.updateCqlFilter) {
            layer.updateCqlFilter(this.getFilters());
        }
    };

    constructor.prototype.getFilters = function() {

        return this.filters;
    };

    constructor.prototype.getAllLinks = function() {
        return this.getMetadataRecord().get('links');
    };

    constructor.prototype.getLinksByProtocol = function(protocols) {
        var allLinks = this.getAllLinks();
        var matchesProtocols = function(link) {
            return protocols.indexOf(link.protocol) != -1;
        };

        return allLinks.filter(matchesProtocols);
    };

    constructor.prototype.getDownloadLayerName = function() {
        var wfsLayerLinks = this.getLinksByProtocol(Portal.app.appConfig.portal.metadataProtocols.wfs);
        var wmsLayerLinks = this.getLinksByProtocol(Portal.app.appConfig.portal.metadataProtocols.wms);
        var firstWfsLink = wfsLayerLinks[0];
        var firstWmsLink = wmsLayerLinks[0];
        var link = firstWfsLink || firstWmsLink;

        var _workspaceFromName = function(layerName) {
            if (layerName.indexOf(':') >= 0) {
                return layerName.split(":")[0];
            }
        };

        if (link) {
            var linkName = link.name;

            // If layer has no workspace defined, assume it is in the same workspace as the WMS layer
            if (_workspaceFromName(linkName)) {
                return linkName;
            }
            else {
                return _workspaceFromName(firstWmsLink.name) + ':' + linkName;
            }
        }
    };

    constructor.prototype.getLayerSelectionModel = function() {
        if (!this.layerSelectionModel) {
            this.layerSelectionModel = new Portal.data.LayerSelectionModel({
                dataCollection: this
            });
        }

        return this.layerSelectionModel;
    };

    constructor.prototype.getLayerAdapter = function() {
        if (!this.layerAdapter) {
            this.layerAdapter = new Portal.data.DataCollectionLayerAdapter({
                layerSelectionModel: this.getLayerSelectionModel()
            });
        }

        return this.layerAdapter;
    };

    constructor.prototype.isNcwms = function() {
        return this.getLayerSelectionModel().isNcwms();
    };

    return constructor;
}();

Portal.data.DataCollection.EVENTS = {
    FILTERS_LOAD_SUCCESS: 'filtersLoadSuccess',
    FILTERS_LOAD_FAILURE: 'filtersLoadFailure'
};

Portal.data.DataCollection.fromMetadataRecord = function(metadataRecord) {
    var dataCollection = new Portal.data.DataCollection({
        "metadataRecord": metadataRecord
    });

    Portal.utils.ObservableUtils.makeObservable(dataCollection);

    dataCollection._loadFilters();

    return dataCollection;
};
