/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.cart');

Portal.cart.AodaacDataRowTemplate = Ext.extend(Ext.XTemplate, {

    constructor: function(downloadPanelTemplate) {

        this.downloadPanelTemplate = downloadPanelTemplate;

        var templateLines = [
            '<div class="row data">',
            '  <div class="subheading">' + OpenLayers.i18n('dataSubheading') + '</div>',
            '  {[this._getDataFilterEntry(values)]}',
            '  {[this._getDataDownloadEntry(values)]}',
            '  {[this._getNotificationBlurbEntry()]}',
            '</div>'
        ];

        Portal.cart.AodaacDataRowTemplate.superclass.constructor.call(this, templateLines);
    },

    applyWithControls: function(values) {

        return this._replacePlaceholdersWithControls(this.apply(values), values);
    },

    _getDataFilterEntry: function(values) {

        var aodaacParameters = values.aodaac;

        if (aodaacParameters) {

            var html = this._aodaacParamatersMarkup(aodaacParameters);

            return this.downloadPanelTemplate._makeEntryMarkup(html);
        }

        return "";
    },

    _getDataDownloadEntry: function(values) {

        var aodaacParameters = values.aodaac;
        var html;

        if (aodaacParameters) {

            html  = '<input type="text" id="aodaac-email-address-{0}" value="{1}" class="floatLeft">';
            html += '<div class="floatLeft">';
            html += '<div id="aodaac-download-button-{0}"></div>'; // Download button placeholder
            html += '</div>';
            html += '<div class="clear"></div>';

            html = String.format(html, values.uuid, OpenLayers.i18n('emailAddressPlaceholder'));
        }
        else {

            html = this.downloadPanelTemplate._makeSecondaryTextMarkup(OpenLayers.i18n('noDataMessage'));
        }

        return this.downloadPanelTemplate._makeEntryMarkup(html);
    },

    _getNotificationBlurbEntry: function() {

        return this.downloadPanelTemplate._makeEntryMarkup(OpenLayers.i18n('notificationBlurbMessage'));
    },

    _aodaacParamatersMarkup: function(params) {

        var areaPattern = '{0}&nbsp;N,&nbsp;{1}&nbsp;E';
        var areaStart = String.format(areaPattern, params.latitudeRangeStart, params.longitudeRangeStart);
        var areaEnd = String.format(areaPattern, params.latitudeRangeEnd, params.longitudeRangeEnd);

        return "<b>" + OpenLayers.i18n('parametersLabel') + "</b><br>" +
            this._parameterString('parameterAreaLabel', areaStart, areaEnd) +
            this._parameterString('parameterDateLabel', params.dateRangeStart, params.dateRangeEnd) +
            this._parameterString('parameterTimeLabel', params.timeOfDayRangeStart, params.timeOfDayRangeEnd);
    },

    _parameterString: function(labelKey, value1, value2) {

        return String.format('{0}: <code>{1}</code> – <code>{2}</code><br>', OpenLayers.i18n(labelKey), value1, value2);
    },

    _replacePlaceholdersWithControls: function(html, collection) {

        var elementId = 'aodaac-download-button-' + collection.uuid;

        // Don't create button if no placeholder exists
        if (html.indexOf(elementId) >= 0) {

            this._createDownloadButton.defer(1, this, [html, elementId, collection]);
        }

        return html;
    },

    _createDownloadButton: function(html, id, collection) {

        var downloadMenu = new Ext.menu.Menu({
            items: this._createMenuItems(collection)
        });

        new Ext.Button({
            text: OpenLayers.i18n('downloadButtonLabel'),
            icon: 'images/down.png',
            scope: this,
            menu: downloadMenu
        }).render(html, id);
    },

    _createMenuItems: function(collection) {

        return [
            {text: OpenLayers.i18n('downloadAsNetCdfLabel'), handler: this._downloadHandlerFor(collection, 'nc'), scope: this},
            {text: OpenLayers.i18n('downloadAsHdfLabel'), handler: this._downloadHandlerFor(collection, 'hdf'), scope: this},
            {text: OpenLayers.i18n('downloadAsAsciiLabel'), handler: this._downloadHandlerFor(collection, 'txt'), scope: this},
            {text: OpenLayers.i18n('downloadAsOpenDapUrlsLabel'), handler: this._downloadHandlerFor(collection, 'urls'), scope: this}
        ];
    },

    _downloadHandlerFor: function(collection, format) {

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

    _aodaacUrl: function(params, format, emailAddress) {

        var args = "outputFormat=" + format;
        args += "&dateRangeStart=" + params.dateRangeStart;
        args += "&dateRangeEnd=" + params.dateRangeEnd;
        args += "&timeOfDayRangeStart=" + params.timeOfDayRangeStart;
        args += "&timeOfDayRangeEnd=" + params.timeOfDayRangeEnd;
        args += "&latitudeRangeStart=" + params.latitudeRangeStart;
        args += "&latitudeRangeEnd=" + params.latitudeRangeEnd;
        args += "&longitudeRangeStart=" + params.longitudeRangeStart;
        args += "&longitudeRangeEnd=" + params.longitudeRangeEnd;
        args += "&productId=" + params.productId;
        args += "&notificationEmailAddress=" + emailAddress;

        return 'aodaac/createJob?' + args;
    },

    _validateEmailAddress: function(address) {

        if (!address) {
            return false;
        }

        // From http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
        var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(address);
    }
});
