Ext.namespace('Portal.cart');

Portal.cart.PointCSVDownloadHandler = Ext.extend(Portal.cart.AsyncDownloadHandler, {

    SUBSET_FORMAT: 'TIME,{0},{1};LATITUDE,{2},{3};LONGITUDE,{4},{5}',

    _getDownloadOptionTextKey: function() {
        return 'downloadAsPointTimeSeriesCsvLabel';
    },

    _getDownloadOptionTitle: function() {
        return 'CSV - gridded (point timeseries)';
    },

    _buildServiceUrl: function(filters, layerName, serverUrl, notificationEmailAddress) {

        var subset = this._getSubset(filters);

        var jobParameters = {
            server: serverUrl,
            'email.to': notificationEmailAddress,
            jobType: 'GoGoDuck',
            mimeType: "text/csv",
            'jobParameters.layer': layerName,
            'jobParameters.subset': subset
        };

        return String.format(
            "{0}{1}",
            this.getAsyncDownloadUrl('wps'),
            Ext.urlEncode(jobParameters)
        );
    },

    _showDownloadOptions: function(filters) {
        return this._resourceHrefNotEmpty()
            && this._resourceNameNotEmpty()
            && Portal.filter.FilterUtils.hasFilter(filters, 'timeSeriesAtPoint');
    },

    _getSubset: function(filters) {
        var aggregationParams = filters.filter(function(filter) {
            return filter.isNcwmsParams;
        })[0];

        var pointFilterValue = Portal.filter.FilterUtils.getFilter(filters, 'timeSeriesAtPoint').getValue();

        return String.format(
            this.SUBSET_FORMAT,
            this._formatDate(aggregationParams.dateRangeStart || this.DEFAULT_DATE_START),
            this._formatDate(aggregationParams.dateRangeEnd || this.DEFAULT_DATE_END),
            pointFilterValue.latitude.toDecimalString(),
            pointFilterValue.latitude.toDecimalString(),
            pointFilterValue.longitude.toDecimalString(),
            pointFilterValue.longitude.toDecimalString()
        );
    }
});
