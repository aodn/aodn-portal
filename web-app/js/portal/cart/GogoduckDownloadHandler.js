Ext.namespace('Portal.cart');

Portal.cart.GogoduckDownloadHandler = Ext.extend(Portal.cart.AsyncDownloadHandler, {

    SUBSET_FORMAT: 'TIME,{0},{1};LATITUDE,{2},{3};LONGITUDE,{4},{5}',
    SUBSET_FORMAT_WITHOUT_TIME: 'LATITUDE,{2},{3};LONGITUDE,{4},{5}',

    _getDownloadOptionTextKey: function() {
        return 'downloadAsSubsettedNetCdfLabel';
    },

    _getDownloadOptionTitle: function() {
        return OpenLayers.i18n('downloadNetCDFDownloadServiceAction');
    },

    _showDownloadOptions: function(filters) {
        return this._resourceHrefNotEmpty()
            && this._resourceNameNotEmpty()
            && !Portal.filter.FilterUtils.hasFilter(filters, 'timeSeriesAtPoint');
    },

    _buildServiceUrl: function(filters, layerName, serverUrl, notificationEmailAddress) {

        var subset = this._getSubset(filters);

        var jobParameters = {
            server: serverUrl,
            'email.to': notificationEmailAddress,
            jobType: 'GoGoDuck',
            mimeType: "application/x-netcdf",
            'jobParameters.layer': layerName,
            'jobParameters.subset': subset
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

        var dateRangeStart = (aggregationParams) ?  this._formatDate(aggregationParams.dateRangeStart || this.DEFAULT_DATE_START) : undefined;
        var dateRangeEnd = (aggregationParams) ?  this._formatDate(aggregationParams.dateRangeEnd || this.DEFAULT_DATE_END) : undefined;

        var returnStringFormat = (dateRangeStart != undefined || dateRangeEnd != undefined) ? this.SUBSET_FORMAT : this.SUBSET_FORMAT_WITHOUT_TIME;

        return String.format(
            returnStringFormat,
            dateRangeStart,
            dateRangeEnd,
            (aggregationParams && aggregationParams.latitudeRangeStart || this.DEFAULT_LAT_START).toDecimalString(),
            (aggregationParams && aggregationParams.latitudeRangeEnd || this.DEFAULT_LAT_END).toDecimalString(),
            (aggregationParams && aggregationParams.longitudeRangeStart || this.DEFAULT_LON_START).toDecimalString(),
            (aggregationParams && aggregationParams.longitudeRangeEnd || this.DEFAULT_LON_END).toDecimalString()
        );
    }
});
