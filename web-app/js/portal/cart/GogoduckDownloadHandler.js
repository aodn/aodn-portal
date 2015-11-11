Ext.namespace('Portal.cart');

Portal.cart.GogoduckDownloadHandler = Ext.extend(Portal.cart.AsyncDownloadHandler, {

    SUBSET_FORMAT: 'TIME,{0},{1};LATITUDE,{2},{3};LONGITUDE,{4},{5}',

    getDownloadOptions: function() {
        return Portal.cart.GogoduckDownloadHandler.superclass.getDownloadOptions.call(this, 'downloadAsSubsettedNetCdfLabel');
    },

    _buildServiceUrl: function(filters, layerName, serverUrl, notificationEmailAddress) {

        var aggregationParams = filters.filter(function(filter) {
            return filter.isNcwmsParams;
        })[0];

        var subset = String.format(
            this.SUBSET_FORMAT,
            this._formatDate(aggregationParams.dateRangeStart || this.DEFAULT_DATE_START),
            this._formatDate(aggregationParams.dateRangeEnd || this.DEFAULT_DATE_END),
            aggregationParams.latitudeRangeStart || this.DEFAULT_LAT_START,
            aggregationParams.latitudeRangeEnd || this.DEFAULT_LAT_END,
            aggregationParams.longitudeRangeStart || this.DEFAULT_LON_START,
            aggregationParams.longitudeRangeEnd || this.DEFAULT_LON_END
        );

        var jobParameters = {
            server: serverUrl,
            'email.to': notificationEmailAddress,
            jobType: 'GoGoDuck',
            'jobParameters.layer': layerName,
            'jobParameters.subset': subset
        };

        this._trackUsage(layerName, subset);

        return String.format(
            "{0}{1}",
            this.getAsyncDownloadUrl('wps'),
            Ext.urlEncode(jobParameters)
        );
    },

    _trackUsage: function(layerName, subset) {
        trackDownloadUsage(
            OpenLayers.i18n('gogoduckTrackingLabel'),
            layerName,
            subset
        );
    }
});
