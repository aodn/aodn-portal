Ext.namespace('Portal.filter.combiner');

Portal.filter.combiner.WcsParametersBuilder = Ext.extend(Portal.filter.combiner.BaseFilterCombiner, {

    buildWCSParameters: function(layerName) {

        var geomFilter = this.filters.map(function(filter) {

            if (filter.constructor == Portal.filter.GeometryFilter) {
                return filter;
            }
        });

        return this.buildParameters(geomFilter[0], layerName);
    },

    buildParameters: function(geomFilter) {

        return (geomFilter.value != undefined) ? geomFilter.value.getBounds().toBBOX() : geomFilter.map.getExtent().toBBOX();
    }
});
