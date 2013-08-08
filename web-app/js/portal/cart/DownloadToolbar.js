/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.cart');

Portal.cart.DownloadToolbar = Ext.extend(Ext.Toolbar, {

    constructor: function() {

        var config = {
            items: [
                {
                    text: OpenLayers.i18n('okdownload')
                },
                {
                    text: OpenLayers.i18n('clearcart'),
                    listeners: {
                        'click': function(button, event) {
                            Portal.data.ActiveGeoNetworkRecordStore.instance().removeAll();
                        }
                    }
                }
            ]
        };

        Portal.cart.DownloadToolbar.superclass.constructor.call(this, config);
    }
});
