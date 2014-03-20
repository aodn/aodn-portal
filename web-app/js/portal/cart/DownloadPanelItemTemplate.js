/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.cart');

Portal.cart.DownloadPanelItemTemplate = Ext.extend(Ext.XTemplate, {

    constructor: function (downloadPanel) {

        this.htmlArgs = {
            dataFilters: OpenLayers.i18n('noDataMessage'),
            dataMarkup: '',
            menuItems: {
                item1: {

                },
                item2: {

                },
                item3: {

                }
            }
        }

        this.downloadPanel = downloadPanel;

        var templateLines = [
            '<div class="downloadPanelResultsWrapper">',
            '  <div class="x-panel-header resultsHeaderBackground">',
            '    <h3 class="resultsRowHeader">{title}</h3>',
            '    <div class="floatRight downloadButtonWrapper" id="download-button-{uuid}">{[this._downloadButton(values)]}</div>',
            '  </div>',
            '  <div style="overflow:hidden;">',
            '    <div class="floatLeft dataFilterEntry" style="width:650px">',
            '      <div class="resultsTextBody">',
            '        {[this._getDataFilterEntry(values)]}',
            '      </div>',
            '      <div class="floatLeft resultsTextBody">',
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
            '    <div class="floatRight" id="resultsTextMsgs-{uuid}" style="padding-top:4px">',
            '      {[this._dataSpecificMarkup(values)]}',
            '    </div>',
            '  </div>',
            '</div>'
        ];

        Portal.cart.DownloadPanelItemTemplate.superclass.constructor.call(this, templateLines);
    },

    _getDataFilterEntry: function (values) {
        return String.format('<i>{0}</i>', this.htmlArgs.dataFilters);
    },

    _getPointOfTruthLinkEntry: function (record) {
        var markup;

        if (record.pointOfTruthLink) {
            markup = this._makeExternalLinkMarkup(record.pointOfTruthLink.href, OpenLayers.i18n('metadataLinkText'));
        }

        return markup;
    },

    _dataSpecificMarkup: function (values) {
        return this.htmlArgs.dataMarkup;
    },

    _downloadButton: function (collection) {
        var elementId = 'download-button-' + collection.uuid;
        this._createDownloadButton.defer(1, this, [elementId, collection]);

        return '';
    },

    _createDownloadButton: function (id, collection) {
        if (this.htmlArgs.menuItems) {
            new Ext.Button({
                text: OpenLayers.i18n('downloadButtonLabel'),
                icon: 'images/down.png',
                cls: 'navigationButton',
                scope: this,
                renderTo: id,
                menu: new Ext.menu.Menu({
                    items: this.htmlArgs.menuItems
                })
            });

            //this._getRowTemplate(collection).attachMenuEvents(collection);
        }
    },

    _getFileListEntries: function (values) {
        var links = values.downloadableLinks;
        var html = "";
        var htmlBreak = '<br>';

        Ext.each(
            links,
            function (link) {
                html += this._getSingleFileEntry(link);
                html += htmlBreak;
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
    }
});
