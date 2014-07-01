/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.cart');

Portal.cart.AodaacDownloadHandler = Ext.extend(Object, {

    DATE_FORMAT_FOR_PORTAL: 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]',

    constructor: function(onlineResource) {

        this.onlineResource = onlineResource;
    },

    getDownloadOptions: function() {

        var downloadOptions = [];

        if (this._hasRequiredInfo()) {

            downloadOptions.push({
                textKey: 'downloadAsSubsettedNetCdfLabel',
                handler: this._getClickHandler(),
                handlerParams: {
                    outputFormat: 'nc',
                    asyncDownload: true,
                    collectEmailAddress: true
                }
            });
        }

        return downloadOptions;
    },

    _hasRequiredInfo: function() {

        return this.onlineResource.name && this.onlineResource.name != "";
    },

    _getClickHandler: function() {

        var productId = this.onlineResource.name;
        var serverUrl = this.onlineResource.href;

        var _this = this;

        return function(collection, params) {

            return _this._buildAodaacUrl(collection.ncwmsParams, params.outputFormat, params.emailAddress);
        };
    },

    _buildAodaacUrl: function(aggregationParams, outputFormat, notificationEmailAddress) {

        var args = {
            dateRangeStart: this._formatDate(aggregationParams.dateRangeStart),
            dateRangeEnd: this._formatDate(aggregationParams.dateRangeEnd),
            latitudeRangeStart: aggregationParams.latitudeRangeStart || aggregationParams.productLatitudeRangeStart,
            latitudeRangeEnd: aggregationParams.latitudeRangeEnd || aggregationParams.productLatitudeRangeEnd,
            longitudeRangeStart: aggregationParams.longitudeRangeStart || aggregationParams.productLongitudeRangeStart,
            longitudeRangeEnd: aggregationParams.longitudeRangeEnd || aggregationParams.productLongitudeRangeEnd,
            productId: aggregationParams.productId,
            output: outputFormat,
            notificationEmailAddress: notificationEmailAddress
        };

        return 'aodaac/createJob?' + this._makeQueryString(args);
    },

    _makeQueryString: function(args) {

        var elements = [];

        Ext.each(Object.keys(args), function(key) {

                var encValue = encodeURIComponent(args[key]);

                elements.push(String.format("{0}={1}", key, encValue));
            }
        );

        return elements.join("&");
    },

    _formatDate: function(date) {

        return date.format(this.DATE_FORMAT_FOR_PORTAL);
    }
});
