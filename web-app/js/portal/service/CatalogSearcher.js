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

        // Not done in Observable's constructor for some reason
        Ext.apply(this, config);

        Portal.service.CatalogSearcher.superclass.constructor.call(this, config);

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
