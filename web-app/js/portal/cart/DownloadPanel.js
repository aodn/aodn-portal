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
            title: OpenLayers.i18n('stepHeader', {stepNumber: 3, stepDescription: OpenLayers.i18n('step3Description')}),
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
        Ext.MsgBus.subscribe(PORTAL_EVENTS.DATA_COLLECTION_MODIFIED, function() { this.generateContent() }, this);
    },

    onDownloadRequested: function(downloadUrl, collection) {
        log.debug('Download requested', downloadUrl, collection.getTitle());
        this.generateContent();
    },

    onDownloadStarted: function(downloadUrl, collection) {
        log.debug('Download started', downloadUrl, collection.getTitle());
        this.generateContent();
    },

    onDownloadFailed: function(downloadUrl, collection, msg) {

        Ext.Msg.alert(
            OpenLayers.i18n('errorDialogTitle'),
            msg
        );
        log.error('Download failed', downloadUrl, collection.getTitle(), msg);
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

        processedValues.intersect = new Portal.filter.combiner.SpatialSubsetIntersectTester().testSpatialSubsetIntersect(collection);
        this._loadMenuItemsFromHandlers(processedValues, collection);

        return this._applyTemplate(tpl, processedValues);
    },

    _applyTemplate: function(tpl, values) {
        return tpl.apply(values);
    },

    initButtonPanel: function() {

        this.resetLink = new Ext.ux.Hyperlink({
            text: OpenLayers.i18n("clearLinkLabel", {text: OpenLayers.i18n('clearAndResetLabel')}),
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

    hasDuplicateWfsDownloadLinks: function(downloadHandlers, filters) {

        var wfsDownloads = [];
        Ext.each(downloadHandlers, function(handler) {
            Ext.each(handler.getDownloadOptions(filters), function(downloadOption) {
                if (downloadOption.type == "WFS") {
                    wfsDownloads.push(downloadOption.textKey);
                }
            });
        });
        return (wfsDownloads.hasDuplicates());
    },

    _getMenuItem: function(handler, downloadOption, collection) {
        return {
            name: handler.onlineResource.name,
            title: handler.onlineResource.title,
            text: OpenLayers.i18n(downloadOption.textKey),
            handler: function() {
                this.confirmDownload(collection, this, downloadOption.handler, downloadOption.handlerParams);
            },
            scope: this
        }
    },

    _loadMenuItemsFromHandlers: function(processedValues, collection) {

        if (!processedValues.menuItems) {
            processedValues.menuItems = [];
        }

        var groupedMenuItems = [];
        var downloadOptionTextKeysUsed = [];
        var downloadHandlers = Portal.cart.DownloadHandler.handlersForDataCollection(collection);

        Ext.each(downloadHandlers, function(handler) {
            Ext.each(handler.getDownloadOptions(collection.getFilters()), function(downloadOption) {

                var newMenuItem = this._getMenuItem(handler, downloadOption, collection);

                if (this.hasDuplicateWfsDownloadLinks(downloadHandlers, collection.getFilters())) {
                    // add to group if a title is configured
                    if (this.getEmbeddedTitle(handler.onlineResource.title)) {
                        var groupLabel = this.getEmbeddedTitle(handler.onlineResource.title);
                        if (groupedMenuItems[groupLabel] == undefined) {
                            groupedMenuItems[groupLabel] = [];
                        }
                        groupedMenuItems[groupLabel].push(newMenuItem);
                    }
                    // otherwise only one download link will be shown for each downloadOption.textKey
                    else if (downloadOptionTextKeysUsed.indexOf(newMenuItem.text) == -1) {
                        processedValues.menuItems.push(newMenuItem);
                    }
                }
                else {
                    // no grouping
                    processedValues.menuItems.push(newMenuItem);
                }

                downloadOptionTextKeysUsed.push(newMenuItem.text);

            }, this);
        }, this);

        // grouped items will appear last
        for (var key in groupedMenuItems) {
            if (groupedMenuItems.hasOwnProperty(key)) {
                processedValues.menuItems.push(OpenLayers.i18n('menuItemGroupTitle', {title: key}));
                Ext.each(groupedMenuItems[key], function(item) {
                    processedValues.menuItems.push(item);
                });
            }
        }
    },

    getEmbeddedTitle: function(title) {
        var regexBracketContents = /\(([^)]+)\)/;
        var regexRes = regexBracketContents.exec(title);
        return (regexRes && regexRes[1].length > 0) ? regexRes[1].toTitleCase() : false;
    },

    confirmDownload: function(collection, generateUrlCallbackScope, generateUrlCallback, params) {

        var self = this;

        params = params || {};
        params.collection = collection;

        params.onAccept = function(callbackParams) {

            self.downloader.download(collection, generateUrlCallbackScope, generateUrlCallback, callbackParams);
            var trackingAction = OpenLayers.i18n('downloadTrackingActionPrefix') + callbackParams.downloadLabel;

            trackDownloadUsage(
                trackingAction,
                collection.getTitle(),
                self._getCollectionFiltersAsText(collection)
            );

            if (callbackParams.emailAddress != undefined) {

                var emailRequiredForDownload = callbackParams.collectEmailAddress != undefined ?
                    "emailWasRequested" : "emailWasStoredInSession";

                trackUserUsage(
                    trackingAction,
                    callbackParams.emailAddress,
                    collection.getTitle(),
                    emailRequiredForDownload
                );
            }
        };
        this.confirmationWindow.show(params);
    },

    _getCollectionFiltersAsText: function(dataCollection) {

        var describer = new Portal.filter.combiner.HumanReadableFilterDescriber({
            filters: dataCollection.getFilters()
        });

        return describer.buildDescription(' ');
    }
});
