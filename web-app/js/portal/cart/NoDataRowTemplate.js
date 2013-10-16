
/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.cart');

Portal.cart.NoDataRowTemplate = Ext.extend(Ext.XTemplate, {

    constructor: function(downloadPanelTemplate) {
        this.downloadPanelTemplate = downloadPanelTemplate;

        var templateLines = [
            '<div class="row data">',
            '  <div class="subheading">' + OpenLayers.i18n('dataSubheading') + '</div>',
            '  {[this._getNoDataMessageEntry()]}',
            '</div>'
        ];

        Portal.cart.NoDataRowTemplate.superclass.constructor.call(this, templateLines);
    },

    applyWithControls: function(values) {
        return this.apply(values);
    },

    _getNoDataMessageEntry: function() {
        return this.downloadPanelTemplate._makeEntryMarkup(
            this.downloadPanelTemplate._makeSecondaryTextMarkup(
                OpenLayers.i18n('noDataMessage')
            )
        );
    }
});
