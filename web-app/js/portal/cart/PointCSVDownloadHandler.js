Ext.namespace('Portal.cart');

Portal.cart.PointCSVDownloadHandler = Ext.extend(Portal.cart.AsyncDownloadHandler, {

    _getDownloadOptionTextKey: function() {
        return 'downloadAsPointTimeSeriesCsvLabel';
    },

    _getDownloadOptionTitle: function() {
        return OpenLayers.i18n('downloadPointCsvAction');
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

    _getSubset: function(filters, hasTemporalExtent) {

        var zaxisParamString = "";
        var returnStringFormat;

        var dateParams = filters.filter(function(filter) {
            return (filter.isNcwmsParams && filter.name == OpenLayers.i18n("ncwmsDateParamsFilter"));
        })[0];

        var dateRangeStart = (dateParams) ?  this._formatDate(dateParams.dateRangeStart || this.DEFAULT_DATE_START) : undefined;
        var dateRangeEnd = (dateParams) ?  this._formatDate(dateParams.dateRangeEnd || this.DEFAULT_DATE_END) : undefined;
        var pointFilterValue = Portal.filter.FilterUtils.getFilter(filters, 'timeSeriesAtPoint').getValue();

        if (hasTemporalExtent) {
            returnStringFormat = (dateRangeStart != undefined || dateRangeEnd != undefined) ? OpenLayers.i18n('subsetFormat') : OpenLayers.i18n('subsetFormatWithoutTime');
        }
        else {
            returnStringFormat = OpenLayers.i18n('subsetFormatWithoutTime');
        }

        var zaxisParams = filters.filter(function(filter) {
            return (filter.isNcwmsParams && filter.label == OpenLayers.i18n("zAxisLabel"));
        })[0];

        if (zaxisParams) {
            zaxisParamString = String.format(";DEPTH,{0}",zaxisParams.value.join(","));
        }

        return String.format(
            returnStringFormat,
            dateRangeStart,
            dateRangeEnd,
            pointFilterValue.latitude.toDecimalString(),
            pointFilterValue.latitude.toDecimalString(),
            pointFilterValue.longitude.toDecimalString(),
            pointFilterValue.longitude.toDecimalString(),
            zaxisParamString
        );
    }
});
