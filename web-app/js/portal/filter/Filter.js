/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.filter');

Portal.filter.Filter = Ext.extend(Object, {

    constructor: function(filterDetail, collection) {

        this.collection = collection;
        this.filterName = filterDetail.name;
        this.filterLabel = filterDetail.label;
        this.filterType = filterDetail.type;
        this.sortOrder = filterDetail.sortOrder;
        this.range = [];
    },

    getRange: function() {

        var filterService  = new Portal.filter.FilterService();

        this.range = filterService.getFilterRange(this.filterName, this.collection, this._callback, this);
    },

    setValue: function(value) {

        this.value = value;
    },

    getValue: function() {

        return this.value;
    },

    getFilterName: function() {

        return this.filterName;
    },

    getFilterLabel: function() {

        return this.filterLabel;
    },

    getFilterType: function() {

        return this.filterType;
    },

    getSortOrder: function() {

        return this.sortOrder;
    },

    getCollection: function() {

        return this.collection;
    },

    _callback: function(scope, range) {

        return range;
    }
});
