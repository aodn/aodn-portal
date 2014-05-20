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
    PARAMS_DATE_FORMAT: 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]',

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
        else if (layer.gogoduckLayerName) {
            name = layer.gogoduckLayerName;
        }

        return name;
    },

    generateUrl: function(params, email) {
        var args = {
            layerName: params.layerName,
            emailAddress: email,
            subsetDescriptor: {
                temporalExtent: {
                    start: this._formatDate(params.dateRangeStart),
                    end: this._formatDate(params.dateRangeEnd)
                },
                spatialExtent: {
                    north: (params.latitudeRangeEnd || params.productLatitudeRangeEnd),
                    south: (params.latitudeRangeStart || params.productLatitudeRangeStart),
                    east: (params.longitudeRangeEnd || params.productLongitudeRangeEnd),
                    west: (params.longitudeRangeStart || params.productLongitudeRangeStart)
                }
            }
        };

        var paramsAsJson = Ext.util.JSON.encode(args);

        return String.format('gogoduck/registerJob?jobParameters={0}', encodeURIComponent(paramsAsJson));
    },

    _formatDate: function(date) {

        return date.format(this.PARAMS_DATE_FORMAT);
    }
});
