Ext.namespace('Portal.filter.combiner');

Portal.filter.combiner.FilterCqlBuilder = Ext.extend(Portal.filter.combiner.BaseFilterCombiner, {

    _joinCql: function(parts) {

        return this._join(parts, ' AND ');
    }
});
