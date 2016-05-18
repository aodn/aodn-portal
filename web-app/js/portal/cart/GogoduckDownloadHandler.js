Ext.namespace('Portal.cart');

Portal.cart.GogoduckDownloadHandler = Ext.extend(Portal.cart.AsyncDownloadHandler, {

    SUBSET_FORMAT: 'TIME,{0},{1};LATITUDE,{2},{3};LONGITUDE,{4},{5}',

    getDownloadOptions: function() {

        var downloadOptions = [];

        if (this._hasRequiredInfo()) {

            downloadOptions.push({
                textKey: this._getDownloadAsCdfKey(),
                handler: this._getUrlGeneratorFunction(),
                handlerParams: {
                    asyncDownload: true,
                    collectEmailAddress: true,
                    serviceResponseHandler: this.serviceResponseHandler,
                    downloadFormat: ''
                }
            });

            downloadOptions.push({
                textKey: this._getDownloadAsCsvKey(),
                handler: this._getUrlGeneratorFunction(),
                handlerParams: {
                    asyncDownload: true,
                    collectEmailAddress: true,
                    serviceResponseHandler: this.serviceResponseHandler,
                    downloadFormat: 'csv'
                }
            });
        }
        return downloadOptions;
    },

    _buildServiceUrl: function(filters, layerName, serverUrl, notificationEmailAddress, format) {

        var subset = this._getSubset(filters);

        var jobParameters = {
            server: serverUrl,
            'email.to': notificationEmailAddress,
            jobType: 'GoGoDuck',
            'jobParameters.layer': layerName,
            'jobParameters.subset': subset,
            'jobParameters.format': format
        };

        return String.format(
            "{0}{1}",
            this.getAsyncDownloadUrl('wps'),
            Ext.urlEncode(jobParameters)
        );
    },

    _getSubset: function(filters) {
        var aggregationParams = filters.filter(function(filter) {
            return filter.isNcwmsParams;
        })[0];

        return String.format(
            this.SUBSET_FORMAT,
            this._formatDate(aggregationParams.dateRangeStart || this.DEFAULT_DATE_START),
            this._formatDate(aggregationParams.dateRangeEnd || this.DEFAULT_DATE_END),
            (aggregationParams.latitudeRangeStart || this.DEFAULT_LAT_START).toDecimalString(),
            (aggregationParams.latitudeRangeEnd || this.DEFAULT_LAT_END).toDecimalString(),
            (aggregationParams.longitudeRangeStart || this.DEFAULT_LON_START).toDecimalString(),
            (aggregationParams.longitudeRangeEnd || this.DEFAULT_LON_END).toDecimalString()
        );
    }
});
