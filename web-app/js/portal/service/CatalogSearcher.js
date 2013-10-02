
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.service');

Portal.service.CatalogSearcher = Ext.extend(Ext.util.Observable, {
    constructor: function(cfg) {
        var defaults = {
            serviceUrl: 'xml.search.summary',
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

        Ext.apply(this, config);  // Not done in Observable's constructor for some reason

        Portal.service.CatalogSearcher.superclass.constructor.call(this, config);

        this.addEvents('searchstart', 'searchcomplete', 'searcherror', 'filteradded', 'filterremoved');
    },

    reset: function() {
        this.searchFilters.removeAll();
    },

    search: function(summaryOnly) {
        var page = {from: 1, to: this.pageSize};
        this._search(page, summaryOnly);
    },

    _search: function(page, summaryOnly) {

        this.fireEvent('searchstart');
        var requestUrl = this._getRequestUrl(page, summaryOnly);

        Ext.Ajax.request({
            url: requestUrl,
            success: summaryOnly ? this._onSuccessfulSummarySearch : this._onSuccessfulSearch,
            failure: this._logAndReturnErrors,
            page: page,
            scope: this,
            defaultHeaders: {
                'Content-Type': 'application/xml'
            }
        });
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

    _onSuccessfulSummarySearch: function(response, options) {

        this.fireEvent('summaryOnlySearchComplete', response.responseXML, options.page);
    },

    _logAndReturnErrors: function(response, options) {
        this.fireEvent('searcherror', response);
    },

    // Build request url to use from proxyUrl, catalogUrl and filters
    _getRequestUrl: function(page, summaryOnly) {
        var params = this._getParams(page, summaryOnly);

        var searchProvider = (params['geometry']) ? this.spatialSearchUrl : this.catalogUrl + '/srv/eng/' + this.serviceUrl;
        return this.proxyUrl + encodeURIComponent(searchProvider  + '?' + Ext.urlEncode(params));
    },

    _getParams: function(page, summaryOnly) {
        //--- Add search defaults (e.g. map layers only)
        var params = Ext.apply({}, this.defaultParams);

        //--- Add paging params
        Ext.apply(params, page);

        //--- Add current search filters
        this.searchFilters.each(function(rec){
            name = rec.get('name');
            param = params[name];
            value = rec.get('value');

            if(Ext.isDefined(param)){
                if(Ext.isArray(param)){
                    params[name].push(value);
                }else{
                    params[name] = [param, value];
                }
            }else{
                params[name] = value;
            }
        });

        //--- Add required base parameters (e.g. fast=index)
        Ext.apply(params, this.baseParams);

        //--- Only return summary info if requested
        if (summaryOnly) {
            params[Portal.service.CatalogSearcher.BUILD_SUMMARY_ONLY] = true;
        }

        return params;
    }

});

Portal.service.CatalogSearcher.BUILD_SUMMARY_ONLY = 'summaryOnly';
