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

    loadFilters: function(callbackFunction, callbackScope) {
        alert("bloody collection filters fuck off");

        var filterService  = new Portal.filter.FilterService();

        filterService.getFilters(this.collection, this._callback, this);
    },

    _callback: function(scope, filterDetails) {

        var filterObjects = [];
        var collection = scope.collection;

        Ext.each(filterDetails, function(filterDetail) {

            var newFilterObject = new Portal.filter.Filter(filterDetail, collection);

            filterObjects.push(newFilterObject);
        });

        scope.filterObjects = filterObjects;
    },

    getFilterObjects: function() {

        return this.filterObjects;
    },

    getCollection: function() {

        return this.collection;
    }
});