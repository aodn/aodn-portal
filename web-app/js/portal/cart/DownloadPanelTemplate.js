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
            '  <div class="row">',
            '    <div class="subheading">Attached files</div>',
            '    {[this._getFileListEntries(values)]}',
            '  </div>',
            '</div>'
        ];

        Portal.cart.DownloadPanelTemplate.superclass.constructor.call(this, templateLines);
    },

    _getPointOfTruthLinkEntry: function(record) {

        var href = record.pointOfTruthLink.href;

        var html = this._externalLinkMarkup(href, "View metadata record");

        return this._wrapInEntryMarkup(html);
    },

    _getDataFilterEntry: function(values) {

        var wmsLayer = values.wmsLayer;

        if (wmsLayer) {

            var html;
            var cqlText = wmsLayer.getCqlFilter();

            if (cqlText) {

                html = "Filter applied: <code>" + cqlText + "</code>";
            }
            else {

                html = "No data filters applied.";
            }

            return this._wrapInEntryMarkup(html);
        }
        else {

            return "";
        }
    },

    _getDataDownloadEntry: function(values) {

        var wmsLayer = values.wmsLayer;
        var html;

        if (wmsLayer) {

            html = '<div id="download-button-' + values.uuid + '"></div>'; // Download button placeholder
        }
        else {

            html = '<span class="secondary-text">No direct-access to data available currently.</span>'
        }

        return this._wrapInEntryMarkup(html);
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

        if (html == "") html = this._wrapInEntryMarkup('<span class="secondary-text">No attached files.</span>');

        return html;
    },

    _getSingleFileEntry: function(link) {

        var html = this._externalLinkMarkup(link.href, link.title); // Todo - DN: link.title or link.name ?

        return this._wrapInEntryMarkup(html);
    },

    _wrapInEntryMarkup: function(text) {

        return '<div class="entry">' + text + '</div>';
    },

    _externalLinkMarkup: function(href, text) {

        if (!text) text = href;

        return "<a href='" + href + "' target='_blank' class='external'>" + text + "</a>";
    }
});
