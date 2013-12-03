/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.cart');

Portal.cart.DownloadPanelTemplate = Ext.extend(Ext.XTemplate, {

    AODAAC_EMAIL_ADDRESS_ATTRIBUTE: "aodaac-email-address",

    constructor: function(downloadPanel) {

        this.downloadPanel = downloadPanel;

        var templateLines = [
            '<div class="downloadPanelResultsWrapper">',
            '  <div class="x-panel-header resultsHeaderBackground">',
            '    <h3 class="resultsRowHeader">{title}</h3>',
            '    <div class="floatRight downloadButtonWrapper" id="download-button-{uuid}">{[this._downloadButton(values)]}</div>',
            '  </div>',
            '  <div style="overflow:hidden;">' +
            '    <div class="floatLeft"  style="width:70%" >',
            '      <div class="resultsTextBody">' +
            '        {[this._getDataFilterEntry(values)]}',
            '      </div>' +
            '      <div class="resultsTextBody">',
            '        <div>',
            '          {[this._getPointOfTruthLinkEntry(values)]}',
            '        </div>',
            '        <tpl if="downloadableLinks.length &gt; 0">',
            '        <div>',
            '          {[this._getFileListEntries(values)]}',
            '        </div>',
            '        </tpl>',
            '      </div>',
            '    </div>',
            '    <div class="floatRight resultsTextBody" style="width:220px" >',
            '      {[this._dataRowTemplate(values)]}',
            '    </div>',
            '  </div>',
            '</div>'
        ];

        Portal.cart.DownloadPanelTemplate.superclass.constructor.call(this, templateLines);
    },

    _getDataFilterEntry: function(values) {

        var aodaacParameters = values.aodaac;
        var wmsLayer = values.wmsLayer;
        var html = '';

        if (aodaacParameters) {
            html = this._aodaacParametersMarkup(aodaacParameters);
        }
        else if (wmsLayer) {

            var cqlText = wmsLayer.getDownloadFilter();
            if (cqlText) {
                html = String.format('<b>{0}</b> <code>{1}</code>', OpenLayers.i18n('filterLabel'), cqlText);
            }
            else {
                html = OpenLayers.i18n('noFilterMessage');
            }
        }

        return html;

    },

    _aodaacParametersMarkup: function(params) {
        var areaStart = String.format('{0}<b>N</b>,&nbsp;{1}<b>E</b>,', params.latitudeRangeStart, params.longitudeRangeEnd );
        var areaEnd   = String.format('{0}<b>S</b>,&nbsp;{1}<b>W</b>', params.latitudeRangeEnd, params.longitudeRangeStart);

        return this._parameterString('parameterAreaLabel', areaStart, areaEnd) +
            this._parameterString('parameterDateLabel', params.dateRangeStart, params.dateRangeEnd);
    },

    _parameterString: function(labelKey, value1, value2) {
        return String.format('<b>{0}:</b> &nbsp;<code>{1}</code> <code>{2}</code><br>', OpenLayers.i18n(labelKey), value1, value2);
    },

    _getPointOfTruthLinkEntry: function(record) {
        var href = record.pointOfTruthLink.href;
        return this._makeExternalLinkMarkup(href, OpenLayers.i18n('metadataLinkText'));
    },

    _dataRowTemplate: function(values) {
        var html = '';

        if (values.aodaac) {
            html += new Portal.cart.AodaacDataRowTemplate(this)._getDataDownloadEntry(values);
        }
        else if (values.wmsLayer.wfsLayer) {
            html += new Portal.cart.WfsDataRowTemplate(this)._getDataDownloadEntry(values);
        }
        else {
            html = OpenLayers.i18n('noDataMessage');
        }

        return html;
    },


    _downloadButton: function(collection) {

        var elementId = 'download-button-' + collection.uuid;
        this._createDownloadButton.defer(1, this, [elementId, collection]);
        return '';

    },

    _createDownloadButton: function(id, collection) {

        var menuItems = this._createMenuItems(collection);
        var downloadMenu = new Ext.menu.Menu({
            items: menuItems
        });

        new Ext.Button({
            text: OpenLayers.i18n('downloadButtonLabel'),
            icon: 'images/down.png',
            cls: 'navigationButton',
            scope: this,
            renderTo: id,
            menu: downloadMenu
        });

        var emailElement = this._emailTextFieldElement(collection.uuid);
        if (emailElement) {

            emailElement.on('click', function() {
                if (this.getValue() == OpenLayers.i18n('emailAddressPlaceholder')) {
                    this.set({ value: '' });
                }
            });
            emailElement.on('change', function() {
                this._saveEmailAddress(collection.uuid);
            }, this);

        }
    },

    _createMenuItems: function(collection) {

        var menuItems = [];

        if (collection.aodaac) {
            menuItems.push({text: OpenLayers.i18n('downloadAsNetCdfLabel'), handler: this._downloadAodaacHandler(collection, 'nc'), scope: this});
            menuItems.push({text: OpenLayers.i18n('downloadAsHdfLabel'), handler: this._downloadAodaacHandler(collection, 'hdf'), scope: this});
            menuItems.push({text: OpenLayers.i18n('downloadAsAsciiLabel'), handler: this._downloadAodaacHandler(collection, 'txt'), scope: this});
            menuItems.push({text: OpenLayers.i18n('downloadAsOpenDapUrlsLabel'), handler: this._downloadAodaacHandler(collection, 'urls'), scope: this});
        }
        else if (collection.wmsLayer && collection.wmsLayer.wfsLayer) {
            menuItems.push({text: OpenLayers.i18n('downloadAsCsvLabel'), handler: this._downloadWfsHandler(collection, 'csv'), scope: this});
            menuItems.push({text: OpenLayers.i18n('downloadAsGml3Label'), handler: this._downloadWfsHandler(collection, 'gml3'), scope: this});
            menuItems.push({text: OpenLayers.i18n('downloadAsShapefileLabel'), handler: this._downloadWfsHandler(collection, 'shape-zip', 'zip'), scope: this});
            if (collection.wmsLayer.urlDownloadFieldName) {
                menuItems.push({text: OpenLayers.i18n('downloadAsUrlsLabel'), handler: this._urlListDownloadHandler(collection), scope: this});
            }
        }


        return menuItems;
    },


    _getFileListEntries: function(values) {
        var links = values.downloadableLinks;
        var html = "";

        Ext.each(
            links,
            function(link) {
                html += this._getSingleFileEntry(link);
            },
            this
        );

        if (html) {
            return html;
        }

        return  this._makeSecondaryTextMarkup(OpenLayers.i18n('noFilesMessage'))
    },

    _getSingleFileEntry: function(link) {
        return this._makeExternalLinkMarkup(link.href, link.title);
    },

    _makeEntryMarkup: function(text) {
        return String.format('{0}', text);
    },

    _makeSecondaryTextMarkup: function(text) {
        return String.format('<span class="secondary-text">{0}</span>', text);
    },

    _makeExternalLinkMarkup: function(href, text) {
        if (!text) {
            text = href;
        }

        return String.format('<a href="{0}" target="_blank" class="external">{1}</a>', href, text);
    },

    downloadWithConfirmation: function(downloadUrl, downloadFilename, downloadControllerArgs) {
        this.downloadPanel.confirmationWindow.showIfNeeded(downloadUrl, downloadFilename, downloadControllerArgs);
    },

    _validateEmailAddress: function(address) {
        if (!address) {
            return false;
        }

        // From http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
        var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(address);
    },

    _emailTextFieldElement: function(uuid) {
        return Ext.get(Ext.query("#aodaac-email-address-" + uuid)[0]);
    },

    _saveEmailAddress: function(uuid) {
        Portal.data.ActiveGeoNetworkRecordStore.instance().
            addRecordAttribute(
                uuid,
                this.AODAAC_EMAIL_ADDRESS_ATTRIBUTE,
                this._emailTextFieldElement(uuid).getValue()
            );
    },

    _getEmailAddress: function(uuid) {
        var emailAddress = Portal.data.ActiveGeoNetworkRecordStore.instance().
            getRecordAttribute(
                uuid,
                this.AODAAC_EMAIL_ADDRESS_ATTRIBUTE
            );

        return emailAddress || OpenLayers.i18n('emailAddressPlaceholder');
    },

    _downloadWfsHandler: function(collection, format, fileExtension) {

        var downloadUrl = collection.wmsLayer.getWfsLayerFeatureRequestUrl(format);
        var extensionToUse = fileExtension ? fileExtension : format;
        var downloadFilename = collection.title + "." + extensionToUse;

        return function() {
            this.downloadWithConfirmation(downloadUrl, downloadFilename);
        };
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

    _urlListDownloadHandler: function(collection) {

        var downloadUrl = this._wfsUrlForGeoNetworkRecordWmsLayer(collection, 'csv');
        var downloadFilename = collection.title + "_URLs.txt";
        var additionalArgs = {
            action: 'urlList',
            layerId: collection.wmsLayer.grailsLayerId
        };

        return function() {
            this.downloadWithConfirmation(downloadUrl, downloadFilename, additionalArgs);
        };
    },

    _wfsUrlForGeoNetworkRecordWmsLayer: function(record, format) {
        return record.wmsLayer.getWmsLayerFeatureRequestUrl(format);
    },

    _wfsUrlForGeoNetworkRecordWfsLayer: function(record, format) {
        return record.wmsLayer.getWfsLayerFeatureRequestUrl(format);
    },

    _aodaacUrl: function(params, format, emailAddress) {
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
    }

});
