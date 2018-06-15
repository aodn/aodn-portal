Ext.namespace('Portal.cart');

Portal.cart.DataTrawlerDownloadHandler = Ext.extend(Portal.cart.AsyncDownloadHandler, {

    DEFAULT_BOUNDS: {
        bottom: this.DEFAULT_LAT_START,
        top: this.DEFAULT_LAT_END,
        left: this.DEFAULT_LON_START,
        right: this.DEFAULT_LON_END
    },

    _getDownloadOptionTextKey: function() {
        return 'downloadAsDataTrawlerCsvLabel';
    },

    _getDownloadOptionTitle: function() {
        return OpenLayers.i18n('downloadDataTrawlerServiceAction');
    },

    _buildServiceUrl: function(filters, dataType, serverUrl, notificationEmailAddress, hasTemporalExtent) {

        var request = this._getTrawlerParamsUrl(filters, dataType, notificationEmailAddress);

        var jobParameters = {
            server: serverUrl,
            jobType: 'DataTrawler',
            mimeType: "text/csv",
            request: request
        };

        return String.format(
            "{0}{1}",
            this.getAsyncDownloadUrl('datatrawler'),
            Ext.urlEncode(jobParameters)
        );
    },

    _getTrawlerParamsUrl: function(filters, dataType, email) {
        var dataTypeParam = String.format("data_type={0}&", dataType);
        var emailParam = String.format("email_address={0}&", email);
        var subset = this._formatFilterRequest(filters);

        return dataTypeParam +
            subset +
            emailParam +
            'output_filename=data_trawler_output&' +
            'position_format=d.ddd&' +
            'date_format=dd-mmm-yyyy HH24:mm:ss&' +
            'file_format=csv&'+
            'purpose_of_data=&'+
            'sort_order=';
    },

    _formatFilterRequest: function(filters) {
        var formattedFilters = '';
        Ext.each(filters, function(filter) {
            if (filter.type == 'datetime' && filter.name == 'TIME') {
                var fromDate = filter.hasValue() ? moment.utc(filter._getFromDate()) : this.DEFAULT_DATE_START;
                var toDate = filter.hasValue() ? moment.utc(filter._getToDate()) : this.DEFAULT_DATE_END;
                formattedFilters += String.format('TIME,{0},{1}&', this._formatDate(fromDate), this._formatDate(toDate));
            } else if (filter.type == 'pointpropertytype' || filter.type == 'geometrypropertytype') {
                var bounds = filter.hasValue() ? filter.value.bounds : this.DEFAULT_BOUNDS;
                formattedFilters += String.format('LATITUDE,{0},{1}&LONGITUDE,{2},{3}&',
                    bounds.bottom, bounds.top, bounds.left, bounds.right);
            } else if (filter.hasValue()) {
                formattedFilters += String.format("{0}={1}&", filter.name, filter.value);
            }
        }, this);

        return formattedFilters;
    }
});
