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
            '  {[this._dataRowTemplate(values)]}',
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

    _dataRowTemplate: function(values) {

        var html = '';

        if (values.wmsLayer) {

            html += new Portal.cart.WfsDataRowTemplate(this).apply(values)
        }

        if (values.aodaac) {

            html += new Portal.cart.AodaacDataRowTemplate(this).apply(values);
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
