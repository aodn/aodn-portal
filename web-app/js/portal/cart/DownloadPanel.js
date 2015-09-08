/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.cart');

Portal.cart.DownloadPanel = Ext.extend(Ext.Panel, {

    WIDTH: 925,

    initComponent: function(cfg) {

        this.bodyContent = new Ext.Panel({
            cls: 'downloadPanelItem',
            width: this.WIDTH
        });
        this.initButtonPanel();

        this.emptyMessage = new Portal.common.EmptyCollectionStatusPanel({
            hidden: true
        });

        var config = Ext.apply({
            autoScroll: true,
            title: OpenLayers.i18n('stepHeader', { stepNumber: 3, stepDescription: OpenLayers.i18n('step3Description')}),
            headerCfg: {
                cls: 'steps'
            },
            bodyCfg: {
                cls: 'downloadPanelBody'
            },
            items: [
                new Ext.Spacer({height: 10}),
                this.buttonPanel,
                new Ext.Spacer({height: 10}),
                this.emptyMessage,
                this.bodyContent
            ]
        }, cfg);

        this.confirmationWindow = new Portal.cart.DownloadConfirmationWindow();

        Ext.apply(this, config);
        Portal.cart.DownloadPanel.superclass.initComponent.call(this, arguments);

        this.downloader = this._initDownloader();
        this._registerEvents();
    },

    _initDownloader: function() {
        return new Portal.cart.Downloader({
            listeners: {
                'downloadrequested': function(downloadUrl, collection) {
                    this.onDownloadRequested(downloadUrl, collection);
                },
                'downloadstarted': function(downloadUrl, collection) {
                    this.onDownloadStarted(downloadUrl, collection);
                },
                'downloadfailed': function(downloadUrl, collection, msg) {
                    this.onDownloadFailed(downloadUrl, collection, msg);
                },
                scope: this
            }
        });
    },

    _registerEvents: function() {
        this.on('beforeshow', function() { this.generateContent() }, this);
        Ext.MsgBus.subscribe(PORTAL_EVENTS.DATA_COLLECTION_ADDED, function() { this.generateContent() }, this);
        Ext.MsgBus.subscribe(PORTAL_EVENTS.DATA_COLLECTION_REMOVED, function() { this.generateContent() }, this);
    },

    onDownloadRequested: function(downloadUrl, collection) {
        log.debug('Download requested', downloadUrl, collection);
        this.generateContent();
    },

    onDownloadStarted: function(downloadUrl, collection) {
        log.debug('Download started', downloadUrl, collection);
        this.generateContent();
    },

    onDownloadFailed: function(downloadUrl, collection, msg) {
        Ext.Msg.alert(
            OpenLayers.i18n('errorDialogTitle'),
            OpenLayers.i18n('downloadErrorText')
        );
        log.error('Download failed', downloadUrl, collection, msg);
        this.generateContent();
    },

    generateContent: function() {
        if (this.rendered) {
            this.generateBodyContent();
        }
    },

    generateBodyContent: function() {
        var tpl = new Portal.cart.DownloadPanelItemTemplate({
            dataCollectionStore: this.dataCollectionStore
        });
        var html = '';

        Ext.each(this.dataCollectionStore.getLoadedRecords(), function(collectionRecord) {

            html += this._generateBodyContentForCollection(tpl, collectionRecord);
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

    _generateBodyContentForCollection: function(tpl, collection) {
        var service = new Portal.cart.InsertionService(this);
        var processedValues = service.insertionValues(collection);

        this._loadMenuItemsFromHandlers(processedValues, collection);

        return this._applyTemplate(tpl, processedValues);
    },

    _applyTemplate: function(tpl, values) {
        return tpl.apply(values);
    },

    initButtonPanel: function() {

         this.resetLink = new Ext.ux.Hyperlink({
            text: OpenLayers.i18n("clearLinkLabel", {text: OpenLayers.i18n('clearAndResetLabel')}) ,
            tooltip: OpenLayers.i18n("clearAllButtonTooltip"),
            cls: "clearFiltersLink buttonPad"
        });
        this.resetLink.on('click', function() {
            this._clearAllAndReset();
        }, this);

        this.buttonPanel = new Ext.Panel({
            cls: 'downloadPanelItem',
            width: this.WIDTH,
            items: [this.resetLink]
        });
    },

    _clearAllAndReset: function() {
        trackDataCollectionSelectionUsage('dataCollectionClearAndReset', '');
        this.dataCollectionStore.removeAll();
        setViewPortTab(TAB_INDEX_SEARCH);
    },

    _loadMenuItemsFromHandlers: function(processedValues, collection) {

        if (!processedValues.menuItems) {
            processedValues.menuItems = [];
        }

        var downloadHandlers = Portal.cart.DownloadHandler.handlersForDataCollection(collection);
        Ext.each(downloadHandlers, function(handler) {

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

        var self = this;

        params.onAccept = function(callbackParams) {
            self.downloader.download(collection, generateUrlCallbackScope, generateUrlCallback, callbackParams);
            trackDownloadUsage(
                OpenLayers.i18n('downloadTrackingActionPrefix') + OpenLayers.i18n(textKey),
                collection.getTitle(),
                undefined
            );
        };

        this.confirmationWindow.show(params);
    }
});
