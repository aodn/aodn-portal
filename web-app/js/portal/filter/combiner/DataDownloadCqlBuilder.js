Ext.namespace('Portal.filter.combiner');

Portal.filter.combiner.DataDownloadCqlBuilder = Ext.extend(Portal.filter.combiner.FilterCqlBuilder, {

    buildCql: function() {

        var cqlParts = this._filtersWithValues().map(function(filter) {

            if (filter.constructor == Portal.filter.DateFilter) {
                return filter.getFormattedFilterValueWithTimeRange();
            }

            return filter.getFormattedFilterValue();
        });

        return this._joinCql(cqlParts);
    }
});
