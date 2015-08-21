/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.cart');

Portal.cart.GogoduckDownloadHandler = Ext.extend(Portal.cart.DownloadHandler, {

    ASYNC_DOWNLOAD_URL: 'asyncDownload?aggregatorService=gogoduck&',

    getDownloadOptions: function() {

        var downloadOptions = [];

        if (this._hasRequiredInfo()) {

            downloadOptions.push({
                textKey: 'downloadAsSubsettedNetCdfLabel',
                handler: this._getUrlGeneratorFunction(),
                handlerParams: {
                    asyncDownload: true,
                    collectEmailAddress: true,
                    serviceResponseHandler: this.serviceResponseHandler
                }
            });
        }

        return downloadOptions;
    },

    _hasRequiredInfo: function() {

        return this._resourceHrefNotEmpty() && this._resourceNameNotEmpty();
    },

    serviceResponseHandler: function(response) {
        var msg = "";

        if (response) {
            try {
                var responseJson = JSON.parse(response);
                if (responseJson['url']) {
                    msg = OpenLayers.i18n('gogoduckServiceMsg', {
                        url: responseJson['url']
                    });
                }
            }
            catch (e) {
                log.error(String.format("Could not parse Gogoduck response: '{0}'", response));
            }
        }

        return msg;
    },

    _getUrlGeneratorFunction: function() {

        var _this = this;

        return function(collection, handlerParams) {

            var gogoduckUrl = _this._buildGogoduckUrl(
                collection.getFilters(),
                _this._resourceName(),
                _this._resourceHref(),
                handlerParams.emailAddress
            );

            if (handlerParams.challengeResponse) {
                gogoduckUrl += String.format("&challengeResponse={0}", encodeURIComponent(handlerParams.challengeResponse));
            }

            return gogoduckUrl;
        };
    },

    _buildGogoduckUrl: function(filters, layerName, serverUrl, notificationEmailAddress) {
        var aggregationParams = filters.filter(function(filter) {
            return filter.isNcwmsParams;
        })[0];

        var args = {
            layerName: layerName,
            emailAddress: notificationEmailAddress,
            geoserver: serverUrl,
            subsetDescriptor: {
                temporalExtent: {
                    start: this._formatDate(aggregationParams.dateRangeStart || this.DEFAULT_DATE_START),
                    end: this._formatDate(aggregationParams.dateRangeEnd || this.DEFAULT_DATE_END)
                },
                spatialExtent: {
                    north: (aggregationParams.latitudeRangeEnd || this.DEFAULT_LAT_END),
                    south: (aggregationParams.latitudeRangeStart || this.DEFAULT_LAT_START),
                    east: (aggregationParams.longitudeRangeEnd || this.DEFAULT_LON_END),
                    west: (aggregationParams.longitudeRangeStart || this.DEFAULT_LON_START)
                }
            }
        };

        this._trackUsage(layerName, args.subsetDescriptor);

        var paramsAsJson = Ext.util.JSON.encode(args);

        return String.format(this.ASYNC_DOWNLOAD_URL + 'jobParameters={0}', encodeURIComponent(paramsAsJson));
    },

    _trackUsage: function(layerName, subsetDescriptor) {
        trackDownloadUsage(
            OpenLayers.i18n('gogoduckTrackingLabel'),
            layerName,
            String.format("TIME:{0},{1} LAT:{2},{3} LON:{4},{5}",
                subsetDescriptor.temporalExtent.start,
                subsetDescriptor.temporalExtent.end,
                subsetDescriptor.spatialExtent.south,
                subsetDescriptor.spatialExtent.north,
                subsetDescriptor.spatialExtent.west,
                subsetDescriptor.spatialExtent.east)
        );
    }
});
