/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.cart');

Portal.cart.DownloadPanel = Ext.extend(Ext.grid.GridPanel, {

    initComponent: function(cfg) {

        var config = Ext.apply({
            autoExpandColumn: 'description',
            title: 'Data Download Cart',
            headerCfg: {
                cls: 'x-panel-header p-header-space'
            },
            store: Portal.data.ActiveGeoNetworkRecordStore.instance(),
            colModel: new Portal.cart.DownloadColumnModel(),
            view: new Portal.cart.DownloadGridView(),
            bbar: new Portal.cart.DownloadToolbar()
        }, cfg);

        Ext.apply(this, config);
        Portal.cart.DownloadPanel.superclass.initComponent.call(this, arguments);

        this.on('beforeShow', this.onBeforeShow, this);
    },

    onBeforeShow: function() {

        this.view.refresh();
    }
});
