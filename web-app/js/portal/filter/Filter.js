/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.filter');

Portal.filter.Filter = Ext.extend(Object, {

    constructor: function(filterDetail, layer) {

        this.layer = layer;
        this.filterName = filterDetail.name;
        this.displayLabel = filterDetail.label;
        this.filterType = filterDetail.type;
        this.sortOrder = filterDetail.sortOrder;
        this.visualised = filterDetail.visualised;
        this.range = [];
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

    getDisplayLabel: function() {

        return this.displayLabel;
    },

    getFilterType: function() {

        return this.filterType;
    },

    getSortOrder: function() {

        return this.sortOrder;
    },

    getLayer: function() {

        return this.layer;
    },

    getVisualisation: function() {

        return this.visualised;
    },

    _callback: function(scope, range) {

        console.log(scope);
        console.log(range);

        scope.range = range;
    }
});
