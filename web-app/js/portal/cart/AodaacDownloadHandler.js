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

            // TODO - DN: Check with Edward King
          /*  downloadOptions.push({
                textKey: 'downloadAsHdfLabel',
                handler: this._getClickHandler(),
                handlerParams: {}
            });*/

            // TODO - DN: Needs changes in AODAAC
            /*downloadOptions.push({
                textKey: 'downloadAsUrlsLabel',
                handler: this._getClickHandler(),
                handlerParams: {}
            });*/
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

        var args = [];

        this._addArg(args, "dateRangeStart", this._formatDate(aggregationParams.dateRangeStart));
        this._addArg(args, "dateRangeEnd", this._formatDate(aggregationParams.dateRangeEnd));
        this._addArg(args, "latitudeRangeStart", aggregationParams.latitudeRangeStart || aggregationParams.productLatitudeRangeStart);
        this._addArg(args, "latitudeRangeEnd", aggregationParams.latitudeRangeEnd || aggregationParams.productLatitudeRangeEnd);
        this._addArg(args, "longitudeRangeStart", aggregationParams.longitudeRangeStart || aggregationParams.productLongitudeRangeStart);
        this._addArg(args, "longitudeRangeEnd", aggregationParams.longitudeRangeEnd || aggregationParams.productLongitudeRangeEnd);
        this._addArg(args, "productId", aggregationParams.productId);
        this._addArg(args, "output", outputFormat);
        this._addArg(args, "notificationEmailAddress", notificationEmailAddress);

        return 'aodaac/createJob?' + args.join("&");
    },

    _addArg: function(args, key, value) {

        var encValue = encodeURIComponent(value);

        args.push(String.format('{0}={1}', key, encValue));
    },

    _formatDate: function(date) {

        return date.format(this.DATE_FORMAT_FOR_PORTAL);
    }
});
