Ext.namespace('Portal.filter.combiner');

Portal.filter.combiner.GaParametersBuilder = Ext.extend(Portal.filter.combiner.BaseFilterCombiner, {

    buildParameters: function() {

        var geomFilter = this.filters.map(function(filter) {

            if (filter.constructor == Portal.filter.GeometryFilter) {
                return filter;
            }
        });

        return this.buildSpatialParameters(geomFilter[0]);
    },

    buildSpatialParameters: function(geomFilter) {

        var bounds =  (geomFilter.value != undefined) ? geomFilter.value.getBounds() : geomFilter.map.getExtent();
        return {
            bbox: bounds.toBBOX(),
            width: this.resizeToNumber(bounds.getWidth()),
            height: this.resizeToNumber(bounds.getHeight())
        }
    },

    resizeToNumber: function(pixels) {

        return Math.round(pixels);

    }
});
