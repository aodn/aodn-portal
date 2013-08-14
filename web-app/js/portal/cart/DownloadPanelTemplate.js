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
            '<div class="cart-row">',
            '  <div class="cart-title-row">',
            '    <span class="cart-title">{title}</span>',
            '  </div>',
            '  <div class="cart-files" >{[this._getFileListMarkup(values.links)]}</div>',
            '</div>'
        ];

        Portal.cart.DownloadPanelTemplate.superclass.constructor.call(this, templateLines);
    },

    _getFileListMarkup: function(links) {

        var subFilesTemplate = new Ext.XTemplate(
            '<div class="cart-file-row" >',
            '{[this._getMarkupForOneFile(values)]}',
            '</div>',
            this
        );

        var html = "";

        Ext.each(links, function(link) {
            if (Portal.cart.Downloader.isDownloadableLink(link)) {
                html += subFilesTemplate.apply(link);
            }
        });

        return html;
    },

    _getMarkupForOneFile: function(values) {

        return "<i>" + values.title + "</i>" + this._fileExtensionInfo(values.type);
    },

    _fileExtensionInfo: function(type) {

        var extension = this.mimeTypes[type];

        return extension ? " (." + extension + ")" : "";
    }
});
