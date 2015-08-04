

Ext.namespace('Portal.cart');

Portal.cart.DownloadConfirmationWindow = Ext.extend(Ext.Window, {

    initComponent: function() {

        // Content
        var contentPanel = new Ext.Panel({
            html: OpenLayers.i18n(
                'downloadConfirmationWindowContent', {
                    downloadDatasetHelpUrl: Portal.app.appConfig.help.downloadDatasetUrl,
                    helpUrl: Portal.app.appConfig.help.url
                }
            ),
            width: 450,
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
                        this.downloadButton.enable()
                    }
                },
                'invalid': function() {
                    if (this.downloadEmailPanel.isVisible()) {
                        this.downloadButton.disable()
                    }
                }
            }
        });

        this.downloadChallengePanel = new Portal.cart.DownloadChallengePanel({});

        Ext.apply(this, {
            title:OpenLayers.i18n('downloadConfirmationWindowTitle'),
            modal: true,
            padding: 15,
            layout: 'fit',
            items: {
                autoHeight: true,
                autoWidth: true,
                padding: 5,
                xtype: 'form',
                items: [
                    this.downloadEmailPanel,
                    this.downloadChallengePanel,
                    {xtype: 'spacer', height: 20},
                    contentPanel
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

        Portal.cart.DownloadConfirmationWindow.superclass.show.call(this);
    },

    _showEmailPanelIfNeeded: function(params) {

        if (params.collectEmailAddress) {
            this.downloadEmailPanel.show();
            this.downloadChallengePanel.show();
            this.downloadButton.disable();
        }
        else {
            this.downloadEmailPanel.hide();
            this.downloadChallengePanel.hide();
            this.downloadButton.enable();
        }
    },

    onAccept: function() {
        this.hide();

        if (this.onAcceptCallback) {
            this.params.emailAddress = this.downloadEmailPanel.getEmailValue();
            if (this.downloadChallengePanel.isChallenged()) {
                this.params.challengeResponse = this.downloadChallengePanel.getChallengeResponseValue();
            }
            this.onAcceptCallback(this.params);
        }
    },

    onCancel: function() {
        this.hide();
    }
});
