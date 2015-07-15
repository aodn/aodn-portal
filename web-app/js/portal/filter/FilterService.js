/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.filter');

Portal.filter.FilterService = Ext.extend(Object, {

    constructor: function() {

        this.GET_FILTER = "layer/getFilters";
        this.GET_FILTER_VALUES = "layer/getFilterValues";
    },

    loadFilters: function(layer, successCallback, failureCallback, callbackScope) {

        var params = {
            server: layer.server.uri,
            layer:  this._filterLayerName(layer)
        };

        Ext.Ajax.request({
            url: this.GET_FILTER,
            params: params,
            scope: this,
            success: this._filtersLoaded,
            failure: this._handleFilterLoadFailure,
            successCallback: successCallback,
            failureCallback: failureCallback,
            callbackScope: callbackScope,
            layer: layer
        });
    },

    _filtersLoaded: function(response, opts) {

        var callbackFunction = opts.successCallback;
        var callbackScope = opts.callbackScope;
        var layer = opts.layer;
        var filterDetails = Ext4.JSON.decode(response.responseText);
        var filterObjects = [];

        Ext4.each(filterDetails, function(filterDetail) {

            var filterConstructor = Portal.filter.Filter.classFor(filterDetail);

            if (filterConstructor) {

                var newFilterObject = new filterConstructor(filterDetail, layer);

                filterObjects.push(newFilterObject);
            }
            else {
                log.error("Can't create Filter for layer '" + layer.wmsName + "' from data: " + JSON.stringify(filterDetail));
            }
        });

        this._determinePrimaryFilters(filterObjects);

        layer.filters = filterObjects;

        callbackFunction.call(callbackScope, filterObjects);
    },

    _handleFilterLoadFailure: function(resp, opts) {

        var callbackFunction = opts.failureCallback;
        var callbackScope = opts.callbackScope;

        log.error('failed to load filters: ' + JSON.stringify(opts.params));

        callbackFunction.call(callbackScope);
    },

    loadFilterRange: function(filterId, layer, successCallback, failureCallback, callbackScope) {

        var params = {
            filter: filterId,
            server: layer.server.uri,
            layer: layer.wmsName
        };

        Ext.Ajax.request({
            url: this.GET_FILTER_VALUES,
            params: params,
            successCallback: successCallback,
            failureCallback: failureCallback,
            callbackScope: callbackScope,
            success: this._filterRangeLoaded,
            failure: this._handleFilterRangeLoadFailure,
            scope: this
        });
    },

    _filterRangeLoaded: function(resp, opts) {

        var callbackFunction = opts.successCallback;
        var callbackScope = opts.callbackScope;
        var filterRange = Ext4.JSON.decode(resp.responseText);

        callbackFunction.call(callbackScope, filterRange);
    },

    _handleFilterRangeLoadFailure: function(resp, opts) {

        var callbackFunction = opts.failureCallback;
        var callbackScope = opts.callbackScope;

        log.error('failed to load filter range for filter: ' + JSON.stringify(opts.params));

        callbackFunction.call(callbackScope);
    },

    _filterLayerName: function(layer) {

        var filterLayer = layer.wmsName;

        if (layer.getDownloadLayer) {
            filterLayer = layer.getDownloadLayer();
        }

        return filterLayer;
    },

    _determinePrimaryFilters: function(filters) {

        var dateFilters = filters.filter(function(filter) {

            return filter.constructor == Portal.filter.DateFilter;
        });

        if (dateFilters.length == 1) {

            dateFilters[0].primaryFilter = true;
        }
    }
});
