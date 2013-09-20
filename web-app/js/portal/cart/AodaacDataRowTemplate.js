/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.cart');

Portal.cart.AodaacDataRowTemplate = Ext.extend(Ext.XTemplate, {

    constructor: function(downloadPanelTemplate) {

        this.downloadPanelTemplate = downloadPanelTemplate;

        var templateLines = [
            '  <div class="row">',
            '    <div class="subheading">Data</div>',
            '    {[this._getDataFilterEntry(values)]}',
            '    {[this._getDataDownloadEntry(values)]}',
            '  </div>'
        ];

        Portal.cart.AodaacDataRowTemplate.superclass.constructor.call(this, templateLines);
    },

    _getDataFilterEntry: function(values) {

        var aodaacParameters = values.aodaac;

        if (aodaacParameters) {

            var html = this._aodaacParamatersMarkup(aodaacParameters);

            return this.downloadPanelTemplate._makeEntryMarkup(html);
        }

        return "";
    },

    _getDataDownloadEntry: function(values) {

        var aodaacParameters = values.aodaac;
        var html;

        if (aodaacParameters) {

            html = '<div id="aodaac-download-button-' + values.uuid + '"></div>'; // Download button placeholder
        }
        else {

            html = this.downloadPanelTemplate._makeSecondaryTextMarkup('No direct access to data available currently.');
        }

        return this.downloadPanelTemplate._makeEntryMarkup(html);
    },

    _aodaacParamatersMarkup: function(params) {

        return "" + // Todo - DN: Dictionarise
            "Parameters:<br>" +
            "<code>" +
            "Date range start: " + aodaacParameters.dateRangeStart +
            "</code>";
    }
});
