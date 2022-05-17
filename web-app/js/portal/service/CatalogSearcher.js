Ext.namespace('Portal.service');

Portal.service.CatalogSearcher = Ext.extend(Ext.util.Observable, {
    DRILLDOWN_PARAMETER_NAME: "facet.q",

    constructor: function(cfg) {
        var defaults = {
            serviceUrl: Portal.app.appConfig.geonetwork.searchPath,
            baseParams: {
                fast: 'index'
            },
            defaultParams: {},
            pageSize: Portal.app.appConfig.geonetwork.pageSize
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
            url: Ext.ux.Ajax.constructProxyUrl(requestUrl),
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
    // MetadataSearchResponseLoader's constructor.
    _newSearchResponseLoader: function(loaderConfig) {
        return new Portal.ui.search.data.MetadataSearchResponseLoader(loaderConfig);
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
            if (Portal.app.appConfig.geonetwork.version === 3) {
                return node.attributes.tagName == 'dimension' && node.attributes.name == facetName;
            } else {
                return node.attributes.tagName == 'dimension' && node.attributes.value == facetName;
            }
        }, this, true);
    },

    goToPage: function(start) {
        var page = {from: start, to: start + this.pageSize -1 };
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

    getFilterValue: function(filterName) {

        var idx = this.searchFilters.findBy( function( record ) {
            return record.get('name') == filterName;
        } );
        return idx > -1 ? this.searchFilters[idx] : undefined ;
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

        Ext.each(categories, function(category) {
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

        return searchUrl  + '?' + Ext.urlEncode(params);
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

    _getCollectionAvailabilityParams: function(url) {
        var getParams = url.split("#")[0].split("?");
        var params = Ext.urlDecode(getParams[1]);
        var filters = {};

        if (params.health === "good") {
            filters = { filters: "collectionavailability" };
        }
        else if (params.health === "bad") {
            filters = { filters: "!collectionavailability" };
        }
        else if (params.health === "all") {
            filters = {};
        }
        else if (Portal.app.appConfig.featureToggles.geonetworkLinkMonitor == true) {
            filters = { filters: "collectionavailability" };
        }

        return filters;
    },

    _getParams: function(page) {
        //--- Add search defaults (e.g. map layers only)
        var params = Ext.apply({}, this.defaultParams);

        //--- Add paging params
        Ext.apply(params, page);

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
        Ext.apply(params, this.baseParams);
        Ext.apply(params, this._getCollectionAvailabilityParams(document.URL));

        return params;
    }
});
