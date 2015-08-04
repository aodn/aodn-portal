Ext.namespace('Portal.filter.combiner');

Portal.filter.combiner.HumanReadableFilterDescriber = Ext.extend(Portal.filter.combiner.BaseFilterCombiner, {

    buildDescription: function(joiner) {

        var filterDescriptions = this._filtersWithValues().map(function(filter) {

            return filter.getHumanReadableForm();
        });

        return this._join(filterDescriptions, joiner);
    }
});
