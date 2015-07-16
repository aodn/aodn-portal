/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext4.namespace('Portal.service');

Portal.service.CatalogSearcher = Ext.extend(Ext.util.Observable, {
    DRILLDOWN_PARAMETER_NAME: "facet.q",

    constructor: function(cfg) {
        var defaults = {
            serviceUrl: Portal.app.appConfig.geonetwork.searchPath,
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

        var config = Ext4.apply({
            searchFilters: searchFilters
        }, cfg, defaults);

        // Not done in Observable's constructor for some reason
        Ext4.apply(this, config);

        Portal.service.CatalogSearcher.superclass.constructor.call(this, config);

        this._searchResultRootNode = new Ext.tree.TreeNode();

        this.addEvents('searchstart', 'searchcomplete', 'searcherror', 'filteradded', 'filterremoved');
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

        var searchResponseLoader = this._newSearchResponseLoader({
            requestMethod: 'GET',
            preloadChildren: true,
            url: Ext4.ux.Ajax.constructProxyUrl(requestUrl),
            listeners: {
                scope: this,
                load: this._onSuccessfulSearch.bind(this, page),
                loadexception: this._logAndReturnErrors
            }
        });

        this._searchResultRootNode = new Ext.tree.TreeNode();
        searchResponseLoader.load(this._searchResultRootNode);
    },

    // TODO: this function only exists because I didn't have any luck spying
    // GeoNetworkSearchResponseLoader's constructor.
    _newSearchResponseLoader: function(loaderConfig) {
        return new Portal.ui.search.data.GeoNetworkSearchResponseLoader(loaderConfig);
    },

    hasFacetNode: function(facetName) {
        return this._getFacetNode(facetName) != null;
    },

    getFacetNode: function(facetName) {
        if (this.hasFacetNode(facetName)) {
            return this._getFacetNode(facetName).clone(true);
        } else {
            return null;
        }
    },

    _getFacetNode: function(facetName) {
        return this._searchResultRootNode.findChildBy(function(node) {
            return node.attributes.tagName == 'dimension' && node.attributes.value == facetName;
        }, this, true);
    },

    goToPage: function(start, limit) {
        var page = {from: start, to: start + limit - 1};
        this._search(page);
    },

    removeFilters: function(filterPattern) {

        var filters = this.searchFilters.query('name', filterPattern);
        this.searchFilters.remove(filters.items);

        this.fireEvent( 'filterremoved' );
    },

    removeDrilldownFilters: function(facetName) {

        var filters = this.searchFilters.queryBy( function(record) {
            var recordVal = decodeURIComponent(record.get('value'));
            return (record.get('name') == this.DRILLDOWN_PARAMETER_NAME && recordVal.startsWith(decodeURIComponent(facetName)));
        }, this);

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

    filterCount: function() {
        return this.searchFilters.getCount();
    },

    hasDrilldown: function(categories) {
        var drilldownFilter = this._toDrilldownFilter(categories);

        var drilldownFilterIndex = this.searchFilters.findBy(function (record) {
            return record.get('name') == this.DRILLDOWN_PARAMETER_NAME && record.get('value') == drilldownFilter;
        }, this);

        return drilldownFilterIndex >= 0;
    },

    _toDrilldownFilter: function(categories) {
        var encodedCategories = [];

        Ext4.each(categories, function(category) {
            encodedCategories.push(encodeURIComponent(category));
        });

        return encodedCategories.join('/');
    },

    _onSuccessfulSearch: function(page, caller, node, response) {
        this.fireEvent('searchcomplete', response.responseXML, page);
    },

    _logAndReturnErrors: function(response, options) {
        this.fireEvent('searcherror', response);
    },

    // Build request url to use from catalogUrl and filters
    _getRequestUrl: function(page) {
        var params = this._getParams(page);

        var searchUrl = this.catalogUrl + '/srv/eng/' + this.serviceUrl;

        return searchUrl  + '?' + Ext4.urlEncode(params);
    },

    // This function will get only the deepest facets a user has searched for.
    // For instance an array like:
    // [ "facet1/facet2", "facet1", "facet3", "facet3/facet4" ]
    // Will return:
    // [ "facet1/facet2", "facet3/facet4" ]
    getDeepestFacets: function(facets) {
        facets = facets.sort();
        var deepestFacets = [];

        // Search for the deepest facet in the whole sorted array, then push it
        // to deepestFacets if it's not already there
        for(var i = 0; i < facets.length; i++) {
            var deepestFacet = facets[i];

            for(var j = 0; j < facets.length; j++) {
                if (facets[j].startsWith(deepestFacet) &&
                    facets[j].length > deepestFacet.length) {
                    deepestFacet = facets[j];
                }
            }

            if (-1 == deepestFacets.indexOf(deepestFacet)) {
                deepestFacets.push(deepestFacet);
            }
        }

        return deepestFacets;
    },

    _getParams: function(page) {
        //--- Add search defaults (e.g. map layers only)
        var params = Ext4.apply({}, this.defaultParams);

        //--- Add paging params
        Ext4.apply(params, page);

        //--- Add current search filters
        this.searchFilters.each(function(rec) {
            var name = rec.get('name');
            var param = params[name];
            var value = rec.get('value');

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
        Ext4.apply(params, this.baseParams);

        return params;
    }
});
