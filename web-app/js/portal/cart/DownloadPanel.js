/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.cart');

Portal.cart.DownloadPanel = Ext.extend(Ext.Panel, {

    initComponent: function(cfg) {

        this.bodyContent = new Ext.Panel();
        this.initButtonPanel();

        this.emptyMessage = new Portal.common.EmptyCollectionStatusPanel({
            hidden: true,
            height: 35
        });

        var config = Ext.apply({
            autoScroll: true,
            boxMinWidth: 800,
            boxMaxWidth: 1024,
            title: OpenLayers.i18n('stepHeader', { stepNumber: 3, stepDescription: OpenLayers.i18n('step3Description')}),
            headerCfg: {
                cls: 'steps'
            },
            items: [
                this.buttonPanel,
                new Ext.Spacer({height: 10}),
                this.emptyMessage,
                this.bodyContent
            ]
        }, cfg);

        this.store = Portal.data.ActiveGeoNetworkRecordStore.instance();
        this.confirmationWindow = new Portal.cart.DownloadConfirmationWindow();

        Ext.apply(this, config);
        Portal.cart.DownloadPanel.superclass.initComponent.call(this, arguments);

        this._registerEvents();
    },

    _registerEvents: function() {
        this.on('beforeshow', function() { this.generateContent() }, this);
        Ext.MsgBus.subscribe(PORTAL_EVENTS.ACTIVE_GEONETWORK_RECORD_ADDED, function() { this.generateContent() }, this);
        Ext.MsgBus.subscribe(PORTAL_EVENTS.ACTIVE_GEONETWORK_RECORD_MODIFIED, function() { this.generateContent() }, this);
        Ext.MsgBus.subscribe(PORTAL_EVENTS.ACTIVE_GEONETWORK_RECORD_REMOVED, function() { this.generateContent() }, this);
    },

    generateContent: function() {
        if (this.rendered) {
            this.generateBodyContent();
        }
    },

    generateBodyContent: function() {
        var tpl = new Portal.cart.DownloadPanelItemTemplate(this);
        var html = '';

        // Reverse the order of items, last item added will be displayed first
        Ext.each(this.store.getLoadedRecords().reverse(), function(item) {
            var collection = item.data;

            html += this._generateBodyContentForCollection(tpl, collection, html);
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

        this.bodyContent.update(html);
    },

    _generateBodyContentForCollection: function(tpl, collection, html) {
        var service = new Portal.cart.InsertionService(this);
        var processedValues = service.insertionValues(collection);

        this._loadMenuItemsFromHandlers(processedValues, collection);

        return this._applyTemplate(tpl, processedValues);
    },

    _applyTemplate: function(tpl, values) {
        return tpl.apply(values);
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
                    'downloadrequested': function(downloadUrl, collection) {
                        log.debug('Download requested', downloadUrl, collection);
                    },
                    'downloadstarted': function(downloadUrl, collection) {
                        log.debug('Download started', downloadUrl, collection);
                    },
                    'downloadfailed': function(downloadUrl, collection, msg) {
                        Ext.Msg.alert(
                            OpenLayers.i18n('errorDialogTitle'),
                            OpenLayers.i18n('downloadErrorText')
                        );
                        log.error('Download failed', downloadUrl, collection, msg);
                    }
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
