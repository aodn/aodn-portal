/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext4.namespace('Portal.filter.combiner');

Portal.filter.combiner.HumanReadableFilterDescriber = Ext.extend(Portal.filter.combiner.BaseFilterCombiner, {

    buildDescription: function(joiner) {

        var filterDescriptions = this._filtersWithValues().map(function(filter) {

            return filter.getHumanReadableForm();
        });

        return this._join(filterDescriptions, joiner);
    }
});
