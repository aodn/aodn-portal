/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.cart');

Portal.cart.NcwmsInjector = Ext.extend(Portal.cart.BaseInjector, {

    constructor: function(config) {
        Portal.cart.NcwmsInjector.superclass.constructor.call(this, Ext.apply(this, config));
        this._downloadUrl = this._bodaacCsvDownloadUrl;
    },

    _getDataFilterEntry: function(collection) {

        var params = collection.ncwmsParams;
        var areaString = "";
        var dateString = "";

        if (params.latitudeRangeStart) {
            var areaStart = String.format('{0}<b>N</b>,&nbsp;{1}<b>E</b>,', params.latitudeRangeStart, params.longitudeRangeEnd);
            var areaEnd = String.format('{0}<b>S</b>,&nbsp;{1}<b>W</b>', params.latitudeRangeEnd, params.longitudeRangeStart);
            areaString = this._parameterString('parameterAreaLabel', areaStart, areaEnd);
        }

        if (params.dateRangeStart != undefined) {
            var displayDateFormat = OpenLayers.i18n('dateFilterDisplayFormat');
            var startDateString = params.dateRangeStart.format(displayDateFormat);
            var endDateString = params.dateRangeEnd.format(displayDateFormat);
            dateString = this._parameterString('parameterDateLabel', startDateString, endDateString, " <b>-</b> ");
        }
        else {
            dateString = OpenLayers.i18n('emptyDownloadDateRangePlaceholder');
        }

        if (areaString == "" && dateString == "") {
            areaString = String.format("<i>{0}<i>", OpenLayers.i18n("noFilterLabel"));
        }

        return areaString + dateString;
    },

    _parameterString: function (labelKey, value1, value2, delim) {
        return String.format('<b>{0}:</b> &nbsp;<code>{1}</code> {3} <code>{2}</code><br>', OpenLayers.i18n(labelKey), value1, value2, (delim || ""));
    },

    _createMenuItems: function(collection) {
        var menuItems = [];

        if (this._isUrlListDownloadAvailable(collection)) {

            menuItems.push({
                text: OpenLayers.i18n('downloadAsUrlsLabel'),
                handler: this._urlListDownloadHandler(collection),
                scope: this
            });
            menuItems.push({
                text: OpenLayers.i18n('downloadAsAllSourceNetCdfLabel'),
                handler: this._netCdfDownloadHandler(collection),
                scope: this
            });
        }

        if (this._isSubsettedNetCdfAvailable(collection)) {

            menuItems.push({
                text: OpenLayers.i18n('downloadAsSubsettedNetCdfLabel'),
                handler: this._subsettedDownloadHandler(collection, { format: 'nc' }),
                scope: this
            });
        }

        return menuItems;
    },

    _subsettedDownloadHandler: function(collection, params) {

        params.collectEmailAddress = true;
        params.asyncDownload = true;

        return this.downloadWithConfirmation(collection, this._generateNcwmsUrl, params);
    },

    _formatDate: function(date) {

        return date.format(this.PARAMS_DATE_FORMAT);
    },

    _bodaacCsvDownloadUrl: function(collection) {
        return this._wfsDownloadUrl(collection, { format: 'csv' });
    },

    _getDataMarkup: function(collection) {

        if (collection.wmsLayer.wfsLayer) {
            return this._downloadSizeEstimator(collection);
        }

        return '';
    },

    _generateNcwmsUrl: function(collection, params) {

        var recordAggregator = this._getRecordAggregator(collection);

        return recordAggregator.generateUrl(collection.ncwmsParams, params.emailAddress);
    },

    _getRecordAggregator: function(collection) {

        var aggrGroup = collection.aggregator.childAggregators;
        var aggregator;

        Ext.each(aggrGroup, function(aggr) {
            if (aggr.supportsSubsettedNetCdf()) {
                aggregator = aggr;
            }
        });

        return aggregator;
    },

    _isSubsettedNetCdfAvailable: function(collection) {
        return collection.aggregator.supportsSubsettedNetCdf();
    },

    _isUrlListDownloadAvailable: function(collection) {
        return collection.aggregator.supportsNetCdfUrlList();
    },

    _downloadSizeEstimator: function(values) {
        var estimator = new Portal.cart.DownloadEstimator();
        estimator._getDownloadEstimate(
            values,
            this._bodaacCsvDownloadUrl(values)
        );

        return String.format(
            "<div id=\"{0}\">{1}{2}</div>",
            estimator.getIdElementName(values.uuid),
            OpenLayers.i18n("estimatedDlLoadingMessage"),
            OpenLayers.i18n("estimatedDlLoadingSpinner")
        );
    }
});
