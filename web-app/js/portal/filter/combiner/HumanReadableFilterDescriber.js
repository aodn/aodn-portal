/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.filter.combiner');

Portal.filter.combiner.HumanReadableFilterDescriber = Ext.extend(Portal.filter.combiner.BaseFilterCombiner, {

    buildDescription: function(joiner) {
        return this._sortFilterDescriptions(this._filtersWithValues(), joiner);
    },

    _sortFilterDescriptions: function(filters, joiner) {
        var filterOrder = [
            Portal.filter.GeometryFilter,
            Portal.filter.DateFilter,
            Portal.filter.BooleanFilter,
            Portal.filter.NumberFilter,
            Portal.filter.StringFilter
        ];

        var typeOrder = function (filter) {
            return filterOrder.indexOf(filter.constructor) * -1;
        };

        var that = this;

        filters.sort(function(firstFilter, secondFilter) {
            var result = that._compareElements(typeOrder(firstFilter), typeOrder(secondFilter));

            if (result == 0) {
                var firstFilterLabel = firstFilter.getLabel();
                var secondFilterLabel = secondFilter.getLabel();
                result = that._compareElements(secondFilterLabel, firstFilterLabel);
            }

            return result;
        });

        var filterDescriptions = filters.map(function(filter) {
            return filter.getHumanReadableForm();
        });

        return this._join(filterDescriptions, joiner);
    },

    _compareElements: function(first, second) {
        var result;

        if (first > second) {
            result = -1;
        }
        else {
            if (first < second) {
                result = 1;
            }
            else {
                result = 0;
            }
        }

        return result;
    }
});
