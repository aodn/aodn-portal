/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.cart');

Portal.cart.DownloadPanel = Ext.extend(Ext.grid.GridPanel, {

    initComponent: function (cfg) {

        var config = Ext.apply({

            autoExpandColumn: 'description',

            title: 'Data Download Cart',

            headerCfg: {
                cls: 'x-panel-header p-header-space'
            },

            id: "downloadDataView",
            store: Portal.data.ActiveGeoNetworkRecordStore.instance(),
            emptyText: OpenLayers.i18n("emptyCartText"),
            colModel: new Ext.grid.ColumnModel({
                defaults: {
                    menuDisabled: true
                },
                columns: [
                    {
                        id: 'description',
                        header: OpenLayers.i18n('descHeading'),
                        tpl: new Portal.cart.DownloadPanelTemplate()
                    }
                ]
            })

        }, cfg);

        Ext.apply(this, config);
        Portal.cart.DownloadPanel.superclass.initComponent.call(this, arguments);

        // Ext.MsgBus.subscribe("downloadCart.cartContentsUpdated", function () {
        //     this.downloadItemsStore.load();
        // }, this);
    }
});
