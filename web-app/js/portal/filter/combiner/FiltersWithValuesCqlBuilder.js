Ext.namespace('Portal.filter.combiner');

Portal.filter.combiner.FiltersWithValuesCqlBuilder = Ext.extend(Portal.filter.combiner.FilterCqlBuilder, {


    buildCql: function() {

        var cqlParts = this._filtersWithValues().map(function(filter) {

            return filter.getCql();
        });

        return this._joinCql(cqlParts);
    }
});