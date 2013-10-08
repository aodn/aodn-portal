/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.cart');

Portal.cart.DownloadPanelTemplate = Ext.extend(Ext.XTemplate, {

    constructor: function(downloadPanel) {

        this.downloadPanel = downloadPanel;

        var templateLines = [
            '<div class="download-collection">',
            '  <div class="title-row">',
            '    {title}',
            '  </div>',
            '  {[this._dataRowTemplate(values)]}',
            '  <div class="row metadata">',
            '    <div class="subheading">' + OpenLayers.i18n('metadataSubheading') + '</div>',
            '    {[this._getPointOfTruthLinkEntry(values)]}',
            '  </div>',
            '  <tpl if="downloadableLinks.length &gt; 0">',
            '  <div class="row files">',
            '    <div class="subheading">' + OpenLayers.i18n('filesSubheading') + '</div>',
            '    {[this._getFileListEntries(values)]}',
            '  </div>',
            '  </tpl>',
            '</div>'
        ];

        Portal.cart.DownloadPanelTemplate.superclass.constructor.call(this, templateLines);
    },

    _getPointOfTruthLinkEntry: function(record) {
        var href = record.pointOfTruthLink.href;

        var html = this._makeExternalLinkMarkup(href, OpenLayers.i18n('metadataLinkText'));

        return this._makeEntryMarkup(html);
    },

    _dataRowTemplate: function(values) {
        var html = '';

        if (values.aodaac) {
            html += new Portal.cart.AodaacDataRowTemplate(this).applyWithControls(values);
        }
        else if (values.wmsLayer) {
            html += new Portal.cart.WfsDataRowTemplate(this).applyWithControls(values);
        }

        return html;
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

        return this._makeEntryMarkup(
            this._makeSecondaryTextMarkup(OpenLayers.i18n('noFilesMessage'))
        );
    },

    _getSingleFileEntry: function(link) {
        var html = this._makeExternalLinkMarkup(link.href, link.title);

        return this._makeEntryMarkup(html);
    },

    _makeEntryMarkup: function(text) {
        return String.format('<div class="entry">{0}</div>', text);
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

    downloadWithConfirmation: function(downloadUrl) {
        this.downloadPanel.confirmationWindow.showIfNeeded(downloadUrl);
    }
});
