/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.cart');

Portal.cart.DownloadPanelBody = Ext.extend(Ext.Panel, {

    initComponent: function() {

        this.bodyContent = new Ext.Panel();
        this.initButtonPanel();

        this.emptyMessage = new Portal.common.EmptyCollectionStatusPanel({
            hidden: true,
            height: 35
        });

        var config = {
            autoScroll: true,
            boxMinWidth: 800,
            width: 1024,
            items: [
                this.buttonPanel,
                new Ext.Spacer({height: 10}),
                this.emptyMessage,
                this.bodyContent
            ]
        };

        this.store = Portal.data.ActiveGeoNetworkRecordStore.instance();
        this.confirmationWindow = new Portal.cart.DownloadConfirmationWindow();

        Ext.apply(this, config);
        Portal.cart.DownloadPanelBody.superclass.initComponent.call(this, arguments);
    },

    generateBodyContent: function() {
        var tpl = new Portal.cart.DownloadPanelItemTemplate(this);
        var html = '';

        // Reverse the order of items, last item added will be displayed first
        Ext.each(this.store.getLoadedRecords().reverse(), function(item) {
            var collection = item.data;

            var service = new Portal.cart.InsertionService(this);
            var processedValues = service.insertionValues(collection);

            this._loadMenuItemsFromHandlers(processedValues, collection);

            html += tpl.apply(processedValues);
        }, this);

        if (!html) {
            html = "";
            this.emptyMessage.show();
            this.buttonPanel.hide();
        }
        else {
            this.emptyMessage.hide();
            this.buttonPanel.show();
        }

        // fix for tests
        if (this.rendered) {
            this.bodyContent.update(html);
        }
    },

    initButtonPanel: function () {
        this.buttonPanel = new Ext.Panel({
            border: true,
            flex: 1,
            items: [
                {
                    xtype: 'button',
                    text: OpenLayers.i18n("clearAllButtonLabel") ,
                    tooltip: OpenLayers.i18n("clearAllButtonTooltip"),
                    cls: "floatRight buttonPad",
                    scope: this,
                    handler: this._clearAllAndReset
                }
            ]
        });
    },

    _clearAllAndReset: function () {
        Portal.data.ActiveGeoNetworkRecordStore.instance().removeAll();
        setViewPortTab(0);
    },

    _loadMenuItemsFromHandlers: function(processedValues, collection) {

        if (!processedValues.menuItems) {
            processedValues.menuItems = [];
        }

        Ext.each(collection.dataDownloadHandlers, function(handler) {

            Ext.each(handler.getDownloadOptions(), function(downloadOption) {

                var newMenuItem = {
                    text: OpenLayers.i18n(downloadOption.textKey),
                    handler: function() {
                        this.confirmDownload(collection, this, downloadOption.handler, downloadOption.handlerParams, downloadOption.textKey)
                    },
                    scope: this
                };

                processedValues.menuItems.push(newMenuItem);
            }, this);
        }, this);
    },

    confirmDownload: function(collection, generateUrlCallbackScope, generateUrlCallback, params, textKey) {

        params.onAccept = function(callbackParams) {
            var downloader = new Portal.cart.Downloader({
                listeners: {
                    'downloadrequested': function(downloadUrl) { log.debug('Download requested', downloadUrl); },
                    'downloadstarted': function(downloadUrl) { log.debug('Download started', downloadUrl); },
                    'downloadfailed': function(downloadUrl, msg) { log.debug('Download failed', downloadUrl, msg); }
                }
            });

            downloader.download(collection, generateUrlCallbackScope, generateUrlCallback, callbackParams);
            trackUsage(
                OpenLayers.i18n('downloadTrackingCategory'),
                OpenLayers.i18n('downloadTrackingActionPrefix') + OpenLayers.i18n(textKey),
                collection.title
            );
        };

        this.confirmationWindow.show(params);
    }
});
