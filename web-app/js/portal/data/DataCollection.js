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

    constructor.prototype.getWmsLayerLinks = function() {
        return this._getFilteredLinks(Portal.app.appConfig.portal.metadataProtocols.wms);
    };

    constructor.prototype.getWfsLayerLinks = function() {
        return this._getFilteredLinks(Portal.app.appConfig.portal.metadataProtocols.wfs);
    };

    constructor.prototype.getDataFileLinks = function() {
        return this._getFilteredLinks(Portal.app.appConfig.portal.metadataProtocols.dataFile);
    };

    constructor.prototype.getWebPageLinks = function() {
        return this._getFilteredLinks(Portal.app.appConfig.portal.metadataProtocols.webPage);
    };

    constructor.prototype.getDataDownloadHandlers = function() {

        var protocolHandlerConstructors = { // Todo - DN: Should this mapping live in config?
            'OGC:WFS-1.0.0-http-get-capabilities': [
                Portal.cart.WfsDownloadHandler,
                Portal.cart.PythonDownloadHandler
            ],
            'IMOS:AGGREGATION--bodaac': Portal.cart.BodaacDownloadHandler,
            'IMOS:AGGREGATION--gogoduck': Portal.cart.GogoduckDownloadHandler
        };

        var applicableDownloadOptions = [];

        Ext.each(this._getRawLinks(), function(link) {
            var constructors = protocolHandlerConstructors[link.protocol];

            if (constructors) {
                Ext.each(constructors, function(constructor) {
                    applicableDownloadOptions.push(
                        new constructor(link)
                    );
                });
            }
        }, this);

        return applicableDownloadOptions;
    };

    constructor.prototype.getFiltersRequestParams = function() {
        var layer = this.getLayerState().getSelectedLayer();
        var layerName = this.getDownloadLayerName();

        return {
            server: layer.server.uri,
            layer: layerName
        };
    };

    constructor.prototype.setFilters = function(filters) {

        this.filters = filters;
    };

    constructor.prototype.updateFilters = function() {

        // Update layer with new values
        var layer = this.getLayerState().getSelectedLayer();

        if (layer.updateCqlFilter) {
            layer.updateCqlFilter(this.getFilters());
        }
    };

    constructor.prototype.getFilters = function() {

        return this.filters || [];
    };

    constructor.prototype.getNcwmsParams = function() {

        return this.ncwmsParams || {};
    };

    constructor.prototype.updateNcwmsParams = function(dateRangeStart, dateRangeEnd, geometry) {

        var newNcwmsParams = {};
        var newFilterValue = {};

        if (dateRangeStart && dateRangeStart.isValid()) {
            newNcwmsParams.dateRangeStart = dateRangeStart;
            newFilterValue.fromDate = dateRangeStart.toDate();
        }

        if (dateRangeEnd && dateRangeEnd.isValid()) {
            newNcwmsParams.dateRangeEnd = dateRangeEnd;
            newFilterValue.toDate = dateRangeEnd.toDate();
        }

        if (geometry) {
            var bounds = geometry.getBounds();

            newNcwmsParams.latitudeRangeStart = bounds.bottom;
            newNcwmsParams.longitudeRangeStart = bounds.left;
            newNcwmsParams.latitudeRangeEnd = bounds.top;
            newNcwmsParams.longitudeRangeEnd = bounds.right;
        }

        this.ncwmsParams = newNcwmsParams;

        // We also set a Filters equivalent of the date values for BODAAC CQL building
        // This will disappear when https://github.com/aodn/backlog/issues/191 is done
        var dateFilter = new Portal.filter.DateFilter({
            name: 'time',
            value: newFilterValue,
            visualised: true
        });

        this.setFilters([
            dateFilter
        ]);
    };

    constructor.prototype._getRawLinks = function() { // Todo - DN: 'raw' here because they haven't gone thorugh the LayerStore. What is a better name?
        return this.getMetadataRecord().get('links');
    };

    constructor.prototype._getFilteredLinks = function(protocols) {

        var linkStore = new Portal.search.data.LinkStore({
            data: { links: this._getRawLinks() }
        });

        linkStore.filterByProtocols(protocols);

        return linkStore.getRange(); // Get all records
    };

    constructor.prototype.getDownloadLayerName = function() {
        var firstWfsLink = this.getWfsLayerLinks()[0];
        var firstWmsLink = this.getWmsLayerLinks()[0];
        var link = firstWfsLink || firstWmsLink;

        var _workspaceFromName = function(layerName) {
            if (layerName.indexOf(':') >= 0) {
                return layerName.split(":")[0];
            }
        };

        if (link) {
            var linkName = link.data.name;

            // If layer has no workspace defined, assume it is in the same workspace as the WMS layer
            if (_workspaceFromName(linkName)) {
                return linkName;
            }
            else {
                return _workspaceFromName(firstWmsLink.data.name) + ':' + linkName;
            }
        }
    };

    constructor.prototype.getLayerState = function() {
        if (!this.layerState) {
            this.layerState = new Portal.data.DataCollectionLayers({
                dataCollection: this
            });
        }

        return this.layerState;
    };

    constructor.prototype.isNcwms = function() {
        return this.getLayerState().isNcwms();
    };

    return constructor;
}();

Portal.data.DataCollection.fromMetadataRecord = function(metadataRecord) {

    return new Portal.data.DataCollection({
        "metadataRecord": metadataRecord
    });
};
