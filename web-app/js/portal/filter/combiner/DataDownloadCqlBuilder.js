

Ext.namespace('Portal.filter.combiner');

Portal.filter.combiner.DataDownloadCqlBuilder = Ext.extend(Portal.filter.combiner.FilterCqlBuilder, {

    buildCql: function() {

        var cqlParts = this._filtersWithValues().map(function(filter) {

            var isDateFilter = (filter.constructor == Portal.filter.DateFilter);

            if (isDateFilter) {

                return filter.getDateDataCql();
            }

            return filter.getCql();
        });

        return this._joinCql(cqlParts);
    }
});
