/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.cart');

Portal.cart.DownloadPanel = Ext.extend(Ext.Panel, {

    initComponent: function(cfg) {

        var config = Ext.apply({
            title: 'Data Download Tools',
            headerCfg: {
                cls: 'x-panel-header p-header-space'
            }
        }, cfg);

        this.store = Portal.data.ActiveGeoNetworkRecordStore.instance();

        Ext.apply(this, config);
        Portal.cart.DownloadPanel.superclass.initComponent.call(this, arguments);

        this.on('beforeshow', function() { this.onBeforeShow() }, this);
    },

    onBeforeShow: function() {

        this.generateContent();
    },

    generateContent: function() {

        var tpl = new Portal.cart.DownloadPanelTemplate();
        var html = '';

        Ext.each(this.store.data.items, function(item) {

            var collection = item.data;

            html += tpl.apply(collection);
        });

        this.update(html);
    }
});
