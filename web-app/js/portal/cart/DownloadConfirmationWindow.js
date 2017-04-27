Ext.namespace('Portal.cart');

Portal.cart.DownloadConfirmationWindow = Ext.extend(Ext.Window, {

    WINDOW_WIDTH: 780,
    WINDOW_HEIGHT: 570,

    initComponent: function() {

        // Content
        this.contentPanel = new Ext.Panel({
            tpl: OpenLayers.i18n('downloadConfirmationWindowContent'),
            resizable: false
        });

        // Controls
        this.downloadButton = new Ext.Button({
            text: OpenLayers.i18n('downloadConfirmationDownloadText'),
            listeners: {
                scope: this,
                click: this.onAccept
            }
        });

        var cancelButton = new Ext.Button({
            text: OpenLayers.i18n('downloadConfirmationCancelText'),
            listeners: {
                scope: this,
                click: this.onCancel
            }
        });

        this.downloadEmailPanel = new Portal.cart.DownloadEmailPanel({
            listeners: {
                scope: this,
                'valid': function() {
                    if (this.downloadEmailPanel.isVisible()) {
                        this.downloadButton.enable();
                    }
                },
                'invalid': function() {
                    if (this.downloadEmailPanel.isVisible()) {
                        this.downloadButton.disable();
                    }
                }

            }
        });

        this.downloadCalculatorPanel = new Portal.cart.DownloadCalculatorPanel();

        Ext.apply(this, {
            title:OpenLayers.i18n('downloadConfirmationWindowTitle'),
            modal: true,
            autoScroll: true,
            padding: 20,
            height: this.WINDOW_HEIGHT,
            width: this.WINDOW_WIDTH,
            items: {
                items: [
                    this.downloadEmailPanel,
                    {xtype: 'spacer', height: 5},
                    this.downloadCalculatorPanel,
                    {xtype: 'spacer', height: 15},
                    this.contentPanel
                ],
                buttons: [this.downloadButton, cancelButton],
                keys: [
                    {
                        key: [Ext.EventObject.ESCAPE],
                        handler: this.onCancel,
                        scope: this
                    }
                ]
            },
            listeners: {
                show: this.onShow,
                scope: this
            }
        });

        Portal.cart.DownloadConfirmationWindow.superclass.initComponent.apply(this, arguments);
    },

    hide: function() {
        try {
            Portal.cart.DownloadConfirmationWindow.superclass.hide.call(this);
        }
        catch (e) {
            /**
             * Explicitly ignoring exception
             *
             * https://github.com/aodn/aodn-portal/issues/486
             *
             * Same bugfix as for #175:
             * https://github.com/aodn/aodn-portal/issues/175
             */
        }
    },

    show: function(params) {
        this._showEmailPanelIfNeeded(params);

        this.params = params;
        this.onAcceptCallback = params.onAccept;

        this._showDownloadCalculatorPanelIfNeeded();

        Portal.cart.DownloadConfirmationWindow.superclass.show.call(this);

        var metadataRecord = params.collection.getMetadataRecord();
        this.contentPanel.update(metadataRecord.data);

        // Undocumented, but works around a Ext bug where the shadow
        // doesn't resize when the content does:
        if (typeof(this.syncShadow) === 'function') {
            this.syncShadow();
        }
    },

    _showEmailPanelIfNeeded: function(params) {

        if (params.collectEmailAddress) {
            this.downloadEmailPanel.show();
            this.downloadButton.disable();
        }
        else {
            this.downloadEmailPanel.hide();
            this.downloadButton.enable();
        }
    },

    _showDownloadCalculatorPanelIfNeeded: function() {

        if (this.params.onLoadConfirmationWindow) {

            this.params.onLoadConfirmationWindow(this.params);
            this.downloadCalculatorPanel.show();
        }
        else {
            this.downloadCalculatorPanel.hide();
        }
    },

    onAccept: function() {
        this.hide();

        if (this.onAcceptCallback) {
            this.params.emailAddress = this.downloadEmailPanel.getEmailValue();
            if (this.downloadEmailPanel.downloadChallengePanel.isChallenged()) {
                this.params.challengeResponse = this.downloadEmailPanel.downloadChallengePanel.getChallengeResponseValue();
            }
            this.onAcceptCallback(this.params);
        }
    },

    onCancel: function() {
        this.hide();
    }
});
