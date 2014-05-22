/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.data');

Portal.data.AodaacAggregator = Ext.extend(Portal.data.Aggregator, {

    PARAMS_DATE_FORMAT: 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]',

    supportsSubsettedNetCdf: function() {
        return true;
    },

    buildParams: function(selectedLayer, dateRangeStart, dateRangeEnd, geometry) {
        var product = selectedLayer.aodaacProducts[0];

        if (product) {

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
        }

        return null;

    },

    _getMin: function(values) {

        return values[0];
    },

    _getMax: function(values) {

        return values[1];
    },

    generateUrl: function(params) {
        var format = 'nc';

        var args = "outputFormat=" + format;
        args += "&dateRangeStart=" + encodeURIComponent(this._formatDate(params.dateRangeStart));
        args += "&dateRangeEnd=" + encodeURIComponent(this._formatDate(params.dateRangeEnd));
        args += "&latitudeRangeStart=" + (params.latitudeRangeStart || params.productLatitudeRangeStart);
        args += "&latitudeRangeEnd=" + (params.latitudeRangeEnd || params.productLatitudeRangeEnd);
        args += "&longitudeRangeStart=" + (params.longitudeRangeStart || params.productLongitudeRangeStart);
        args += "&longitudeRangeEnd=" + (params.longitudeRangeEnd || params.productLongitudeRangeEnd);
        args += "&productId=" + params.productId;
        args += "&notificationEmailAddress=" + params.emailAddress;

        return 'aodaac/createJob?' + args;
    },

    _formatDate: function(date) {

        return date.format(this.PARAMS_DATE_FORMAT);
    }
});
