/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.cart');

Portal.cart.AodaacDownloadHandler = Ext.extend(Portal.cart.DownloadHandler, {

    ASYNC_DOWNLOAD_URL: 'asyncDownload?aggregatorService=aodaac&',

    getDownloadOptions: function() {

        var downloadOptions = [];

        if (this._hasRequiredInfo()) {

            downloadOptions.push({
                textKey: 'downloadAsSubsettedNetCdfLabel',
                handler: this._getUrlGeneratorFunction(),
                handlerParams: {
                    asyncDownload: true,
                    collectEmailAddress: true
                }
            });
        }

        return downloadOptions;
    },

    _hasRequiredInfo: function() {

        return this._resourceNameNotEmpty();
    },

    _getUrlGeneratorFunction: function() {

        var _this = this;

        return function(collection, handlerParams) {

            var aodaacUrl = _this._buildAodaacUrl(
                collection.ncwmsParams,
                _this._resourceName(),
                'nc',
                handlerParams.emailAddress
            );

            if (handlerParams.challengeResponse) {
                aodaacUrl += String.format("&challengeResponse={0}", encodeURIComponent(handlerParams.challengeResponse));
            }

            return aodaacUrl;
        };
    },

    _buildAodaacUrl: function(aggregationParams, productId, outputFormat, notificationEmailAddress) {

        var args = {
            dateRangeStart: this._formatDate(aggregationParams.dateRangeStart),
            dateRangeEnd: this._formatDate(aggregationParams.dateRangeEnd),
            latitudeRangeStart: aggregationParams.latitudeRangeStart || this.DEFAULT_LAT_START,
            latitudeRangeEnd: aggregationParams.latitudeRangeEnd || this.DEFAULT_LAT_END,
            longitudeRangeStart: aggregationParams.longitudeRangeStart || this.DEFAULT_LON_START,
            longitudeRangeEnd: aggregationParams.longitudeRangeEnd || this.DEFAULT_LON_END,
            productId: productId,
            outputFormat: outputFormat,
            notificationEmailAddress: notificationEmailAddress
        };

        return this.ASYNC_DOWNLOAD_URL + this._makeQueryString(args);
    },

    _makeQueryString: function(args) {

        var elements = [];

        Ext.each(Object.keys(args), function(key) {

                var encValue = encodeURIComponent(args[key]);

                elements.push(String.format("{0}={1}", key, encValue));
            }
        );

        return elements.join("&");
    }
});
