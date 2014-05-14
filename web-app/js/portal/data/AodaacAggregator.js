/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.data');

Portal.data.AodaacAggregator = Ext.extend(Portal.data.Aggregator, {

    supportsSubsettedNetCdf: function() {
        return true;
    },

    buildParams: function(selectedLayer, dateRangeStart, dateRangeEnd, geometry) {
        var product = selectedLayer.aodaacProducts[0];
        var productExtents = product.extents;

        var aodaacConfig = {
            productId: product.id,
            dateRangeStart: dateRangeStart,
            dateRangeEnd:   dateRangeEnd,
            productLatitudeRangeStart:  this._getMin(productExtents.lat),
            productLatitudeRangeEnd:    this._getMax(productExtents.lat),
            productLongitudeRangeStart: this._getMin(productExtents.lon),
            productLongitudeRangeEnd:   this._getMax(productExtents.lon)
        };

        if (geometry) {
            var bounds = geometry.getBounds();

            aodaacConfig.latitudeRangeStart  = bounds.bottom;
            aodaacConfig.longitudeRangeStart = bounds.left;
            aodaacConfig.latitudeRangeEnd    = bounds.top;
            aodaacConfig.longitudeRangeEnd   = bounds.right;
        }

        return aodaacConfig;
    },

    _getMin: function(values) {

        return values[0];
    },

    _getMax: function(values) {

        return values[1];
    }
});
