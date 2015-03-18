/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.filter');

Portal.filter.FilterService = Ext.extend(Object, {

    constructor: function() {

        this.GET_FILTER = "layer/getFiltersAsJSON";
        this.GET_FILTER_VALUES = "layer/getFilterValuesAsJSON";
    },

    loadFilters: function(layer, successCallback, callbackScope) {

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
            callbackScope: callbackScope,
            layer: layer
        });
    },

    _filtersLoaded: function(response, opts) {

        var callbackFunction = opts.successCallback;
        var callbackScope = opts.callbackScope;
        var layer = opts.layer;
        var filterDetails = Ext.util.JSON.decode(response.responseText);
        var filterObjects = [];

        Ext.each(filterDetails, function(filterDetail) {

            var newFilterObject = new Portal.filter.Filter(filterDetail, layer);

            filterObjects.push(newFilterObject);
        });

        callbackFunction.call(callbackScope, filterObjects);
    },

    _handleFilterLoadFailure: function(resp, opts) {

        log.error('failed to load filters: ' + JSON.stringify(opts.params));
    },

    loadFilterRange: function(filterId, layer, successCallback, callbackScope) {

        var params = {
            filter: filterId,
            server: layer.server.uri,
            layer: this._filterLayerName(layer)
        };

        Ext.Ajax.request({
            url: this.GET_FILTER_VALUES,
            params: params,
            successCallback: successCallback,
            callbackScope: callbackScope,
            success: this._filterRangeLoaded,
            failure: this._handleFilterRangeLoadFailure,
            scope: this
        });
    },

    _filterRangeLoaded: function(resp, opts) {

        var callbackFunction = opts.successCallback;
        var callbackScope = opts.callbackScope;
        var filterRange = Ext.util.JSON.decode(resp.responseText);

        callbackFunction.call(callbackScope, filterRange);
    },

    _handleFilterRangeLoadFailure: function(resp, opts) {

        log.error('failed to load filter range for filter: ' + JSON.stringify(opts.params));
    },

    _filterLayerName: function(layer) {

        var filterLayer = layer.wmsName;

        // Todo - DN: The filterSource and shouldUseDownloadLayerIfPossible variables will be redundant when we go stateless and can be removed
        var filterSource = Portal.app.appConfig.featureToggles.filterSource;
        var shouldUseDownloadLayerIfPossible = filterSource !== 'database';

        if (shouldUseDownloadLayerIfPossible && layer.getDownloadLayer) {
            filterLayer = layer.getDownloadLayer();
        }

        return filterLayer;
    }
});
