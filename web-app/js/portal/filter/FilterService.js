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

        Ext.Ajax.request({
            url: this.GET_FILTER,
            params: {
                server: layer.server.uri,
                layer: layer.wmsName
            },
            scope: this,
            failure: function() {
                alert("got 99 problems");
            },
            success: this._filtersLoaded,
            callbackFunction: onLoadedCallback,
            callbackScope: callbackScope,
            layer: layer
        });
    },

    _filtersLoaded: function(response, opts) {

        console.log("filters loaded");

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

        Ext.Ajax.request({
            url: this.GET_FILTER_VALUES,
            params: {
                filter: filterId,
                server: layer.server.uri,
                layer: layer.wmsName
            },
            scope: this,
            failure: function() {
                alert("not in da club");
            },
            success: function(resp, opts) {
                var filterRange = Ext.util.JSON.decode(resp.responseText);

                onLoadedCallback.call(callbackScope, filterRange);
            }
        });
    }
});
