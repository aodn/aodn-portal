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
            '<div class="x-panel-body x-box-layout-ct">',
            '  {[this._getDataDownloadEntry(values)]}',
            '</div>'
        ];

        Portal.cart.AodaacDataRowTemplate.superclass.constructor.call(this, templateLines);
    },

    _getDataDownloadEntry: function(values) {

        var html;
        var aodaacParameters = values.aodaac;

        if (aodaacParameters) {
            html  = '<div class="delayedDownloadForm">' +
                '  <input type="text" id="aodaac-email-address-{0}" value="{1}">' +
                '  <div><small>{2}</small></div>' +
                '  <div class="clear"></div>' +
                '</div>';
            html = String.format(html, values.uuid, this.downloadPanelTemplate._getEmailAddress(values.uuid), this._getNotificationBlurbEntry());
        }

        return html;
    },

    _getNotificationBlurbEntry: function() {
        return OpenLayers.i18n('notificationBlurbMessage');
    }




});
