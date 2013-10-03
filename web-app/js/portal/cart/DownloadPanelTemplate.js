/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.cart');

Portal.cart.DownloadPanelTemplate = Ext.extend(Ext.XTemplate, {

    constructor: function() {

        var templateLines = [
            '<div class="download-collection">',
            '  <div class="title-row">',
            '    {title}',
            '  </div>',
            '  <div class="row">',
            '    <div class="subheading">Metadata</div>',
            '    {[this._getPointOfTruthLinkEntry(values)]}',
            '  </div>',
            '  <div class="row">',
            '    <div class="subheading">Data</div>',
            '    {[this._getDataFilterEntry(values)]}',
            '    {[this._getDataDownloadEntry(values)]}',
            '  </div>',
            '  <tpl if="downloadableLinks.length &gt; 0">',
            '  <div class="row">',
            '    <div class="subheading">Attached files</div>',
            '    {[this._getFileListEntries(values)]}',
            '  </div>',
            '  </tpl>',
            '</div>'
        ];

        Portal.cart.DownloadPanelTemplate.superclass.constructor.call(this, templateLines);
    },

    _getPointOfTruthLinkEntry: function(record) {

        var href = record.pointOfTruthLink.href;

        var html = this._makeExternalLinkMarkup(href, "View metadata record");

        return this._makeEntryMarkup(html);
    },

    _getDataFilterEntry: function(values) {

        var wmsLayer = values.wmsLayer;

        if (wmsLayer) {

            var cqlText = wmsLayer.getDownloadFilter();

            var html = cqlText ? "Filter applied: <code>" + cqlText + "</code>" : "No data filters applied.";

            return this._makeEntryMarkup(html);
        }

        return "";
    },

    _getDataDownloadEntry: function(values) {

        var wmsLayer = values.wmsLayer;
        var html;

        if (wmsLayer) {

            html = '<div id="download-button-' + values.uuid + '"></div>'; // Download button placeholder
        }
        else {

            html = this._makeSecondaryTextMarkup('No direct access to data available currently.');
        }

        return this._makeEntryMarkup(html);
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
            this._makeSecondaryTextMarkup('No attached files.')
        );
    },

    _getSingleFileEntry: function(link) {

        var html = this._makeExternalLinkMarkup(link.href, link.title);

        return this._makeEntryMarkup(html);
    },

    _makeEntryMarkup: function(text) {

        return '<div class="entry">' + text + '</div>';
    },

    _makeSecondaryTextMarkup: function(text) {

        return '<span class="secondary-text">' + text + '</span>';
    },

    _makeExternalLinkMarkup: function(href, text) {

        if (!text) {

            text = href;
        }

        return "<a href='" + href + "' target='_blank' class='external'>" + text + "</a>";
    }
});
