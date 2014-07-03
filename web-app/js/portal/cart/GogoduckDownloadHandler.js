/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.cart');

Portal.cart.GogoduckDownloadHandler = Ext.extend(Portal.cart.DownloadHandler, {

    getDownloadOptions: function() {

        var downloadOptions = [];

        if (this._hasRequiredInfo()) {

            downloadOptions.push({
                textKey: 'downloadAsSubsettedNetCdfLabel',
                handler: this._getClickHandler(),
                handlerParams: {
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

        var layerName = this.onlineResource.name;
        var serverUrl = this.onlineResource.href;

        var _this = this;

        return function(collection, handlerParams) {

            console.log('handlerParams');
            console.log(handlerParams);

            console.log('collection.ncwmsParams');
            console.log(collection.ncwmsParams);

            return _this._buildGogoduckUrl(collection.ncwmsParams, layerName, serverUrl, handlerParams.emailAddress);
        };
    },

    _buildGogoduckUrl: function(aggregationParams, layerName, serverUrl, notificationEmailAddress) {

        var args = {
            layerName: layerName,
            emailAddress: notificationEmailAddress,
            geoserver: serverUrl,
            subsetDescriptor: {
                temporalExtent: {
                    start: this._formatDate(aggregationParams.dateRangeStart),
                    end: this._formatDate(aggregationParams.dateRangeEnd)
                },
                spatialExtent: {
                    north: (aggregationParams.latitudeRangeEnd || this.DEFAULT_LAT_END),
                    south: (aggregationParams.latitudeRangeStart || this.DEFAULT_LAT_START),
                    east: (aggregationParams.longitudeRangeEnd || this.DEFAULT_LON_END),
                    west: (aggregationParams.longitudeRangeStart || this.DEFAULT_LON_START)
                }
            }
        };

        var paramsAsJson = Ext.util.JSON.encode(args);

        return String.format('gogoduck/registerJob?jobParameters={0}', encodeURIComponent(paramsAsJson));
    }
});
