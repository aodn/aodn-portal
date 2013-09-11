/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.cart');

Portal.cart.DownloadPanelTemplate = Ext.extend(Ext.XTemplate, {

    constructor: function() {

        this.mimeTypes = Portal.app.config.downloadCartMimeTypeToExtensionMapping;

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
            '    {[this._getDataFilterEntry(values.wmsLayer)]}',
            '    {[this._getDataDownloadEntry(values.wmsLayer)]}',
            '  </div>',
            '  <div class="row">',
            '    <div class="subheading">Attached files</div>',
            '    {[this._getFileListMarkup(values.downloadableLinks)]}',
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

    _getDataFilterEntry: function(wmsLayer) {

        if (wmsLayer) {

            var html;
            var cqlText = wmsLayer.getCqlFilter();

            if (cqlText) {

                html = "Filter applied: <code>" + cqlText + "</code>";
            }
            else {

                html = "<i>No filters applied.</i>";
            }

            return this._wrapInEntryMarkup(html);
        }
        else {

            return "";
        }
    },

    _getDataDownloadEntry: function(wmsLayer) {

        var html;

        if (wmsLayer) {

            html = '<table cellspacing="0" class="x-btn x-btn-noicon" id="ext-comp-999999" style="width: auto;"><tbody class="x-btn-small x-btn-icon-small-left"><tr><td class="x-btn-tl"><i>&nbsp;</i></td><td class="x-btn-tc"></td><td class="x-btn-tr"><i>&nbsp;</i></td></tr><tr><td class="x-btn-ml"><i>&nbsp;</i></td><td class="x-btn-mc"><em unselectable="on" class="x-btn-split" id="ext-gen9999"><button type="button" id="ext-gen99999" class=" x-btn-text">Download as...</button></em></td><td class="x-btn-mr"><i>&nbsp;</i></td></tr><tr><td class="x-btn-bl"><i>&nbsp;</i></td><td class="x-btn-bc"></td><td class="x-btn-br"><i>&nbsp;</i></td></tr></tbody></table>';
        }
        else {

            html = "<i>No direct-access to data available currently.</i>"
        }

        return this._wrapInEntryMarkup(html);
    },

    _getFileListMarkup: function(links) {

        var html = "";

        links = [
            {
                title: "cool_report.pdf",
                href: ""
            },
            {
                title: "presentation.ppt",
                href: ""
            }
        ];

        Ext.each(
            links,
            function(link) {
                html += this._getMarkupForOneFile(link);
            },
            this
        );

        if (html == "") html = this._wrapInEntryMarkup("<i>No attached files.</i>");

        return html;
    },

    _wrapInEntryMarkup: function(text) {

        return '<div class="entry">' + text + '</div>';
    },

    _externalLinkMarkup: function(href, text) {

        if (!text) text = href;

        return "<a href='" + href + "' target='_blank' class='external'>" + text + "</a>";
    },

    _getMarkupForOneFile: function(link) {

        var html = this._externalLinkMarkup(link.href, link.title); // Todo - DN: link.title or link.name ?

        return this._wrapInEntryMarkup(html);
    }
});
