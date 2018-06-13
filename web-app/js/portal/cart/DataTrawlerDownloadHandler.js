Ext.namespace('Portal.cart');

Portal.cart.DataTrawlerDownloadHandler = Ext.extend(Portal.cart.AsyncDownloadHandler, {


    _getDownloadOptionTextKey: function() {
        return 'downloadAsDataTrawlerCsvLabel';
    },

    _getDownloadOptionTitle: function() {
        return OpenLayers.i18n('downloadDataTrawlerServiceAction');
    },

    _buildServiceUrl: function(filters, dataType, serverUrl, notificationEmailAddress, hasTemporalExtent) {

        var request = this._getTrawlerParamsUrl(filters, dataType, notificationEmailAddress);
        var subset = this._getBaseSubset(filters, hasTemporalExtent);

        var jobParameters = {
            server: serverUrl,
            jobType: 'DataTrawler',
            mimeType: "text/csv",
            request: request,
            'jobParameters.subset': subset
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

        return dataTypeParam +
            emailParam +
            'output_filename=data_trawler_output&' +
            'position_format=d.ddd&' +
            'date_format=dd-mmm-yyyy HH24:mm:ss&' +
            'file_format=csv&'+
            'purpose_of_data=&'+
            'sort_order=';
    },

    _getBaseSubset: function(filters, hasTemporalExtent) {

        var zaxisParamString = "";

        var dateParams = filters.filter(function(filter) {
            return (filter.name == 'dateTime');
        })[0];

        var dateRangeStart = (dateParams) ?  this._formatDate(dateParams.dateRangeStart || this.DEFAULT_DATE_START) : undefined;
        var dateRangeEnd = (dateParams) ?  this._formatDate(dateParams.dateRangeEnd || this.DEFAULT_DATE_END) : undefined;
        var returnStringFormat;

        if (hasTemporalExtent) {
            returnStringFormat = (dateRangeStart != undefined || dateRangeEnd != undefined) ? OpenLayers.i18n('subsetFormat') : OpenLayers.i18n('subsetFormatWithoutTime');
        }
        else {
            returnStringFormat = OpenLayers.i18n('subsetFormatWithoutTime');
        }

        var zaxisParams = filters.filter(function(filter) {
            return (filter.isNcwmsParams &&
                (filter.label == OpenLayers.i18n("zAxisLabelPositiveDown")
                    || filter.label == OpenLayers.i18n("zAxisLabelPositiveUp")));
        })[0];

        if (zaxisParams) {
            zaxisParamString = String.format(";DEPTH,{0}",zaxisParams.value.join(","));
        }

        return String.format(
            returnStringFormat,
            dateRangeStart,
            dateRangeEnd,
            (dateParams && dateParams.latitudeRangeStart || this.DEFAULT_LAT_START).toDecimalString(),
            (dateParams && dateParams.latitudeRangeEnd || this.DEFAULT_LAT_END).toDecimalString(),
            (dateParams && dateParams.longitudeRangeStart || this.DEFAULT_LON_START).toDecimalString(),
            (dateParams && dateParams.longitudeRangeEnd || this.DEFAULT_LON_END).toDecimalString(),
            zaxisParamString
        );
    }
});
