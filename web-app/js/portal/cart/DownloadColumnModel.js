/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.cart');

Portal.cart.DownloadColumnModel = Ext.extend(Ext.grid.ColumnModel, {
    constructor: function() {
        var config = {
            defaults: {
                menuDisabled: true
            },
            columns: [
                {
                    id: 'description',
                    header: OpenLayers.i18n('descHeading')
                },
                {
                    id: 'remove'
                }
            ]
        }

        Portal.cart.DownloadColumnModel.superclass.constructor.call(this, config);
    }
});
