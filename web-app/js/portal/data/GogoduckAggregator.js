/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.data');

Portal.data.GogoduckAggregator = Ext.extend(Portal.data.Aggregator, {

    LONG_MIN: -180,
    LONG_MAX: 180,
    LAT_MIN: -90,
    LAT_MAX: 90,

    supportsSubsettedNetCdf: function() {
        return true;
    },

    buildParams: function(selectedLayer, dateRangeStart, dateRangeEnd, geometry) {
        var ncwmsConfig = {
            layerName: this.getWfsLayerName(selectedLayer),
            dateRangeStart: dateRangeStart,
            dateRangeEnd: dateRangeEnd,
            productLatitudeRangeStart: this.LAT_MIN,
            productLongitudeRangeStart: this.LONG_MIN,
            productLatitudeRangeEnd: this.LAT_MAX,
            productLongitudeRangeEnd: this.LONG_MAX
        };

        if (geometry) {
            var bounds = geometry.getBounds();

            ncwmsConfig.latitudeRangeStart = bounds.bottom;
            ncwmsConfig.longitudeRangeStart = bounds.left;
            ncwmsConfig.latitudeRangeEnd = bounds.top;
            ncwmsConfig.longitudeRangeEnd = bounds.right;
        }

        return ncwmsConfig;
    },

    getWfsLayerName: function(layer) {

        var name;

        if (layer.wfsLayer) {
            name = layer.wfsLayer.name;
        }

        return name;
    }
});
