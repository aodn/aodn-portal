Ext.namespace('Portal.cart');

Portal.cart.GogoduckDownloadHandler = Ext.extend(Portal.cart.AsyncDownloadHandler, {

    SUBSET_FORMAT: 'TIME,{0},{1};LATITUDE,{2},{3};LONGITUDE,{4},{5}{6}',
    SUBSET_FORMAT_WITHOUT_TIME: 'LATITUDE,{2},{3};LONGITUDE,{4},{5}{6}',

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

    _buildServiceUrl: function(filters, layerName, serverUrl, notificationEmailAddress, hasTemporalExtent) {

        var subset = this._getSubset(filters, hasTemporalExtent);

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

    _getSubset: function(filters, hasTemporalExtent) {

        var zaxisParamString = "";

        var dateParams = filters.filter(function(filter) {
            return (filter.isNcwmsParams && filter.name == OpenLayers.i18n("ncwmsDateParamsFilter"));
        })[0];

        var dateRangeStart = (dateParams) ?  this._formatDate(dateParams.dateRangeStart || this.DEFAULT_DATE_START) : undefined;
        var dateRangeEnd = (dateParams) ?  this._formatDate(dateParams.dateRangeEnd || this.DEFAULT_DATE_END) : undefined;
        var returnStringFormat;

        if (hasTemporalExtent)
            returnStringFormat = (dateRangeStart != undefined || dateRangeEnd != undefined) ? this.SUBSET_FORMAT : this.SUBSET_FORMAT_WITHOUT_TIME;
        else
            returnStringFormat = this.SUBSET_FORMAT_WITHOUT_TIME;

        var zaxisParams = filters.filter(function(filter) {
            return (filter.isNcwmsParams && filter.label == OpenLayers.i18n("zAxisLabel"));
        })[0];

        if (zaxisParams) {
            // hard coding DEPTH for JavaDuck
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
