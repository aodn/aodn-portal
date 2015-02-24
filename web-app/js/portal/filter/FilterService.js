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

    getFilters: function(collection, onLoadedCallback, callbackScope) {

        Ext.Ajax.request({
            url: this.GET_FILTER,
            params: {
                server: collection.server.uri,
                layer: collection.wmsName
            },
            scope: this,
            failure: function() {
            },
            success: function(resp, opts) {
                var filters = Ext.util.JSON.decode(resp.responseText);

                onLoadedCallback.call(callbackScope, filters);
            }
        });
    },

    getFilterRange: function(filterId, collection, onLoadedCallback, callbackScope) {

        Ext.Ajax.request({
            url: this.GET_FILTER_VALUES,
            params: {
                filter: filterId,
                server: collection.server.uri,
                layer: collection.wmsName
            },
            scope: this,
            failure: function() {
            },
            success: function(resp, opts) {
                var filterRange = Ext.util.JSON.decode(resp.responseText);

                onLoadedCallback.call(callbackScope, filterRange);
            }
        });
    }
});
