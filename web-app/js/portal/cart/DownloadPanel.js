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
            title: OpenLayers.i18n('stepHeader', { stepNumber: 3, stepDescription: OpenLayers.i18n('step3Description')}),
            headerCfg: {
                cls: 'steps'
            },
            autoScroll: true
        }, cfg);

        this.store = Portal.data.ActiveGeoNetworkRecordStore.instance();
        this.confirmationWindow = new Portal.cart.DownloadConfirmationWindow();

        Ext.apply(this, config);
        Portal.cart.DownloadPanel.superclass.initComponent.call(this, arguments);

        this.on('beforeshow', function() { this.onBeforeShow() }, this);
    },

    onBeforeShow: function() {
        this.generateContent();
    },

    generateContent: function() {
        var tpl = new Portal.cart.DownloadPanelTemplate(this);
        var html = '';

        // Reverse the order of items, last item added will be displayed first
        for (var i = this.store.data.items.length - 1; i >= 0; i--) {
            var item = this.store.data.items[i];
            html += tpl.apply(item.data);
        }

        if (!html) {
            html = this._contentForEmptyView();
        }

        this.update(html);
    },

    _contentForEmptyView: function() {
        return String.format('<i>{0}</i>', OpenLayers.i18n('noCollectionsMessage'));
    }
});
