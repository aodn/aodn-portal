/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.cart');

Portal.cart.AodaacDownloadHandler = Ext.extend(Object, {

    DATE_FORMAT_FOR_PORTAL: 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]',
    DEFAULT_LAT_START: -90,
    DEFAULT_LAT_END:    90,
    DEFAULT_LON_START:   0,
    DEFAULT_LON_END:   180,

    constructor: function(onlineResource) {

        this.onlineResource = onlineResource;
    },

    getDownloadOptions: function() {

        var downloadOptions = [];

        if (this._hasRequiredInfo()) {

            downloadOptions.push({
                textKey: 'downloadAsSubsettedNetCdfLabel',
                handler: this._getClickHandler(),
                handlerParams: { // TODO - DN: Why pass these through? Could just use them here!
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

        var _this = this;

        return function(collection, handlerParams) {

            console.log('handlerParams');
            console.log(handlerParams);

            return _this._buildAodaacUrl(
                collection.ncwmsParams,
                _this.onlineResource.name,
                handlerParams.outputFormat,
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
            longitudeRangeStart: aggregationParams.longitudeRangeStart || this.DEFAULT_LON_START,
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
    },

    _formatDate: function(date) {

        return date.format(this.DATE_FORMAT_FOR_PORTAL);
    }
});
