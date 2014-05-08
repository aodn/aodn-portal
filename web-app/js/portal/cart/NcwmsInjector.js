/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.cart');

Portal.cart.NcwmsInjector = Ext.extend(Portal.cart.BaseInjector, {

    PARAMS_DATE_FORMAT: 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]',

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

    _parameterString: function(labelKey, value1, value2, delim) {
        return String.format('<b>{0}:</b> &nbsp;<code>{1}</code> {3} <code>{2}</code><br>', OpenLayers.i18n(labelKey), value1, value2, (delim || ""));
    },

    _createMenuItems: function(collection) {
        var menuItems = [];

        if (this._isBodaacLayer(collection)) {

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

        if (this._isAodaacLayer(collection) || this._isGogoduckLayer(collection)) {

            menuItems.push({
                text: OpenLayers.i18n('downloadAsSubsettedNetCdfLabel'),
                handler: this._downloadGogoduckHandler(collection, { format: 'nc' }),
                scope: this
            });
        }

        return menuItems;
    },

    _downloadGogoduckHandler: function(collection, params) {

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

        var url = '';

        if (this._isGogoduckLayer(collection)) {
            url = this._generateGogoduckJobUrl(collection, params.emailAddress);
        }
        else {
            if (this._isAodaacLayer(collection)) {
                url = this._generateAodaacJobUrl(collection, params.format, params.emailAddress);
            }
        }

        return url;
    },

    _isAodaacLayer: function(collection) {
        var aodaac = false;

        Ext.each(collection.aggregator, function(aggregator, index) {
            if (aggregator.isAodaacLayer()) {
                aodaac = true;
            }
        });

        return aodaac;
    },

    _isBodaacLayer: function(collection) {
        var bodaac = false;

        Ext.each(collection.aggregator, function(aggregator, index) {
            if (aggregator.isBodaacLayer()) {
                bodaac = true;
            }
        });

        return bodaac;
    },

    _isGogoduckLayer: function(collection) {
        var gogoduck = false;

        Ext.each(collection.aggregator, function(aggregator, index) {
            if (aggregator.isGogoduckLayer()) {
                gogoduck = true;
            }
        });

        return gogoduck;
    },

    _generateAodaacJobUrl: function(collection, format, email) {

        var params = collection.ncwmsParams;

        var args = "outputFormat=" + format;
        args += "&dateRangeStart=" + encodeURIComponent(this._formatDate(params.dateRangeStart));
        args += "&dateRangeEnd=" + encodeURIComponent(this._formatDate(params.dateRangeEnd));
        args += "&latitudeRangeStart=" + (params.latitudeRangeStart || params.productLatitudeRangeStart);
        args += "&latitudeRangeEnd=" + (params.latitudeRangeEnd || params.productLatitudeRangeEnd);
        args += "&longitudeRangeStart=" + (params.longitudeRangeStart || params.productLongitudeRangeStart);
        args += "&longitudeRangeEnd=" + (params.longitudeRangeEnd || params.productLongitudeRangeEnd);
        args += "&productId=" + params.productId;
        args += "&notificationEmailAddress=" + email;

        return 'aodaac/createJob?' + args;
    },

    _generateGogoduckJobUrl: function(collection, email) {

        var params = collection.ncwmsParams;

        var args = {
            layerName: params.layerName,
            emailAddress: email,
            subsetDescriptor: {
                temporalExtent: {
                    start: this._formatDate(params.dateRangeStart),
                    end: this._formatDate(params.dateRangeEnd)
                },
                spatialExtent: {
                    north: (params.latitudeRangeEnd || params.productLatitudeRangeEnd),
                    south: (params.latitudeRangeStart || params.productLatitudeRangeStart),
                    east: (params.longitudeRangeEnd || params.productLongitudeRangeEnd),
                    west: (params.longitudeRangeStart || params.productLongitudeRangeStart)
                }
            }
        };

        if (collection.wmsLayer.gogoduckLayerName) {

            args.layerName = collection.wmsLayer.gogoduckLayerName;
        }

        var paramsAsJson = Ext.util.JSON.encode(args);

        return String.format('gogoduck/registerJob?jobParameters={0}', encodeURIComponent(paramsAsJson));
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
