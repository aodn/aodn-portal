Ext.namespace('Portal.filter.combiner');

Portal.filter.combiner.BaseFilterCombiner = Ext.extend(Object, {

    constructor: function(cfg) {

        Ext.apply(this, cfg);

        Portal.filter.combiner.BaseFilterCombiner.superclass.constructor.call(this, cfg);
    },

    _allFilters: function() {
        return this.filters || [];
    },

    _filtersWithValues: function() {

        var hasValue = function(filter) { return filter.hasValue() };

        return this._allFilters().filter(hasValue);
    },

    _visualisedFiltersWithValues: function() {

        var isVisualised = function(filter) { return filter.isVisualised() };

        return this._filtersWithValues().filter(isVisualised);
    },

    _join: function(parts, joiner) {

        return parts.length > 0 ? parts.join(joiner) : null;
    }
});
