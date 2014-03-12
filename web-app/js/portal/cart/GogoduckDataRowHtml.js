/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.cart');

Portal.cart.GogoduckDataRowHtml = Ext.extend(Portal.cart.NoDataRowHtml, {

    GOGODUCK_EMAIL_ADDRESS_ATTRIBUTE: "gogoduck-email-address",

    getDataFilterEntry: function(values) {
        var params = values.gogoduckParams;
        var areaString = "";
        var dateString = "";

        if (params.latitudeRangeStart) {
            var areaStart = String.format('{0}<b>N</b>,&nbsp;{1}<b>E</b>,', params.latitudeRangeStart, params.longitudeRangeEnd);
            var areaEnd = String.format('{0}<b>S</b>,&nbsp;{1}<b>W</b>', params.latitudeRangeEnd, params.longitudeRangeStart);
            areaString = this._parameterString('parameterAreaLabel', areaStart, areaEnd);
        }

        if (params.dateRangeStart != "Invalid date") {
            dateString = this._parameterString('parameterDateLabel', params.dateRangeStart, params.dateRangeEnd, " <b>-</b> ");
        }

        if (areaString == "" && dateString == "") {
            areaString = String.format("<i>{0}<i>", OpenLayers.i18n("noFilterLabel"));
        }

        return areaString + dateString;
    },

    createMenuItems: function(collection) {
        return [
            this._createGogoduckMenuItem('downloadAsNetCdfLabel', collection, 'nc'),
            this._createGogoduckMenuItem('downloadAsHdfLabel', collection, 'hdf'),
            this._createGogoduckMenuItem('downloadAsAsciiLabel', collection, 'txt'),
            this._createGogoduckMenuItem('downloadAsOpenDapUrlsLabel', collection, 'urls')
        ];
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

    _saveEmailAddress: function (uuid) {
        Portal.data.ActiveGeoNetworkRecordStore.instance().
            addRecordAttribute(
                uuid,
                this.GOGODUCK_EMAIL_ADDRESS_ATTRIBUTE,
                this._emailTextFieldElement(uuid).getValue()
            );
    },

    _getEmailAddress: function (uuid) {
        var emailAddress = Portal.data.ActiveGeoNetworkRecordStore.instance().
            getRecordAttribute(
                uuid,
                this.GOGODUCK_EMAIL_ADDRESS_ATTRIBUTE
            );

        return emailAddress || OpenLayers.i18n('emailAddressPlaceholder');
    },

    getDataSpecificMarkup: function(values) {
        var html  = '<div class="delayedDownloadForm">' +
            '  <input type="text" id="{3}-{0}" value="{1}">' +
            '  <div><small>{2}</small></div>' +
            '  <div class="clear"></div>' +
            '</div>';
        return String.format(html, values.uuid, this._getEmailAddress(values.uuid), this._getNotificationBlurbEntry(), this.GOGODUCK_EMAIL_ADDRESS_ATTRIBUTE);
    },

    _createGogoduckMenuItem: function(translationKey, collection, format) {
        return {
            text: OpenLayers.i18n(translationKey),
            handler: this._downloadGogoduckHandler(collection, format),
            scope: this
        }
    },

    _downloadGogoduckHandler: function(collection, format) {
        return function() {
            var emailAddress = this._emailTextFieldElement(collection.uuid).getValue();

            // Todo - DN: We're not showing the DownloadConfirmationWindow currently
            if (!this._validateEmailAddress(emailAddress)) {
                Ext.Msg.alert(OpenLayers.i18n('gogoduckEmailProblemDialogTitle'), OpenLayers.i18n('gogoduckNoEmailAddressMsg'));
                return;
            }

            var downloadUrl = this._gogoduckUrl(collection.gogoduckParams, emailAddress);
            Ext.Ajax.request({
                url: downloadUrl,
                scope: this,
                success: function() {
                    Ext.Msg.alert(OpenLayers.i18n('gogoduckPanelTitle'), OpenLayers.i18n('gogoduckJobCreatedMsg', {email: emailAddress}));
                },
                failure: function() {
                    Ext.Msg.alert(OpenLayers.i18n('gogoduckPanelTitle'), OpenLayers.i18n('gogoduckJobCreateErrorMsg'));
                }
            });
        };
    },

    _parameterString: function (labelKey, value1, value2, delim) {
        return String.format('<b>{0}:</b> &nbsp;<code>{1}</code> {3} <code>{2}</code><br>', OpenLayers.i18n(labelKey), value1, value2, (delim || ""));
    },

    _gogoduckUrl: function(params, emailAddress) {

        var paramsAsJson;
        var args = {
            layerName: params.layerName,
            emailAddress: emailAddress,
            subsetDescriptor: {
                temporalExtent: {
                    start: params.dateRangeStart,
                    end: params.dateRangeEnd
                },
                spatialExtent: {
                    north: (params.latitudeRangeEnd || params.productLatitudeRangeEnd),
                    south: (params.latitudeRangeStart || params.productLatitudeRangeStart),
                    east: (params.longitudeRangeEnd || params.productLongitudeRangeEnd),
                    west: (params.longitudeRangeStart || params.productLongitudeRangeStart)
                }
            }
        };

        paramsAsJson = Ext.util.JSON.encode(args);

        return String.format('gogoduck/createJob?{0}', encodeURIComponent(paramsAsJson));
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
        return Ext.get(Ext.query("#" + this.GOGODUCK_EMAIL_ADDRESS_ATTRIBUTE + "-" + uuid)[0]);
    },

    _getNotificationBlurbEntry: function() {
        return OpenLayers.i18n('notificationBlurbMessage');
    }
});
