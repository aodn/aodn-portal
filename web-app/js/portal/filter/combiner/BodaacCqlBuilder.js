/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.filter.combiner');

Portal.filter.combiner.BodaacCqlBuilder = Ext.extend(Portal.filter.combiner.FilterCqlBuilder, {

    buildCql: function() {

        var cqlParts = this._collect(this._visualisedFiltersWithValues(), function(filter) {

            return filter.getMapLayerCql();
        });

        return this._joinCql(cqlParts);
    }
});
