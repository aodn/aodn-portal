/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.cart');

Portal.cart.DownloadDataView = Ext.extend(Ext.DataView, {

    constructor:function (cfg) {

        var config = Ext.apply({
            id: "downloadDataView",
            store: Portal.data.ActiveGeoNetworkRecordStore.instance(),
            emptyText: OpenLayers.i18n("emptyCartText"),
            tpl: new Portal.cart.DownloadDataViewTemplate(),
            autoScroll: true
        }, cfg);

        Portal.cart.DownloadDataView.superclass.constructor.call(this, config);

        Ext.MsgBus.subscribe("downloadCart.cartContentsUpdated", function () {
            this.downloadItemsStore.load();
        }, this);
    }
});
