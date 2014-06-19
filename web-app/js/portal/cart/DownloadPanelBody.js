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
        var tpl = new Portal.cart.DownloadPanelItemTemplate(this);
        var html = '';

        // Reverse the order of items, last item added will be displayed first
        for (var i = this.store.data.items.length - 1; i >= 0; i--) {
            var item = this.store.data.items[i];
            var collection = item.data;

            var service = new Portal.cart.InsertionService(this);
            var processedValues = service.insertionValues(collection);

            this._loadMenuItemsFromHandlers(processedValues, collection);

            html += tpl.apply(processedValues);
        }

        if (!html) {
            html = this._contentForEmptyView();
        }

        // fix for tests
        if (this.rendered) {
            this.update(html);
        }
    },

    _loadMenuItemsFromHandlers: function(processedValues, collection) {

        Ext.each(collection.dataDownloadHandlers, function(handler) {

            Ext.each(handler.getDownloadOptions(collection), function(downloadOption) {

                var newMenuItem = {
                    text: OpenLayers.i18n(downloadOption.textKey) + ' (new)',
                    handler: (function(_this, _collection) { return function() { // TODO - DN: Closure trickery might not be needed. Check.
                        console.log('Menu item from handlers');
                        _this.confirmDownload(_collection, this, downloadOption.handler, downloadOption.handlerParams)
                    }}(this, collection)),
                    scope: this
                };

                processedValues.menuItems.push(newMenuItem);
            }, this);
        }, this);
    },

    confirmDownload: function(collection, generateUrlCallbackScope, generateUrlCallback, params) {

        params.onAccept = function(callbackParams) {
            var downloader = new Portal.cart.Downloader();
            downloader.download(collection, generateUrlCallbackScope, generateUrlCallback, callbackParams);
        };

        this.confirmationWindow.showIfNeeded(params);
    },

    _contentForEmptyView: function() {
        return String.format('<i>{0}</i>', OpenLayers.i18n('noCollectionsMessage'));
    }
});
