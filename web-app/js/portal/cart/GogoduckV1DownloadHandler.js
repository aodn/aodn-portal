Ext.namespace('Portal.cart');

Portal.cart.GogoduckV1DownloadHandler = Ext.extend(Portal.cart.AsyncDownloadHandler, {

    _getDownloadOptionTextKey: function() {
        return 'downloadAsSubsettedNetCdfLabel';
    },

    _getDownloadOptionTitle: function() {
        return 'GoGoDuckV1';
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

        var paramsAsJson = Ext.util.JSON.encode(args);

        return String.format(this.getAsyncDownloadUrl('gogoduck') + 'jobParameters={0}', encodeURIComponent(paramsAsJson));
    }
});
