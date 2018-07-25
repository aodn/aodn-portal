Ext.namespace('Portal.filter');

Portal.filter.FilterService = Ext.extend(Object, {

    constructor: function(map) {

        this.GET_FILTER = "layer/getFilters";
        this.GET_FILTER_VALUES = "layer/getFilterValues";
        this.map = map;

    },

    loadFilters: function(dataCollection, successCallback, failureCallback, callbackScope) {

        // Turn off polygon drawing on the map now because when user finishes drawing it will try to apply the filter values
        // and we don't have all the filter values yet.
        // PORTAL_EVENTS.DATA_COLLECTION_MODIFIED fires when the filter values are ready.
        this.map.spatialConstraintControl.disableControl();
        Ext.MsgBus.subscribe(PORTAL_EVENTS.DATA_COLLECTION_MODIFIED, function() { this.map.spatialConstraintControl.enableControl() }, this);

        Ext.Ajax.request({
            url: this.GET_FILTER,
            params: dataCollection.getFiltersRequestParams(),
            scope: this,
            success: this._filtersLoaded,
            failure: this._handleFilterLoadFailure,
            successCallback: successCallback,
            failureCallback: failureCallback,
            callbackScope: callbackScope,
            dataCollection: dataCollection
        });
    },

    _filtersLoaded: function(response, opts) {

        Ext.get(this.map.viewPortDiv.id).setStyle('cursor', 'wait');  // Calculating filter ranges may take a while

        var callbackFunction = opts.successCallback;
        var callbackScope = opts.callbackScope;
        var dataCollection = opts.dataCollection;
        var filterDetails = Ext.util.JSON.decode(response.responseText);
        var filterObjects = [];

        Ext.each(filterDetails, function(filterDetail) {

            var filterConstructor = Portal.filter.Filter.classFor(filterDetail);

            if (filterConstructor) {

                var newFilterObject = new filterConstructor(filterDetail);

                filterObjects.push(newFilterObject);
            }
            else {
                log.debug("Can't create Filter for dataCollection '" + dataCollection.getTitle() + "' from data: " + JSON.stringify(filterDetail));
            }
        });

        this._determinePrimaryFilters(filterObjects);

        callbackFunction.call(callbackScope, filterObjects);
    },

    _handleFilterLoadFailure: function(resp, opts) {

        var callbackFunction = opts.failureCallback;
        var callbackScope = opts.callbackScope;

        log.error('failed to load filters: ' + JSON.stringify(opts.params));

        callbackFunction.call(callbackScope);
    },

    loadFilterRange: function(filterId, dataCollection, successCallback, failureCallback, callbackScope) {

        var layer = dataCollection.getLayerSelectionModel().getSelectedLayer();

        var params = {
            filter: filterId,
            server: layer.server.uri,
            serverType: layer.server.type.toLowerCase(),
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
        var filterRange = Ext.util.JSON.decode(resp.responseText);

        callbackFunction.call(callbackScope, filterRange);
    },

    _handleFilterRangeLoadFailure: function(resp, opts) {

        var callbackFunction = opts.failureCallback;
        var callbackScope = opts.callbackScope;

        log.error('failed to load filter range for filter: ' + JSON.stringify(opts.params));

        callbackFunction.call(callbackScope);
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
