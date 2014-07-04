/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.cart');

Portal.cart.AodaacDownloadHandler = Ext.extend(Portal.cart.DownloadHandler, {

    AODAAC_DEFAULT_LON_START: 0, // Works around limitation in AODAAC

    getDownloadOptions: function() {

        var downloadOptions = [];

        if (this._hasRequiredInfo()) {

            downloadOptions.push({
                textKey: 'downloadAsSubsettedNetCdfLabel',
                handler: this._getClickHandler()
            });
        }

        return downloadOptions;
    },

    _hasRequiredInfo: function() {

        return this._resourceNameNotEmpty();
    },

    _getClickHandler: function() {

        var _this = this;

        return function(collection, handlerParams) {

            handlerParams.asyncDownload = true;
            handlerParams.collectEmailAddress = true;

            return _this._buildAodaacUrl(
                collection.ncwmsParams,
                _this._resourceName(),
                'nc',
                handlerParams.emailAddress
            );
        };
    },

    _buildAodaacUrl: function(aggregationParams, productId, outputFormat, notificationEmailAddress) {

        console.log('aggregationParams');
        console.log(aggregationParams);

        var args = {
            dateRangeStart: this._formatDate(aggregationParams.dateRangeStart),
            dateRangeEnd: this._formatDate(aggregationParams.dateRangeEnd),
            latitudeRangeStart: aggregationParams.latitudeRangeStart || this.DEFAULT_LAT_START,
            latitudeRangeEnd: aggregationParams.latitudeRangeEnd || this.DEFAULT_LAT_END,
            longitudeRangeStart: aggregationParams.longitudeRangeStart || this.AODAAC_DEFAULT_LON_START,
            longitudeRangeEnd: aggregationParams.longitudeRangeEnd || this.DEFAULT_LON_END,
            productId: productId,
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
    }
});
