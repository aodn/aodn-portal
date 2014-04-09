/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.cart');

Portal.cart.NcwmsInjector = Ext.extend(Portal.cart.BaseInjector, {

    EMAIL_ADDRESS_ATTRIBUTE: "gogoduck-email-address",
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

        if (params.dateRangeStart) {
            var displayDateFormat = OpenLayers.i18n('dateFilterDisplayFormat');
            var startDateString = params.dateRangeStart.format(displayDateFormat);
            var endDateString = params.dateRangeEnd.format(displayDateFormat);
            dateString = this._parameterString('parameterDateLabel', startDateString, endDateString, " <b>-</b> ");
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
        menuItems.push({
            text: OpenLayers.i18n('downloadAsSubsettedNetCdfLabel'),
            handler: this._downloadGogoduckHandler(collection, { format: 'nc' }),
            scope: this
        });

        return menuItems;
    },

    _downloadGogoduckHandler: function(collection, params) {

        params.collectEmailAddress = true;
        params.asyncDownload = true;

        return this.downloadWithConfirmation(collection, this._generateNcwmsUrl, params);
    },

    _validateEmailAddress: function(address) {
        if (!address) {
            return false;
        }

        // From http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
        var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(address);
    },

    _formatDate: function(date) {

        return date.format(this.PARAMS_DATE_FORMAT);
    },

    _emailTextFieldElement: function (uuid) {
        return Ext.get(Ext.query("#" + this.EMAIL_ADDRESS_ATTRIBUTE + "-" + uuid)[0]);
    },

    _bodaacCsvDownloadUrl: function(collection) {
        return this._wfsDownloadUrl(collection, { format: 'csv' });
    },

    _getNotificationBlurbEntry: function() {
        return OpenLayers.i18n('notificationBlurbMessage');
    },

    _getDataMarkup: function(collection) {
        return this._downloadSizeEstimator(collection)
    },

    _emailAddressForm: function(collection) {
        var html = '<div class="delayedDownloadForm">' +
            '  <input type="text" id="{3}-{0}" value="{1}">' +
            '  <div><small>{2}</small></div>' +
            '  <div class="clear"></div>' +
            '</div>';

        return String.format(
            html,
            collection.uuid,
            this._getEmailAddress(collection.uuid),
            this._getNotificationBlurbEntry(),
            this.EMAIL_ADDRESS_ATTRIBUTE
        );
    },

    _saveEmailAddress: function (uuid) {
        Portal.data.ActiveGeoNetworkRecordStore.instance().
            addRecordAttribute(
                uuid,
                this.EMAIL_ADDRESS_ATTRIBUTE,
                this._emailTextFieldElement(uuid).getValue()
            );
    },

    _getEmailAddress: function (uuid) {
        var emailAddress = Portal.data.ActiveGeoNetworkRecordStore.instance().
            getRecordAttribute(
                uuid,
                this.EMAIL_ADDRESS_ATTRIBUTE
            );

        return emailAddress || OpenLayers.i18n('emailAddressPlaceholder');
    },

    _generateNcwmsUrl: function(collection, params) {

        var url = '';
        var ncwmsParams = collection.ncwmsParams;
        if (ncwmsParams.productId) {
            url = this._generateAodaacJobUrl(ncwmsParams, params.format, params.emailAddress);
        }
        else {
            if (ncwmsParams.layerName) {
                url = this._generateGogoduckJobUrl(ncwmsParams, params.emailAddress);
            }
        }

        return url;
    },

    _generateAodaacJobUrl: function(params, format, email) {

        var args = "outputFormat=" + format;
        args += "&dateRangeStart=" + encodeURIComponent(params.dateRangeStart);
        args += "&dateRangeEnd=" + encodeURIComponent(params.dateRangeEnd);
        args += "&timeOfDayRangeStart=0000";
        args += "&timeOfDayRangeEnd=2400";
        args += "&latitudeRangeStart=" + (params.latitudeRangeStart || params.productLatitudeRangeStart);
        args += "&latitudeRangeEnd=" + (params.latitudeRangeEnd || params.productLatitudeRangeEnd);
        args += "&longitudeRangeStart=" + (params.longitudeRangeStart || params.productLongitudeRangeStart);
        args += "&longitudeRangeEnd=" + (params.longitudeRangeEnd || params.productLongitudeRangeEnd);
        args += "&productId=" + params.productId;
        args += "&notificationEmailAddress=" + email;

        return 'aodaac/createJob?' + args;
    },

    _generateGogoduckJobUrl: function(params, email) {

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
