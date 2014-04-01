/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.cart');

Portal.cart.DownloadPanelBody = Ext.extend(Ext.Panel, {

    initComponent: function() {

        var config = {
            autoScroll: true,
            boxMinWidth: 800,
            width: 1024
        };

        this.store = Portal.data.ActiveGeoNetworkRecordStore.instance();
        this.confirmationWindow = new Portal.cart.DownloadConfirmationWindow();

        Ext.apply(this, config);
        Portal.cart.DownloadPanelBody.superclass.initComponent.call(this, arguments);

    },

    generateContent: function() {
        var tpl = new Portal.cart.DownloadPanelItemTemplate();
        var html = '';

        // Reverse the order of items, last item added will be displayed first
        for (var i = this.store.data.items.length - 1; i >= 0; i--) {
            var item = this.store.data.items[i];
            var service = new Portal.cart.InsertionService(this);
            var processedValues = service.insertionValues(item.data);
            html += tpl.apply(processedValues);
        }

        if (!html) {
            html = this._contentForEmptyView();
        }

        this.update(html);
    },

    confirmDownload: function(downloadUrl, downloadFilename, downloadControllerArgs) {
        this.confirmationWindow.showIfNeeded(downloadUrl, downloadFilename, downloadControllerArgs);
    },

    _contentForEmptyView: function() {
        return String.format('<i>{0}</i>', OpenLayers.i18n('noCollectionsMessage'));
    }
});
