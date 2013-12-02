/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.cart');

Portal.cart.WfsDataRowTemplate = Ext.extend(Ext.XTemplate, {

    constructor: function(downloadPanelTemplate) {
        this.downloadPanelTemplate = downloadPanelTemplate;

        var templateLines = [
            '<div class="x-panel-body x-box-layout-ct">',
            '  {[this._getDataDownloadEntry(values)]}',
            '</div>'
        ];

        Portal.cart.WfsDataRowTemplate.superclass.constructor.call(this, templateLines);
    },

    _getDataDownloadEntry: function(values) {
        return String.format('<div id="wfs-download-button-{0}"></div>', values.uuid); // Download button placeholder
    }


});
