/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.filter.combiner');

Portal.filter.combiner.BaseFilterCombiner = Ext.extend(Object, {

    constructor: function(cfg) {

        Ext.apply(this, cfg);

        Portal.filter.combiner.BaseFilterCombiner.superclass.constructor.call(this, cfg);
    },

    _allFilters: function() {

        return this.layer.filters;
    },

    _filtersWithValues: function() {

        var hasValue = function(filter) { return filter.hasValue() };

        return this._matchingFilters(this._allFilters(), hasValue);
    },

    _visualisedFiltersWithValues: function() {

        var isVisualised = function(filter) { return filter.isVisualised() };

        return this._matchingFilters(this._filtersWithValues(), isVisualised);
    },

    _matchingFilters: function(filters, matcher) {

        return this._collect(filters, function(filter) {

            return matcher(filter) ? filter : null;
        });
     },

    _collect: function(filters, fn) {

        var values = [];

        Ext.each(filters, function(filter) {

            var value = fn(filter);

            if (value) {

                values.push(value);
            }
        });

        return values;
    },

    _join: function(parts, joiner) {

        return parts.length > 0 ? parts.join(joiner) : null;
    }
});
