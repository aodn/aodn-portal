/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.cart');

Portal.cart.DownloadPanelTemplate = Ext.extend(Ext.XTemplate, {

    constructor: function() {

        this.mimeTypes = Portal.app.config.downloadCartMimeTypeToExtensionMapping

        var templateLines = [
            '<div class="cart-row">',
            '  <div class="cart-title-row">',
            '    <span class="cart-title">{title}</span>',
            '  </div>',
            '  <div class="cart-files" >{[this._getFileListMarkup(values.links)]}</div>',
            '</div>',
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
        var self = this;

        Ext.each(links, function(link) {
            if (self._isDownloadable(link)) {
                html += subFilesTemplate.apply(link);
            }
        });

        return html;
    },

    _isDownloadable: function(link) {
        return (this._isDownloadableProtocol(link.protocol) && this.mimeTypes[link.type]);
    },

    _isDownloadableProtocol: function(protocol) {
        var protocols = this._parseProtocols(Portal.app.config.downloadCartDownloadableProtocols);
        return (protocols.indexOf(protocol) != -1);
    },

    // TODO: refactor: cut and paste from ResultsGrid.
    _parseProtocols: function(protocols) {
		var result = [];

		Ext.each(protocols.split("\n"), function(protocol) {
			result.push(protocol.trim())
		});

		return result;
	},

    _getMarkupForOneFile: function(values) {
        return "<i>" + values.title + "</i> (" + this.mimeTypes[values.type] + ")<br/>";
    }
});
