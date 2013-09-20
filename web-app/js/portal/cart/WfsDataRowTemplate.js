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
            '  <div class="row">',
            '    <div class="subheading">Data</div>',
            '    {[this._getDataFilterEntry(values)]}',
            '    {[this._getDataDownloadEntry(values)]}',
            '  </div>'
        ];

        Portal.cart.WfsDataRowTemplate.superclass.constructor.call(this, templateLines);
    },

    _getDataFilterEntry: function(values) {

        var wmsLayer = values.wmsLayer;

        if (wmsLayer) {

            var cqlText = wmsLayer.getCqlFilter();

            var html = cqlText ? "Filter applied: <code>" + cqlText + "</code>" : "No data filters applied.";

            return this.downloadPanelTemplate._makeEntryMarkup(html);
        }

        return "";
    },

    _getDataDownloadEntry: function(values) {

        var wmsLayer = values.wmsLayer;
        var html;

        if (wmsLayer) {

            html = '<div id="wfs-download-button-' + values.uuid + '"></div>'; // Download button placeholder
        }
        else {

            html = this.downloadPanelTemplate._makeSecondaryTextMarkup('No direct access to data available currently.');
        }

        return this.downloadPanelTemplate._makeEntryMarkup(html);
    }
});
