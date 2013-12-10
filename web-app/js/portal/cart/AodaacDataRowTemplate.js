/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.cart');

Portal.cart.AodaacDataRowTemplate = Ext.extend(Ext.XTemplate, {

    AODAAC_EMAIL_ADDRESS_ATTRIBUTE: "aodaac-email-address",

    constructor: function() {

        var templateLines = [
            '<div class="x-panel-body x-box-layout-ct">',
            '  {[this._getDataDownloadEntry(values)]}',
            '</div>'
        ];

        Portal.cart.AodaacDataRowTemplate.superclass.constructor.call(this, templateLines);
    },

    _getDataDownloadEntry: function(values) {

        if (values.aodaac) {
            html  = '<div class="delayedDownloadForm">' +
                '  <input type="text" id="{3}-{0}" value="{1}">' +
                '  <div><small>{2}</small></div>' +
                '  <div class="clear"></div>' +
                '</div>';
            return String.format(html, values.uuid, this._getEmailAddress(values.uuid), this._getNotificationBlurbEntry(), this.AODAAC_EMAIL_ADDRESS_ATTRIBUTE);
        }

    },


    _downloadAodaacHandler: function(collection, format) {
        var emailAddessElementId = '#aodaac-email-address-' + collection.uuid;

        return function() {

            // Todo - DN: We're not showing the DownloadConfirmationWindow currently

            var emailAddressElement = $(emailAddessElementId);
            var emailAddress = emailAddressElement.val();

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

    _aodaacUrl: function (params, format, emailAddress) {
        var args = "outputFormat=" + format;
        args += "&dateRangeStart=" + params.dateRangeStart;
        args += "&dateRangeEnd=" + params.dateRangeEnd;
        args += "&timeOfDayRangeStart=0000";
        args += "&timeOfDayRangeEnd=2400";
        args += "&latitudeRangeStart=" + params.latitudeRangeStart;
        args += "&latitudeRangeEnd=" + params.latitudeRangeEnd;
        args += "&longitudeRangeStart=" + params.longitudeRangeStart;
        args += "&longitudeRangeEnd=" + params.longitudeRangeEnd;
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
