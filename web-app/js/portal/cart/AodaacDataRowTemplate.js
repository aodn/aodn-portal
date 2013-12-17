/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.cart');

Portal.cart.AodaacDataRowTemplate = Ext.extend(Portal.cart.NoDataRowTemplate, {

    AODAAC_EMAIL_ADDRESS_ATTRIBUTE: "aodaac-email-address",

    getDataFilterEntry: function(values) {
        var params = values.aodaac;
        var areaStart = String.format('{0}<b>N</b>,&nbsp;{1}<b>E</b>,', params.latitudeRangeStart, params.longitudeRangeEnd);
        var areaEnd = String.format('{0}<b>S</b>,&nbsp;{1}<b>W</b>', params.latitudeRangeEnd, params.longitudeRangeStart);

        return this._parameterString('parameterAreaLabel', areaStart, areaEnd) +
            this._parameterString('parameterDateLabel', params.dateRangeStart, params.dateRangeEnd);
    },

    createMenuItems: function (collection) {
        return [
            this._createMenuItem('downloadAsNetCdfLabel', collection, 'nc'),
            this._createMenuItem('downloadAsHdfLabel', collection, 'hdf'),
            this._createMenuItem('downloadAsAsciiLabel', collection, 'txt'),
            this._createMenuItem('downloadAsOpenDapUrlsLabel', collection, 'urls')
        ];
    },

    getDataSpecificMarkup: function(values) {
        var html  = '<div class="delayedDownloadForm">' +
            '  <input type="text" id="{3}-{0}" value="{1}">' +
            '  <div><small>{2}</small></div>' +
            '  <div class="clear"></div>' +
            '</div>';
        return String.format(html, values.uuid, this._getEmailAddress(values.uuid), this._getNotificationBlurbEntry(), this.AODAAC_EMAIL_ADDRESS_ATTRIBUTE);
    },

    attachMenuEvents: function(values) {
        var emailElement = this._emailTextFieldElement(values.uuid);
        if (emailElement) {
            emailElement.on('click', function () {
                if (this.getValue() == OpenLayers.i18n('emailAddressPlaceholder')) {
                    this.set({ value: '' });
                }
            });
            emailElement.on('change', function () {
                this._saveEmailAddress(values.uuid);
            }, this);
        }
    },

    _createMenuItem: function(translationKey, collection, format) {
        return {
            text: OpenLayers.i18n(translationKey),
            handler: this._downloadAodaacHandler(collection, format),
            scope: this
        }
    },

    _parameterString: function (labelKey, value1, value2) {
        return String.format('<b>{0}:</b> &nbsp;<code>{1}</code> <code>{2}</code><br>', OpenLayers.i18n(labelKey), value1, value2);
    },

    _downloadAodaacHandler: function(collection, format) {
        return function() {
            var emailAddress = this._emailTextFieldElement(collection.uuid).getValue();

            // Todo - DN: We're not showing the DownloadConfirmationWindow currently
            if (!this._validateEmailAddress(emailAddress)) {
                Ext.Msg.alert(OpenLayers.i18n('aodaacEmailProblemDialogTitle'), OpenLayers.i18n('aodaacNoEmailAddressMsg'));
                return;
            }

            var downloadUrl = this._aodaacUrl(collection.aodaac, format, emailAddress);
            Ext.Ajax.request({
                url: downloadUrl,
                scope: this,
                success: function() {
                    Ext.Msg.alert(OpenLayers.i18n('aodaacPanelTitle'), OpenLayers.i18n('aodaacJobCreatedMsg', {email: emailAddress}));
                },
                failure: function() {
                    Ext.Msg.alert(OpenLayers.i18n('aodaacPanelTitle'), OpenLayers.i18n('aodaacJobCreateErrorMsg'));
                }
            });
        };
    },

    _saveEmailAddress: function (uuid) {
        Portal.data.ActiveGeoNetworkRecordStore.instance().
            addRecordAttribute(
                uuid,
                this.AODAAC_EMAIL_ADDRESS_ATTRIBUTE,
                this._emailTextFieldElement(uuid).getValue()
            );
    },

    _aodaacUrl: function(params, format, emailAddress) {
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
        args += "&notificationEmailAddress=" + emailAddress;

        return 'aodaac/createJob?' + args;
    },

    _getEmailAddress: function (uuid) {
        var emailAddress = Portal.data.ActiveGeoNetworkRecordStore.instance().
            getRecordAttribute(
                uuid,
                this.AODAAC_EMAIL_ADDRESS_ATTRIBUTE
            );

        return emailAddress || OpenLayers.i18n('emailAddressPlaceholder');
    },

    _validateEmailAddress: function (address) {
        if (!address) {
            return false;
        }

        // From http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
        var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(address);
    },

    _emailTextFieldElement: function (uuid) {
        return Ext.get(Ext.query("#" + this.AODAAC_EMAIL_ADDRESS_ATTRIBUTE + "-" + uuid)[0]);
    },

    _getNotificationBlurbEntry: function() {
        return OpenLayers.i18n('notificationBlurbMessage');
    }
});
