/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.filter');

Portal.filter.CollectionFilters = Ext.extend(Object, {

    constructor: function(collection) {

        this.collection = collection;
        this.filterObjects = [];
    },

    getFilters: function() {

        var filterService  = new Portal.filter.FilterService();

        this.filterObjects = filterService.getFilters(this.collection, this._callback, this);
    },

    _callback: function(scope, filterDetails) {

        var filterObjects = [];

        Ext.each(filterDetails, function(filterDetail) {

            var newFilterObject = new Portal.filter.Filter(filterDetail, this.collection);

            filterObjects.push(newFilterObject);
        });

        return filterObjects;
    },

    getFilterObjects: function() {

        return this.filterObjects;
    },

    getCollection: function() {

        return this.collection;
    }
});