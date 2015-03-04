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

    loadFilters: function(layer, onLoadedCallback, callbackScope) {

        var params = {
            server: layer.server.uri,
            layer: layer.wmsName
        };

        Ext.Ajax.request({
            url: this.GET_FILTER,
            params: params,
            scope: this,
            failure: function() {
                log.error('failed to load filters: ' + JSON.stringify(params));
            },
            success: this._filtersLoaded,
            callbackFunction: onLoadedCallback,
            callbackScope: callbackScope,
            layer: layer
        });
    },

    _filtersLoaded: function(response, opts) {

        var callbackFunction = opts.callbackFunction;
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

    loadFilterRange: function(filterId, layer, onLoadedCallback, callbackScope) {

        var params = {
            filter: filterId,
            server: layer.server.uri,
            layer: layer.wmsName
        };

        Ext.Ajax.request({
            url: this.GET_FILTER_VALUES,
            params: params,
            scope: this,
            failure: function() {
                log.error('failed to load filter range for filter: ' + JSON.stringify(params));
            },
            success: function(resp, opts) {
                var filterRange = Ext.util.JSON.decode(resp.responseText);

                onLoadedCallback.call(callbackScope, filterRange);
            }
        });
    }
});