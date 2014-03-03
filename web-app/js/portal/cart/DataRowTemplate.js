/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.cart');

Portal.cart.DataRowTemplate = Ext.extend(Portal.cart.NoDataRowTemplate, {

    GOGODUCK_EMAIL_ADDRESS_ATTRIBUTE: "gogoduck-email-address",

    getDataFilterEntry: function(values) {
        var dataFilterString;

        if (this._isGogoduck(values)) {
            dataFilterString = this.createGogoduckFilterEntry(values);
        }
        else {
            if (this._isBodaac(values)) {
                dataFilterString = this.createBodaacFilterEntry(values);
            }
            else {
                dataFilterString = this.createWmsFilterEntry(values);
            }
        }
        return dataFilterString;
    },

    createGogoduckFilterEntry: function(values) {
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

    createBodaacFilterEntry: function(values) {
        return String.format('<b>{0}</b> {1}', OpenLayers.i18n('filterLabel'), this.getBodaacDateInfo(values.wmsLayer.bodaacFilterParams));
    },

    createWmsFilterEntry: function(values) {
        var html;
        var infoLabel;
        var layerValues;

        if (this._cql(values.wmsLayer)) {
            html = '<b>{0}</b> <code>{1}</code>';
            infoLabel = OpenLayers.i18n('filterLabel');
            layerValues = this._cql(values.wmsLayer);
        }
        else {
            html = '<i>{0}</i> <code>{1}</code>';
            infoLabel = OpenLayers.i18n('noFilterLabel');
            layerValues = '';
        }
        return String.format(html, infoLabel, layerValues);
    },

    getBodaacDateInfo: function(dates) {
        if (dates.dateRangeStart) {
            var startDate = moment.utc(dates.dateRangeStart).toUtcDisplayFormat();
            var endDate = moment.utc(dates.dateRangeEnd).toUtcDisplayFormat();
            return String.format('<code> {0} {1} and {2}</code>', OpenLayers.i18n('timeRangeLabel'), startDate, endDate);
        }
        else {
            return OpenLayers.i18n('timeRangeCalculating');
        }
    },

    createMenuItems: function(collection) {
        var menuItems = [];

        if (this._isGogoduck(collection)) {
            menuItems = this._generateGogoduckMenuItems();
        }
        else {
            if (this._isBodaac(collection)) {
                menuItems = this._generateBodaacMenuItems();
            }
            else {
                menuItems = this._generateWmsMenuItems(collection);
            }
        }

        return menuItems;
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

    _generateBodaacMenuItems: function() {
        var menuItems = [];

        menuItems.push({
            text: OpenLayers.i18n('downloadAsUrlsLabel'),
            handler: this._urlListDownloadHandler(collection),
            scope: this
        });
        menuItems.push({
            text: OpenLayers.i18n('downloadAsNetCdfLabel'),
            handler: this._netCdfDownloadHandler(collection),
            scope: this
        });

        return menuItems;
    },

    _generateGogoduckMenuItems: function(collection) {
        return [
            this._createGogoduckMenuItem('downloadAsNetCdfLabel', collection, 'nc'),
            this._createGogoduckMenuItem('downloadAsHdfLabel', collection, 'hdf'),
            this._createGogoduckMenuItem('downloadAsAsciiLabel', collection, 'txt'),
            this._createGogoduckMenuItem('downloadAsOpenDapUrlsLabel', collection, 'urls')
        ];
    },

    _generateWmsMenuItems: function(collection) {
        var menuItems = [];

        if (collection.wmsLayer.wfsLayer) {
            menuItems.push({
                text: OpenLayers.i18n('downloadAsCsvLabel'),
                handler: this._downloadWfsHandler(collection, 'csv'),
                scope: this
            });
        }

        if (collection.wmsLayer.urlDownloadFieldName) {
            menuItems.push({
                text: OpenLayers.i18n('downloadAsUrlsLabel'),
                handler: this._urlListDownloadHandler(collection),
                scope: this
            });
            menuItems.push({
                text: OpenLayers.i18n('downloadAsNetCdfLabel'),
                handler: this._netCdfDownloadHandler(collection),
                scope: this
            });
        }

        return menuItems;
    },

    _isBodaac: function(collection) {
        return collection.wmsLayer && collection.wmsLayer.isNcwms();
    },

    _isGogoduck: function(collection) {
        return collection.wmsLayer.wfsLayer && collection.wmsLayer.isNcwms();
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
        var htmlString;

        if (this._isGogoduck(values)) {
            htmlString = this.generateGogoduckSpecificMarkup(values);
        }
        else {
            htmlString = this.generateWmsSpecificMarkup(values);
        }

        return htmlString;
    },

    generateGogoduckSpecificMarkup: function(values) {
        var html  = '<div class="delayedDownloadForm">' +
            '  <input type="text" id="{3}-{0}" value="{1}">' +
            '  <div><small>{2}</small></div>' +
            '  <div class="clear"></div>' +
            '</div>';
        return String.format(html, values.uuid, this._getEmailAddress(values.uuid), this._getNotificationBlurbEntry(), this.GOGODUCK_EMAIL_ADDRESS_ATTRIBUTE);
    },

    generateWmsSpecificMarkup: function(values) {
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
    },

    _cql: function(wmsLayer) {
        return wmsLayer.getWmsDownloadFilter();
    },

    _downloadWfsHandler: function(collection, format) {
        return this.downloadWithConfirmation(this._wfsDownloadUrl(collection.wmsLayer, format), String.format("{0}.{1}", collection.title, format));
    },

    _urlListDownloadHandler: function(collection) {
        var additionalArgs = {
            action: 'urlListForLayer',
            layerId: collection.wmsLayer.grailsLayerId
        };

        return this.downloadWithConfirmation(
            this._bodaacCsvDownloadUrl(collection),
            String.format("{0}_URLs.txt", collection.title),
            additionalArgs
        );
    },

    _netCdfDownloadHandler: function(collection) {
        var additionalArgs = {
            action: 'downloadNetCdfFilesForLayer',
            layerId: collection.wmsLayer.grailsLayerId
        };

        return this.downloadWithConfirmation(
            this._bodaacCsvDownloadUrl(collection),
            String.format("{0}_source_files.zip", collection.title),
            additionalArgs
        );
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

            var downloadUrl = this._gogoduckUrl(collection.gogoduckParams, format, emailAddress);
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

    _bodaacCsvDownloadUrl: function(collection) {
        return this._isBodaac(collection) ? this._wfsDownloadUrl(collection.wmsLayer, 'csv') : this._wmsDownloadUrl(collection.wmsLayer, 'csv');
    },

    _wfsDownloadUrl: function(layer, format) {
        return layer.getWfsLayerFeatureRequestUrl(format);
    },

    _wmsDownloadUrl: function(layer, format) {
        return layer.getWmsLayerFeatureRequestUrl(format);
    },

    _gogoduckUrl: function(params, format, emailAddress) {

        var args = new Ext.util.JSON({
            layerName: params.layerName,
            emailAddress: emailAddress,
            subsetDescriptor: {
                temporalExtent: {
                    start: encodeURIComponent(params.dateRangeStart),
                    end: encodeURIComponent(params.dateRangeEnd)
                },
                spatialExtent: {
                    north: (params.latitudeRangeEnd || params.productLatitudeRangeEnd),
                    south: (params.latitudeRangeStart || params.productLatitudeRangeStart),
                    east: (params.longitudeRangeEnd || params.productLongitudeRangeEnd),
                    west: (params.longitudeRangeStart || params.productLongitudeRangeStart)
                }
            }
        });

        return 'gogoduck/createJob?' + decodeURIComponent(jQuery.param(args));
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
