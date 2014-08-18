/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.service');

Portal.service.CatalogSearcher = Ext.extend(Ext.util.Observable, {
    DRILLDOWN_PARAMETER_NAME: "facet.q",

    constructor: function(cfg) {
        var defaults = {
            serviceUrl: 'xml.search.imos',
            baseParams: {
                fast: 'index'
            },
            defaultParams: {},
            pageSize: 10
        };

        var searchFilters = new Ext.data.JsonStore({
            root: 'filters',
            fields: ['name', 'value']
        });

        var config = Ext.apply({
            searchFilters: searchFilters
        }, cfg, defaults);

        // Not done in Observable's constructor for some reason
        Ext.apply(this, config);

        Portal.service.CatalogSearcher.superclass.constructor.call(this, config);

        this.addEvents('searchstart', 'hiersearchcomplete', 'searchcomplete', 'searcherror', 'filteradded', 'filterremoved');
    },

    reset: function() {
        this.searchFilters.removeAll();
    },

    search: function() {
        var page = {from: 1, to: this.pageSize};
        this._search(page);
    },

    _search: function(page) {

        this.fireEvent('searchstart');

        var requestUrl = this._getRequestUrl(page);

        // TODO: this will go.
        Ext.ux.Ajax.proxyRequest({
            url: requestUrl,
            success: this._onSuccessfulSearch,
            failure: this._logAndReturnErrors,
            page: page,
            scope: this,
            defaultHeaders: {
                'Content-Type': 'application/xml'
            }
        });

        if (Portal.app.appConfig.featureToggles.hierarchicalFacets) {
            var searchResponseLoader = this._newSearchResponseLoader({
                requestMethod: 'GET',
                preloadChildren: true,
                url: Ext.ux.Ajax.constructProxyUrl(requestUrl),
                listeners: {
                    scope: this,
                    load: this._onSuccessfulHierSearch,
                    loadexception: this._logAndReturnErrors
                }
            });

            this.searchResultRootNode = new Ext.tree.TreeNode();
            searchResponseLoader.load(this.getSearchResultRootNode());
        }
    },

    // TODO: this function only exists because I didn't have any luck spying
    // GeoNetworkSearchResponseLoader's constructor.
    _newSearchResponseLoader: function(loaderConfig) {
        return new Portal.ui.search.data.GeoNetworkSearchResponseLoader(loaderConfig);
    },

    getSearchResultRootNode: function() {
        if (!this.searchResultRootNode) {
            this.searchResultRootNode = new Ext.tree.TreeNode();
        }
        return this.searchResultRootNode
    },

    getSummaryNode: function() {

        var summaryNode;

        if (this.searchResultRootNode) {
            summaryNode = this.searchResultRootNode.findChildBy(function(node) {
                return node.attributes.tagName == 'summary';
            }, this, true);
        }

        return summaryNode;
    },

    goToPage: function(start, limit) {
        var page = {from: start, to: start + limit - 1};
        this._search(page);
    },

    removeDrilldownFilters: function() {
        this.removeFilters(this.DRILLDOWN_PARAMETER_NAME);
    },

    removeFilters: function(filterPattern) {

        var filters = this.searchFilters.query('name', filterPattern);

        this.searchFilters.remove(filters.items);

        this.fireEvent( 'filterremoved' );
    },

    addDrilldownFilter: function(value) {
        this.addFilter(this.DRILLDOWN_PARAMETER_NAME, value);
    },

    addFilter: function(name, value) {
        var rec = new this.searchFilters.recordType();

        rec.set('name', name);
        rec.set('value', value);

        this.searchFilters.add(rec);

        this.fireEvent( 'filteradded' );
    },

    hasFilters: function() {

        var idx = this.searchFilters.findBy( function( record ) {

            return record.data.value != '';
        } );

        return idx >= 0;
    },

    _onSuccessfulSearch: function(response, options) {
        this.fireEvent('searchcomplete', response.responseXML, options.page);
    },

    _onSuccessfulHierSearch: function() {
        this.fireEvent('hiersearchcomplete', this.getSummaryNode());
    },

    _logAndReturnErrors: function(response, options) {
        this.fireEvent('searcherror', response);
    },

    // Build request url to use from catalogUrl and filters
    _getRequestUrl: function(page) {
        var params = this._getParams(page);

        var searchUrl = this.catalogUrl + '/srv/eng/' + this.serviceUrl;

        return searchUrl  + '?' + Ext.urlEncode(params);
    },

    _getParams: function(page) {
        //--- Add search defaults (e.g. map layers only)
        var params = Ext.apply({}, this.defaultParams);

        //--- Add paging params
        Ext.apply(params, page);

        //--- Add current search filters
        this.searchFilters.each(function(rec) {
            name = rec.get('name');
            param = params[name];
            value = rec.get('value');

            if (Ext.isDefined(param)) {
                if (Ext.isArray(param)) {
                    params[name].push(value);
                }
                else {
                    params[name] = [param, value];
                }
            }
            else {
                params[name] = value;
            }
        });

        //--- Add required base parameters (e.g. fast=index)
        Ext.apply(params, this.baseParams);

        return params;
    }
});
