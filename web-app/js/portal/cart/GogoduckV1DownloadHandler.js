Ext.namespace('Portal.cart');

Portal.cart.GogoduckV1DownloadHandler = Ext.extend(Portal.cart.AsyncDownloadHandler, {

    getDownloadOptions: function() {

        var downloadOptions = [];

        if (this._hasRequiredInfo()) {

            downloadOptions.push({
                textKey: this._getDownloadAsCdfKey(),
                handler: this._getUrlGeneratorFunction(),
                handlerParams: {
                    asyncDownload: true,
                    collectEmailAddress: true,
                    serviceResponseHandler: this.serviceResponseHandler
                }
            });

            downloadOptions.push({
                textKey: this._getDownloadAsCsvKey(),
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

    _buildServiceUrl: function(filters, layerName, serverUrl, notificationEmailAddress) {
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
                    north: (aggregationParams.latitudeRangeEnd || this.DEFAULT_LAT_END).toDecimalString(),
                    south: (aggregationParams.latitudeRangeStart || this.DEFAULT_LAT_START).toDecimalString(),
                    east: (aggregationParams.longitudeRangeEnd || this.DEFAULT_LON_END).toDecimalString(),
                    west: (aggregationParams.longitudeRangeStart || this.DEFAULT_LON_START).toDecimalString()
                }
            }
        };

        this._trackUsage(layerName, args.subsetDescriptor);

        var paramsAsJson = Ext.util.JSON.encode(args);

        return String.format(this.getAsyncDownloadUrl('gogoduck') + 'jobParameters={0}', encodeURIComponent(paramsAsJson));
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
