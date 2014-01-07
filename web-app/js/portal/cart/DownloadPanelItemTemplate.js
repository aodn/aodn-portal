/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.cart');

Portal.cart.DownloadPanelItemTemplate = Ext.extend(Ext.XTemplate, {

    constructor: function (downloadPanel) {

        this.downloadPanel = downloadPanel;

        var templateLines = [
            '<div class="downloadPanelResultsWrapper">',
            '  <div class="x-panel-header resultsHeaderBackground">',
            '    <h3 class="resultsRowHeader">{title}</h3>',
            '    <div class="floatRight downloadButtonWrapper" id="download-button-{uuid}">{[this._downloadButton(values)]}</div>',
            '  </div>',
            '  <div style="overflow:hidden;">',
            '    <div class="floatLeft dataFilterEntry">',
            '      <div class="resultsTextBody">',
            '        {[this._getDataFilterEntry(values)]}',
            '      </div>',
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
            '    <div class="floatRight resultsTextMsgs">',
            '      {[this._dataSpecificMarkup(values)]}',
            '    </div>',
            '  </div>',
            '</div>'
        ];

        Portal.cart.DownloadPanelItemTemplate.superclass.constructor.call(this, templateLines);
    },

    _getDataFilterEntry: function (values) {
        return this._getRowTemplate(values).getDataFilterEntry(values);
    },

    _getPointOfTruthLinkEntry: function (record) {
        var href = record.pointOfTruthLink.href;
        return this._makeExternalLinkMarkup(href, OpenLayers.i18n('metadataLinkText'));
    },

    _dataSpecificMarkup: function (values) {
        return this._getRowTemplate(values).getDataSpecificMarkup(values);
    },

    _downloadButton: function (collection) {
        var elementId = 'download-button-' + collection.uuid;

        if (collection.aodaac || collection.wmsLayer.wfsLayer) {
            this._createDownloadButton.defer(1, this, [elementId, collection]);
        }
        return '';
    },

    _createDownloadButton: function (id, collection) {
        new Ext.Button({
            text: OpenLayers.i18n('downloadButtonLabel'),
            icon: 'images/down.png',
            cls: 'navigationButton',
            scope: this,
            renderTo: id,
            menu: new Ext.menu.Menu({
                items: this._getRowTemplate(collection).createMenuItems(collection)
            })
        });

        this._getRowTemplate(collection).attachMenuEvents(collection);
    },

    _getFileListEntries: function (values) {
        var links = values.downloadableLinks;
        var html = "";

        Ext.each(
            links,
            function (link) {
                html += this._getSingleFileEntry(link);
            },
            this
        );

        return html || this._makeSecondaryTextMarkup(OpenLayers.i18n('noFilesMessage'));
    },

    _getSingleFileEntry: function (link) {
        return this._makeExternalLinkMarkup(link.href, link.title);
    },

    _makeSecondaryTextMarkup: function (text) {
        return String.format('<span class="secondary-text">{0}</span>', text);
    },

    _makeExternalLinkMarkup: function (href, text) {
        return String.format('<a href="{0}" target="_blank" class="external">{1}</a>', href, (text || href));
    },

    downloadWithConfirmation: function (downloadUrl, downloadFilename, downloadControllerArgs) {
        this.downloadPanel.confirmDownload(downloadUrl, downloadFilename, downloadControllerArgs);
    },

    _getRowTemplate: function (values) {
        var config = {
            downloadConfirmation: this.downloadWithConfirmation,
            downloadConfirmationScope: this
        };
        if (values.aodaac) {
            return this._getAodaacDataRowTemplateInstance(config);
        }
        else if (values.wmsLayer.wfsLayer) {
            return this._getWfsDataRowTemplateInstance(config);
        }
        return this._getNoDataRowTemplateInstance(config);
    },

    _getAodaacDataRowTemplateInstance: function(config) {
        if (!this.aodaacDataRowTemplate) {
            this.aodaacDataRowTemplate = new Portal.cart.AodaacDataRowTemplate(config);
        }

        return this.aodaacDataRowTemplate;
    },

    _getWfsDataRowTemplateInstance: function(config) {
        if (!this.wfsDataRowTemplate) {
            this.wfsDataRowTemplate = new Portal.cart.WfsDataRowTemplate(config);
        }

        return this.wfsDataRowTemplate;
    },

    _getNoDataRowTemplateInstance: function(config) {
        if (!this.noDataRowTemplate) {
            this.noDataRowTemplate = new Portal.cart.NoDataRowTemplate(config);
        }

        return this.noDataRowTemplate;
    }
});
