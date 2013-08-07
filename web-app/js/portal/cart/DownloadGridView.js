/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.cart');

Portal.cart.DownloadGridView = Ext.extend(Ext.grid.GridView, {

    constructor: function() {

        var config = {
            autoFill: true,
            emptyText: 'No downloads selected'
        };

        Portal.cart.DownloadGridView.superclass.constructor.call(this, config);
    }
});
