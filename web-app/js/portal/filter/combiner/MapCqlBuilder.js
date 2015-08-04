Ext.namespace('Portal.filter.combiner');

Portal.filter.combiner.MapCqlBuilder = Ext.extend(Portal.filter.combiner.FilterCqlBuilder, {

    _appropriateFilters: function() {

        return this._visualisedFiltersWithValues().filter(function(filter) {

            var isGeomemtryFilter = (filter.constructor == Portal.filter.GeometryFilter);

            return !isGeomemtryFilter;
        });
    },

    buildCql: function() {

        var cqlParts = this._appropriateFilters().map(function(filter) {

            return filter.getCql();
        });

        return this._joinCql(cqlParts);
    }
});
