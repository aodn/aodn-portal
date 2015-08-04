

Ext.namespace('Portal.filter.combiner');

Portal.filter.combiner.BodaacCqlBuilder = Ext.extend(Portal.filter.combiner.FilterCqlBuilder, {

    buildCql: function() {

        var cqlParts = this._visualisedFiltersWithValues().map(function(filter) {

            return filter.getCql();
        });

        return this._joinCql(cqlParts);
    }
});
